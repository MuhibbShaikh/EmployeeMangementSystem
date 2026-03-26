from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.models import Employee, Department, Leave, Attendance, Payroll, User
from app.schemas.schemas import DashboardStats, EmployeeDashboard
from app.api.dependencies import get_current_user, get_current_admin
from datetime import date

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/admin", response_model=DashboardStats)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    total_employees = db.query(Employee).count()
    total_departments = db.query(Department).count()
    pending_leaves = db.query(Leave).filter(Leave.status == "pending").count()
    
    # Calculate total salary expense
    total_salary = db.query(func.sum(Employee.salary)).scalar() or 0
    
    return {
        "total_employees": total_employees,
        "total_departments": total_departments,
        "pending_leaves": pending_leaves,
        "total_salary_expense": total_salary
    }

@router.get("/employee", response_model=EmployeeDashboard)
def get_employee_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return {
            "leave_balance": 0,
            "attendance_count": 0,
            "latest_salary": None
        }
    
    # Calculate leave balance (assuming 12 days per year)
    total_leaves = db.query(Leave).filter(
        Leave.employee_id == employee.id,
        Leave.status == "approved"
    ).count()
    leave_balance = max(0, 12 - total_leaves)
    
    # Count attendance
    attendance_count = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.status == "present"
    ).count()
    
    # Get latest salary
    latest_payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee.id
    ).order_by(Payroll.created_at.desc()).first()
    
    latest_salary = latest_payroll.net_salary if latest_payroll else employee.salary
    
    return {
        "leave_balance": leave_balance,
        "attendance_count": attendance_count,
        "latest_salary": latest_salary
    }

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # Get monthly salary data for chart
    payrolls = db.query(Payroll).all()
    monthly_data = {}
    for payroll in payrolls:
        month = payroll.month
        if month not in monthly_data:
            monthly_data[month] = 0
        monthly_data[month] += payroll.net_salary
    
    salary_chart = [{"month": k, "amount": v} for k, v in monthly_data.items()]
    
    # Get department-wise employee count
    departments = db.query(Department).all()
    dept_data = []
    for dept in departments:
        count = db.query(Employee).filter(Employee.department_id == dept.id).count()
        dept_data.append({"name": dept.name, "count": count})
    
    return {
        "salary_chart": salary_chart,
        "department_distribution": dept_data
    }
