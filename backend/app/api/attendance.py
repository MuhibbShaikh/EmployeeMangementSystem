from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.db.database import get_db
from app.models.models import Attendance, Employee, User
from app.schemas.schemas import Attendance as AttendanceSchema, AttendanceCreate
from app.api.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/", response_model=AttendanceSchema)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found"
        )
    
    # Check if attendance already marked for today
    existing = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == attendance.date
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this date"
        )
    
    new_attendance = Attendance(
        employee_id=employee.id,
        date=attendance.date,
        status=attendance.status
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    
    return new_attendance

@router.get("/", response_model=List[AttendanceSchema])
def get_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        attendance = db.query(Attendance).all()
    else:
        employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
        if not employee:
            return []
        attendance = db.query(Attendance).filter(Attendance.employee_id == employee.id).all()
    
    return attendance

@router.get("/today")
def check_today_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return {"marked": False}
    
    today = date.today()
    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()
    
    return {"marked": attendance is not None, "status": attendance.status if attendance else None}

@router.get("/employee/{employee_id}", response_model=List[AttendanceSchema])
def get_employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    attendance = db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
    return attendance
