# 🧪 API Testing Guide

## Quick Test with cURL

### 1. Login as Admin
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "role": "admin",
  "employee_id": null
}
```

Save the token for subsequent requests.

### 2. Create a Department
```bash
curl -X POST http://localhost:8000/departments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"IT Department"}'
```

### 3. Create an Employee
```bash
curl -X POST http://localhost:8000/employees/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "employee_id": "EMP001",
    "name": "John Doe",
    "email": "john@company.com",
    "password": "password123",
    "phone": "1234567890",
    "department_id": 1,
    "designation": "Software Engineer",
    "salary": 50000,
    "joining_date": "2024-01-01"
  }'
```

### 4. Get All Employees
```bash
curl -X GET http://localhost:8000/employees/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Apply for Leave (as Employee)
```bash
# First login as employee
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@company.com","password":"password123"}'

# Then apply for leave
curl -X POST http://localhost:8000/leaves/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -d '{
    "leave_type": "Sick Leave",
    "start_date": "2024-02-20",
    "end_date": "2024-02-22",
    "reason": "Medical appointment"
  }'
```

### 6. Approve Leave (as Admin)
```bash
curl -X PUT http://localhost:8000/leaves/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"status":"approved"}'
```

### 7. Mark Attendance (as Employee)
```bash
curl -X POST http://localhost:8000/attendance/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -d '{
    "date": "2024-02-13",
    "status": "present"
  }'
```

### 8. Generate Payroll (as Admin)
```bash
curl -X POST http://localhost:8000/payroll/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "employee_id": 1,
    "month": "2024-02",
    "bonus": 5000,
    "deduction": 1000
  }'
```

### 9. Get Admin Dashboard
```bash
curl -X GET http://localhost:8000/dashboard/admin \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 10. Get Employee Dashboard
```bash
curl -X GET http://localhost:8000/dashboard/employee \
  -H "Authorization: Bearer EMPLOYEE_TOKEN"
```

## Testing with Python

### Installation
```bash
pip install requests
```

### Test Script
```python
import requests

BASE_URL = "http://localhost:8000"

# Login
def login(email, password):
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password}
    )
    return response.json()["access_token"]

# Get headers with token
def get_headers(token):
    return {"Authorization": f"Bearer {token}"}

# Test flow
def test_flow():
    # 1. Login as admin
    admin_token = login("admin@company.com", "admin123")
    headers = get_headers(admin_token)
    
    # 2. Create department
    dept = requests.post(
        f"{BASE_URL}/departments/",
        json={"name": "Sales"},
        headers=headers
    ).json()
    print(f"Created department: {dept}")
    
    # 3. Create employee
    emp = requests.post(
        f"{BASE_URL}/employees/",
        json={
            "employee_id": "EMP002",
            "name": "Jane Smith",
            "email": "jane@company.com",
            "password": "pass123",
            "department_id": dept["id"],
            "designation": "Sales Manager",
            "salary": 60000
        },
        headers=headers
    ).json()
    print(f"Created employee: {emp}")
    
    # 4. Login as employee
    emp_token = login("jane@company.com", "pass123")
    emp_headers = get_headers(emp_token)
    
    # 5. Apply for leave
    leave = requests.post(
        f"{BASE_URL}/leaves/",
        json={
            "leave_type": "Casual Leave",
            "start_date": "2024-03-01",
            "end_date": "2024-03-03",
            "reason": "Personal"
        },
        headers=emp_headers
    ).json()
    print(f"Applied leave: {leave}")
    
    # 6. Approve leave (as admin)
    approved = requests.put(
        f"{BASE_URL}/leaves/{leave['id']}",
        json={"status": "approved"},
        headers=headers
    ).json()
    print(f"Approved leave: {approved}")
    
    print("✓ All tests passed!")

if __name__ == "__main__":
    test_flow()
```

## Testing with Postman

### Import Collection

Create a Postman collection with these requests:

#### 1. Variables
- `base_url`: http://localhost:8000
- `admin_token`: (set after login)
- `employee_token`: (set after login)

#### 2. Requests

**Auth - Login Admin**
- Method: POST
- URL: {{base_url}}/auth/login
- Body:
```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```
- Tests:
```javascript
pm.environment.set("admin_token", pm.response.json().access_token);
```

**Employees - Get All**
- Method: GET
- URL: {{base_url}}/employees/
- Headers: `Authorization: Bearer {{admin_token}}`

**Leaves - Apply**
- Method: POST
- URL: {{base_url}}/leaves/
- Headers: `Authorization: Bearer {{employee_token}}`
- Body:
```json
{
  "leave_type": "Sick Leave",
  "start_date": "2024-02-20",
  "end_date": "2024-02-21",
  "reason": "Not feeling well"
}
```

## Automated Testing

### Backend Tests (pytest)

```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login():
    response = client.post(
        "/auth/login",
        json={"email": "admin@company.com", "password": "admin123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_employee():
    # Login first
    login_response = client.post(
        "/auth/login",
        json={"email": "admin@company.com", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Create employee
    response = client.post(
        "/employees/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "employee_id": "TEST001",
            "name": "Test User",
            "email": "test@company.com",
            "password": "test123",
            "salary": 40000
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test User"
```

Run tests:
```bash
pytest tests/
```

### Frontend Tests (Vitest)

```javascript
// src/services/api.test.js
import { describe, it, expect } from 'vitest'
import { login } from './api'

describe('API Service', () => {
  it('should login successfully', async () => {
    const response = await login('admin@company.com', 'admin123')
    expect(response.data).toHaveProperty('access_token')
  })
})
```

## Load Testing

### Using Apache Bench
```bash
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:8000/auth/login
```

### Using k6
```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const payload = JSON.stringify({
    email: 'admin@company.com',
    password: 'admin123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('http://localhost:8000/auth/login', payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('access_token') !== undefined,
  });
}
```

Run:
```bash
k6 run load-test.js
```

## Manual Testing Checklist

### Authentication
- [ ] Admin can login
- [ ] Employee can login
- [ ] Invalid credentials rejected
- [ ] Token expiration works
- [ ] Logout clears session

### Employee Management
- [ ] Admin can create employee
- [ ] Admin can edit employee
- [ ] Admin can delete employee
- [ ] Admin can view all employees
- [ ] Employee can view own profile
- [ ] Duplicate email rejected
- [ ] Duplicate employee ID rejected

### Leave Management
- [ ] Employee can apply for leave
- [ ] Admin can view pending leaves
- [ ] Admin can approve leave
- [ ] Admin can reject leave
- [ ] Employee can view leave status
- [ ] Leave balance calculated correctly

### Attendance
- [ ] Employee can mark attendance
- [ ] Duplicate attendance prevented
- [ ] Admin can view all attendance
- [ ] Attendance count accurate

### Payroll
- [ ] Admin can generate payroll
- [ ] Net salary calculated correctly
- [ ] Employee can view salary
- [ ] Duplicate payroll prevented

### Dashboard
- [ ] Admin dashboard shows correct stats
- [ ] Employee dashboard shows correct stats
- [ ] Charts render correctly
- [ ] Data updates in real-time

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check CORS settings in main.py

### Issue: Token Invalid
**Solution:** Re-login to get fresh token

### Issue: 404 Not Found
**Solution:** Check API endpoint URL and backend is running

### Issue: Database Error
**Solution:** Delete .db file and restart to recreate tables
