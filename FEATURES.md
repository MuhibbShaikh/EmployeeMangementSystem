# 📋 Features Documentation

## Core Features

### 1. Authentication & Authorization

#### JWT-Based Authentication
- Secure token-based authentication
- Token expiration and refresh
- Role-based access control (Admin & Employee)

#### User Roles
- **Admin**: Full system access
  - Manage employees
  - Approve/reject leaves
  - Generate payroll
  - View all analytics
  
- **Employee**: Limited access
  - View own profile
  - Apply for leaves
  - Mark attendance
  - View salary records

### 2. Employee Management

#### Admin Capabilities
- Create new employees
- Edit employee details
- Delete employees
- View all employees in table format
- Assign departments
- Set salary and designation

#### Employee Fields
- Employee ID (unique)
- Name
- Email
- Phone
- Department
- Designation
- Salary
- Joining Date

#### Employee Capabilities
- View own profile
- See department and salary information
- Update allowed (admin only)

### 3. Department Management

#### Features
- Create departments
- View all departments
- Delete departments
- Assign employees to departments
- Track department-wise employee count

#### Default Departments
- Engineering
- HR
- Sales
- Marketing
- Finance

### 4. Leave Management System

#### Employee Features
- Apply for leave
- View leave history
- See leave status (Pending/Approved/Rejected)
- Leave types:
  - Sick Leave
  - Casual Leave
  - Annual Leave

#### Admin Features
- View all pending leave requests
- Approve leave requests
- Reject leave requests
- Track leave history

#### Leave Tracking
- Start date and end date
- Reason for leave
- Status tracking
- Leave balance calculation (12 days/year)

### 5. Attendance Tracking

#### Employee Features
- Mark daily attendance (one-time per day)
- View attendance history
- Check today's attendance status
- Simple Present/Absent marking

#### Admin Features
- View all employee attendance
- Generate attendance reports
- Track attendance patterns

#### Attendance Rules
- One entry per day per employee
- Cannot mark duplicate attendance
- Status: Present or Absent

### 6. Payroll Management

#### Salary Calculation
```
Net Salary = Base Salary + Bonus - Deduction
```

#### Admin Features
- Generate monthly payroll
- Add bonus amounts
- Add deductions
- View salary history
- Track total salary expenses
- Month-wise payroll generation

#### Employee Features
- View own salary records
- See salary breakdown:
  - Base salary
  - Bonus
  - Deductions
  - Net salary
- Download salary slips (future enhancement)

#### Payroll Fields
- Month (YYYY-MM format)
- Base Salary (from employee profile)
- Bonus
- Deduction
- Net Salary (calculated)

### 7. Dashboard & Analytics

#### Admin Dashboard
**Key Metrics:**
- Total Employees
- Total Departments
- Pending Leave Requests
- Total Salary Expense

**Charts:**
- Monthly Salary Expenses (Bar Chart)
- Department Distribution (Pie Chart)

#### Employee Dashboard
**Key Metrics:**
- Leave Balance
- Attendance Count
- Latest Salary

**Quick Actions:**
- Apply for Leave
- Mark Attendance
- View Salary

### 8. User Interface Features

#### Design
- Modern, clean interface
- Responsive design (mobile-friendly)
- Tailwind CSS styling
- Professional color scheme (Indigo/Purple)

#### Components
- Modal dialogs for forms
- Table views for data
- Interactive charts (Recharts)
- Loading states
- Error handling

#### Navigation
- Sidebar navigation
- Mobile-responsive menu
- Role-based menu items
- Logout functionality

## Technical Features

### Backend (FastAPI)

#### API Structure
- RESTful API design
- Automatic API documentation (Swagger/OpenAPI)
- CORS enabled
- Error handling

#### Database
- SQLAlchemy ORM
- SQLite (development)
- PostgreSQL ready (production)
- Automatic table creation

#### Security
- Password hashing (bcrypt)
- JWT tokens
- Role-based middleware
- Input validation (Pydantic)

#### API Endpoints

**Authentication:**
- POST /auth/login
- POST /auth/register

**Employees:**
- GET /employees/
- POST /employees/
- GET /employees/me
- GET /employees/{id}
- PUT /employees/{id}
- DELETE /employees/{id}

**Departments:**
- GET /departments/
- POST /departments/
- DELETE /departments/{id}

**Leaves:**
- GET /leaves/
- POST /leaves/
- GET /leaves/pending
- PUT /leaves/{id}
- DELETE /leaves/{id}

**Attendance:**
- GET /attendance/
- POST /attendance/
- GET /attendance/today
- GET /attendance/employee/{id}

**Payroll:**
- GET /payroll/
- POST /payroll/
- GET /payroll/my-salary
- GET /payroll/employee/{id}

**Dashboard:**
- GET /dashboard/admin
- GET /dashboard/employee
- GET /dashboard/stats

### Frontend (React + Vite)

#### State Management
- React Context API
- Custom hooks
- Local state management

#### Routing
- React Router v6
- Protected routes
- Role-based routing
- Redirect logic

#### API Integration
- Axios HTTP client
- Centralized API service
- Token management
- Error handling

#### Charts
- Recharts library
- Bar charts
- Pie charts
- Responsive charts

## Workflow Examples

### 1. Employee Onboarding
1. Admin creates employee account
2. Employee receives credentials
3. Employee logs in
4. Employee views profile
5. Employee can start marking attendance

### 2. Leave Application Process
1. Employee applies for leave
2. Admin sees pending request
3. Admin reviews and approves/rejects
4. Employee sees updated status
5. Leave balance automatically updates

### 3. Monthly Payroll Generation
1. Admin selects employee
2. Admin selects month
3. Admin adds bonus/deductions
4. System calculates net salary
5. Payroll record created
6. Employee can view salary slip

### 4. Attendance Marking
1. Employee marks attendance daily
2. System prevents duplicates
3. Admin can view all records
4. Dashboard shows attendance count

## Future Enhancements

### Planned Features
- [ ] Email notifications
- [ ] PDF salary slips
- [ ] Advanced analytics
- [ ] Employee performance tracking
- [ ] Document management
- [ ] Shift management
- [ ] Holiday calendar
- [ ] Announcement system
- [ ] Chat/messaging
- [ ] Mobile app

### Scalability Considerations
- Redis caching
- Database indexing
- CDN for static assets
- Microservices architecture
- Queue system for background tasks
- Rate limiting
- Load balancing

## Best Practices Implemented

### Code Quality
- Type hints in Python
- PropTypes in React
- Consistent naming conventions
- Modular code structure
- Reusable components

### Security
- Password hashing
- JWT authentication
- SQL injection prevention (ORM)
- CORS configuration
- Input validation

### User Experience
- Loading states
- Error messages
- Confirmation dialogs
- Responsive design
- Intuitive navigation

### Performance
- Optimized queries
- Lazy loading
- Code splitting
- Image optimization
- Caching strategies
