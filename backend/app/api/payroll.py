from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Payroll, Employee, User
from app.schemas.schemas import Payroll as PayrollSchema, PayrollCreate
from app.api.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/payroll", tags=["Payroll"])

@router.post("/", response_model=PayrollSchema)
def generate_payroll(
    payroll: PayrollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    employee = db.query(Employee).filter(Employee.id == payroll.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Check if payroll already exists for this month
    existing = db.query(Payroll).filter(
        Payroll.employee_id == payroll.employee_id,
        Payroll.month == payroll.month
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payroll already generated for this month"
        )
    
    # Calculate net salary
    net_salary = (employee.salary or 0) + payroll.bonus - payroll.deduction
    
    new_payroll = Payroll(
        employee_id=payroll.employee_id,
        month=payroll.month,
        base_salary=employee.salary or 0,
        bonus=payroll.bonus,
        deduction=payroll.deduction,
        net_salary=net_salary
    )
    db.add(new_payroll)
    db.commit()
    db.refresh(new_payroll)
    
    response = PayrollSchema.from_orm(new_payroll)
    response.employee_name = employee.name
    return response

@router.get("/", response_model=List[PayrollSchema])
def get_all_payroll(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    payrolls = db.query(Payroll).all()
    
    result = []
    for payroll in payrolls:
        payroll_data = PayrollSchema.from_orm(payroll)
        payroll_data.employee_name = payroll.employee.name
        result.append(payroll_data)
    
    return result

@router.get("/my-salary", response_model=List[PayrollSchema])
def get_my_salary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return []
    
    payrolls = db.query(Payroll).filter(Payroll.employee_id == employee.id).all()
    
    result = []
    for payroll in payrolls:
        payroll_data = PayrollSchema.from_orm(payroll)
        payroll_data.employee_name = employee.name
        result.append(payroll_data)
    
    return result

@router.get("/employee/{employee_id}", response_model=List[PayrollSchema])
def get_employee_payroll(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    payrolls = db.query(Payroll).filter(Payroll.employee_id == employee_id).all()
    
    result = []
    for payroll in payrolls:
        payroll_data = PayrollSchema.from_orm(payroll)
        payroll_data.employee_name = employee.name
        result.append(payroll_data)
    
    return result

@router.delete("/{payroll_id}")
def delete_payroll(
    payroll_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    payroll = db.query(Payroll).filter(Payroll.id == payroll_id).first()
    if not payroll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payroll not found"
        )
    
    db.delete(payroll)
    db.commit()
    
    return {"message": "Payroll deleted successfully"}
