# HRMS SaaS System Architecture

## Project Overview

This project is a multi-tenant Human Resource Management System (HRMS) built using the MERN Stack.

Stack:
- MongoDB
- Express.js
- React.js
- Node.js

The system allows multiple organizations (tenants) to manage their employees independently through a centralized platform.

There are three major actors:

- Super Admin
- Tenant
- Employees

## System Hierarchy

```text
Super Admin
      │
      ▼
Creates Tenant
      │
      ▼
Tenant Admin
      │
 ┌────┼────┐
 ▼    ▼    ▼
HR Manager Employee
```

## Roles

### Super Admin

- Create Tenant
- Manage Tenant
- Suspend Tenant
- Activate Tenant
- View All Organizations

---

### Tenant Admin

- Manage Company
- Manage Departments
- Manage Employees
- Assign Roles
- Manage Settings

---

### HR

- Add Employee
- Update Employee
- Approve Leave
- View Attendance

---

### Manager

- Manage Team
- Assign Tasks
- Approve Team Leave
- View Team Attendance

---

### Employee

- Login
- Mark Attendance
- Apply Leave
- View Tasks
- Update Profile

## Authentication Flow

```text
Super Admin

↓

Creates Tenant

↓

Tenant Admin Created

↓

Tenant Admin Login

↓

Creates Departments

↓

Creates Employees

↓

Employee Login

↓

Attendance

↓

Leave

↓

Dashboard
```

## Core Modules

- Authentication
- Tenant Management
- Role & Permission Management
- Department Management
- Employee Management
- Attendance Management
- Leave Management
- Task Management
- Notification Management
- Dashboard & Reports
- Audit Logs

## Database Collections

- Tenants
- Users
- Roles
- Permissions
- Departments
- Employees
- Attendance
- LeaveRequests
- Tasks
- Notifications
- AuditLogs

## Development Order

1. Database Design
2. Mongoose Models
3. Seed Roles & Permissions
4. Authentication
5. Tenant Module
6. Department Module
7. Employee Module
8. Attendance Module
9. Leave Module
10. Task Module
11. Notification Module
12. Dashboard
13. Reports
14. React Frontend
15. Deployment