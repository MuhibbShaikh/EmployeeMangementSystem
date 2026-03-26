from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Leave, Employee, User
from app.schemas.schemas import Leave as LeaveSchema, LeaveCreate, LeaveUpdate
from app.api.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/leaves", tags=["Leaves"])

@router.post("/", response_model=LeaveSchema)
def apply_leave(
    leave: LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found"
        )
    
    new_leave = Leave(
        employee_id=employee.id,
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
        status="pending"
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    
    response = LeaveSchema.from_orm(new_leave)
    response.employee_name = employee.name
    return response

@router.get("/", response_model=List[LeaveSchema])
def get_all_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        leaves = db.query(Leave).all()
    else:
        employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
        if not employee:
            return []
        leaves = db.query(Leave).filter(Leave.employee_id == employee.id).all()
    
    result = []
    for leave in leaves:
        leave_data = LeaveSchema.from_orm(leave)
        leave_data.employee_name = leave.employee.name
        result.append(leave_data)
    
    return result

@router.get("/pending", response_model=List[LeaveSchema])
def get_pending_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    leaves = db.query(Leave).filter(Leave.status == "pending").all()
    
    result = []
    for leave in leaves:
        leave_data = LeaveSchema.from_orm(leave)
        leave_data.employee_name = leave.employee.name
        result.append(leave_data)
    
    return result

@router.put("/{leave_id}", response_model=LeaveSchema)
def update_leave_status(
    leave_id: int,
    leave_update: LeaveUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found"
        )
    
    leave.status = leave_update.status
    db.commit()
    db.refresh(leave)
    
    response = LeaveSchema.from_orm(leave)
    response.employee_name = leave.employee.name
    return response

@router.delete("/{leave_id}")
def delete_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found"
        )
    
    # Only admin or the employee who applied can delete
    if current_user.role != "admin":
        employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
        if not employee or leave.employee_id != employee.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    
    db.delete(leave)
    db.commit()
    
    return {"message": "Leave deleted successfully"}
