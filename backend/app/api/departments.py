from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Department, User
from app.schemas.schemas import Department as DepartmentSchema, DepartmentCreate
from app.api.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.post("/", response_model=DepartmentSchema)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    existing = db.query(Department).filter(Department.name == department.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department already exists"
        )
    
    new_department = Department(name=department.name)
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    
    return new_department

@router.get("/", response_model=List[DepartmentSchema])
def get_all_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    departments = db.query(Department).all()
    return departments

@router.get("/{department_id}", response_model=DepartmentSchema)
def get_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    return department

@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    db.delete(department)
    db.commit()
    
    return {"message": "Department deleted successfully"}
