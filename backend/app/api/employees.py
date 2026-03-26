from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Employee, User
from app.schemas.schemas import Employee as EmployeeSchema, EmployeeCreate, EmployeeUpdate
from app.api.dependencies import get_current_user, get_current_admin
from app.core.security import get_password_hash

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=EmployeeSchema)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == employee.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if employee_id exists
    existing_emp = db.query(Employee).filter(Employee.employee_id == employee.employee_id).first()
    if existing_emp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists"
        )
    
    # Create user
    new_user = User(
        email=employee.email,
        hashed_password=get_password_hash(employee.password),
        role="employee"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create employee
    new_employee = Employee(
        user_id=new_user.id,
        employee_id=employee.employee_id,
        name=employee.name,
        phone=employee.phone,
        department_id=employee.department_id,
        designation=employee.designation,
        salary=employee.salary,
        joining_date=employee.joining_date
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    # Return employee data with email
    return EmployeeSchema(
        id=new_employee.id,
        user_id=new_employee.user_id,
        employee_id=new_employee.employee_id,
        name=new_employee.name,
        email=new_user.email,
        phone=new_employee.phone,
        department_id=new_employee.department_id,
        designation=new_employee.designation,
        salary=new_employee.salary,
        joining_date=new_employee.joining_date,
        department=new_employee.department
    )

@router.get("/", response_model=List[EmployeeSchema])
def get_all_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        result.append(EmployeeSchema(
            id=emp.id,
            user_id=emp.user_id,
            employee_id=emp.employee_id,
            name=emp.name,
            email=emp.user.email,
            phone=emp.phone,
            department_id=emp.department_id,
            designation=emp.designation,
            salary=emp.salary,
            joining_date=emp.joining_date,
            department=emp.department
        ))
    return result

@router.get("/me", response_model=EmployeeSchema)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found"
        )
    
    return EmployeeSchema(
        id=employee.id,
        user_id=employee.user_id,
        employee_id=employee.employee_id,
        name=employee.name,
        email=current_user.email,
        phone=employee.phone,
        department_id=employee.department_id,
        designation=employee.designation,
        salary=employee.salary,
        joining_date=employee.joining_date,
        department=employee.department
    )

@router.get("/{employee_id}", response_model=EmployeeSchema)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Employees can only view their own profile
    if current_user.role != "admin" and employee.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return EmployeeSchema(
        id=employee.id,
        user_id=employee.user_id,
        employee_id=employee.employee_id,
        name=employee.name,
        email=employee.user.email,
        phone=employee.phone,
        department_id=employee.department_id,
        designation=employee.designation,
        salary=employee.salary,
        joining_date=employee.joining_date,
        department=employee.department
    )

@router.put("/{employee_id}", response_model=EmployeeSchema)
def update_employee(
    employee_id: int,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    for field, value in employee_update.dict(exclude_unset=True).items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    
    return EmployeeSchema(
        id=employee.id,
        user_id=employee.user_id,
        employee_id=employee.employee_id,
        name=employee.name,
        email=employee.user.email,
        phone=employee.phone,
        department_id=employee.department_id,
        designation=employee.designation,
        salary=employee.salary,
        joining_date=employee.joining_date,
        department=employee.department
    )

@router.delete("/{employee_id}")
def delete_employee(
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
    
    # Delete associated user
    user = db.query(User).filter(User.id == employee.user_id).first()
    if user:
        db.delete(user)
    
    db.delete(employee)
    db.commit()
    
    return {"message": "Employee deleted successfully"}
