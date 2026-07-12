# 📄 Product Requirements Document (PRD)

# Student Assignment Tracker

**Version:** 1.0
**Project Type:** Full Stack Web Application
**Prepared By:** Hemanth
**Target Audience:** Students, Faculty (Future Scope)
**Estimated Development Time:** 2–3 Weeks

---

# 1. Project Overview

## Product Name

**Student Assignment Tracker**

---

## Project Description

Student Assignment Tracker is a web-based application that helps students organize, manage, and monitor their academic assignments. The application allows users to create assignments, categorize them by subject, set due dates, receive reminders, monitor completion progress, and keep track of overdue work.

Instead of relying on notebooks, sticky notes, or memory (which has an impressive record of failing right before deadlines), students can manage everything in one centralized dashboard.

The project demonstrates a complete Full Stack architecture including:

* Frontend
* Backend
* Database
* Authentication
* Business Logic
* CRUD Operations
* Dashboard Analytics

---

# 2. Problem Statement

Students often face problems such as:

* Forgetting assignment deadlines
* Poor time management
* Losing assignment details
* No centralized system
* Difficulty tracking completed work
* Missing submissions
* No progress visualization

The Student Assignment Tracker solves these issues by providing one platform for managing academic work efficiently.

---

# 3. Objectives

The application should allow users to:

* Register/Login securely
* Add assignments
* Edit assignments
* Delete assignments
* View all assignments
* Search assignments
* Filter assignments
* Track completion
* View statistics
* Detect overdue assignments automatically

---

# 4. Goals

### Primary Goals

* Help students stay organized
* Reduce missed deadlines
* Improve productivity
* Visualize academic workload

### Secondary Goals

* Learn Full Stack Development
* Practice CRUD Operations
* Implement Authentication
* Implement Business Logic

---

# 5. Target Users

Primary Users

* College Students
* School Students
* Online Course Learners

Future Users

* Teachers
* Mentors
* Educational Institutes

---

# 6. Scope

## In Scope

* User Registration
* Login
* JWT Authentication
* Assignment CRUD
* Subject Management
* Due Date Tracking
* Priority Management
* Search
* Filters
* Dashboard
* Statistics
* Responsive UI

## Out of Scope (Future)

* Notifications
* AI Suggestions
* Calendar Integration
* Team Assignments
* Faculty Dashboard
* Mobile App

---

# 7. Functional Requirements

---

## Module 1: Authentication

### Registration

User can:

* Enter Name
* Email
* Password
* Confirm Password

Validation

* Email unique
* Password minimum 8 characters
* Password encrypted using bcrypt

---

### Login

User enters:

* Email
* Password

System

* Validates credentials
* Generates JWT Token
* Redirects to Dashboard

---

### Logout

* Remove token
* Redirect to Login Page

---

# Module 2: Dashboard

Dashboard contains:

* Welcome message
* Total Assignments
* Completed Assignments
* Pending Assignments
* Overdue Assignments
* Upcoming Assignments
* Progress Bar
* Recent Activity

---

# Module 3: Assignment Management

User can:

Create Assignment

Fields:

* Title
* Description
* Subject
* Due Date
* Priority
* Estimated Hours
* Status

Status Options

* Pending
* In Progress
* Completed

Priority

* Low
* Medium
* High

Operations

* Create
* Read
* Update
* Delete

---

# Module 4: Search

Search by

* Assignment Name
* Subject

Search updates instantly.

---

# Module 5: Filters

Filter by

Status

* Pending
* Completed
* Overdue
* In Progress

Priority

* High
* Medium
* Low

Subject

* DBMS
* OS
* CN
* DSA
* etc.

---

# Module 6: Sorting

Sort assignments by

* Due Date
* Priority
* Subject
* Date Created
* Status

Ascending/Descending

---

# Module 7: Progress Tracking

Progress bar

Example

Total Assignments = 20

Completed = 15

Progress

75%

---

# Module 8: Statistics

Cards

Total Assignments

Completed

Pending

Overdue

High Priority

Completion Percentage

Graphs

Assignments per Subject

Completion Trend

Priority Distribution

---

# Module 9: Profile

User can

Update

* Name
* Password

View

* Email
* Joined Date

---

# 8. Business Logic

This section is the core of the application.

---

## Rule 1

If

Current Date > Due Date

AND

Status != Completed

Then

Assignment becomes

Overdue

Automatically

---

## Rule 2

Progress %

Completed Assignments

÷

Total Assignments

×

100

---

## Rule 3

Priority Colors

High → Red

Medium → Orange

Low → Green

---

## Rule 4

Completed Assignment

Cannot become overdue.

---

## Rule 5

Past due date cannot be selected while creating a new assignment.

---

## Rule 6

Search ignores case sensitivity.

Example

dbms

DBMS

Dbms

All produce same result.

---

## Rule 7

Each assignment belongs to exactly one user.

Users cannot access other users' assignments.

---

## Rule 8

Deleting an assignment permanently removes it.

---

## Rule 9

Duplicate assignment titles are allowed because different subjects may have similar names.

---

## Rule 10

Dashboard updates automatically whenever:

* Assignment created
* Assignment edited
* Assignment deleted
* Assignment completed

---

# 9. Non-Functional Requirements

Performance

Dashboard loads within 2 seconds.

Availability

99% uptime.

Security

* JWT Authentication
* Password Hashing
* Protected Routes
* HTTPS Ready

Usability

* Responsive Design
* Mobile Friendly
* Clean UI

Maintainability

* Modular Code
* MVC Architecture
* Reusable Components

Scalability

Can support thousands of assignments.

---

# 10. Tech Stack

Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

Backend

* Node.js
* Express.js

Database

* MongoDB Atlas

Authentication

* JWT
* bcrypt

Deployment

Frontend

* Vercel

Backend

* Render

Database

* MongoDB Atlas

---

# 11. System Architecture

```text
                 User

                   │

             React Frontend

                   │

             Axios API Calls

                   │

             Express Backend

        Authentication Middleware

                   │

              MongoDB Atlas

```

---

# 12. Database Design

## Users Collection

```javascript
{
_id,

name,

email,

password,

createdAt

}
```

---

## Assignments Collection

```javascript
{
_id,

userId,

title,

description,

subject,

priority,

status,

dueDate,

estimatedHours,

createdAt,

updatedAt

}
```

---

# 13. API Endpoints

Authentication

POST

```
/api/auth/register
```

POST

```
/api/auth/login
```

GET

```
/api/auth/profile
```

---

Assignments

GET

```
/api/assignments
```

GET

```
/api/assignments/:id
```

POST

```
/api/assignments
```

PUT

```
/api/assignments/:id
```

DELETE

```
/api/assignments/:id
```

---

Dashboard

GET

```
/api/dashboard
```

Returns

* Total
* Completed
* Pending
* Overdue
* Progress

---

# 14. User Flow

```text
Landing Page

      │

Register/Login

      │

Dashboard

      │

Add Assignment

      │

Assignment List

      │

Search / Filter

      │

Edit Assignment

      │

Mark Completed

      │

Dashboard Updates

```

---

# 15. Wireframes (Conceptual)

## Login

```
-----------------------------

Student Assignment Tracker

Email

Password

Login Button

Register

-----------------------------
```

---

Dashboard

```
----------------------------------------

Hello Hemanth

[Total]

[Completed]

[Pending]

[Overdue]

Progress Bar

Recent Assignments

----------------------------------------
```

---

Assignment Card

```
DBMS Assignment

Priority: High

Due: 20 July

Status: Pending

Edit Delete Complete

```

---

# 16. Success Metrics

Project is successful if:

* User can register.
* User can login.
* User can perform CRUD operations.
* Dashboard updates correctly.
* Progress calculation is accurate.
* Overdue assignments update automatically.
* Search and filters work.
* Responsive UI functions properly.

---

# 17. Risks

| Risk                  | Solution                              |
| --------------------- | ------------------------------------- |
| User forgets password | Add password reset (future)           |
| Database downtime     | MongoDB Atlas backups                 |
| Invalid inputs        | Backend validation                    |
| Unauthorized access   | JWT middleware                        |
| Duplicate requests    | Disable submit button during API call |

---

# 18. Future Enhancements

* 📅 Calendar integration (Google Calendar)
* 🔔 Email and push notifications
* 🤖 AI-powered study planner
* 📊 Productivity analytics
* 📁 File attachment uploads
* 👥 Group assignments
* 📱 Android/iOS mobile app
* 🌙 Dark/Light mode customization
* 🏆 Gamification with streaks and achievement badges
* 📚 Faculty portal for assignment creation and grading
* 🔄 Recurring assignments
* 🧠 Smart workload prediction based on due dates and estimated effort
* ☁️ Cloud backup and offline sync

---

# 19. Timeline

| Phase                | Duration |
| -------------------- | -------- |
| Requirement Analysis | 1 Day    |
| UI/UX Design         | 2 Days   |
| Frontend Development | 4 Days   |
| Backend Development  | 4 Days   |
| Database Integration | 2 Days   |
| Testing & Bug Fixes  | 2 Days   |
| Deployment           | 1 Day    |
| Documentation        | 1 Day    |

**Total Estimated Duration:** **17 Days**

---

# 20. Conclusion

The **Student Assignment Tracker** is a practical, full-stack productivity application designed to help students manage assignments, monitor deadlines, and improve academic organization. It demonstrates key software engineering concepts including authentication, CRUD operations, RESTful APIs, database design, responsive user interfaces, and business logic such as automatic overdue detection and progress tracking.

From an academic perspective, this project satisfies the required components of a modern software application:

* ✅ Frontend (React.js)
* ✅ Backend (Node.js & Express.js)
* ✅ Database (MongoDB Atlas)
* ✅ Business Logic (assignment lifecycle, deadline validation, progress computation, user-specific data access)
* ✅ Authentication & Authorization
* ✅ REST API Architecture
* ✅ Responsive and user-friendly interface

It is also designed with future scalability in mind, making it a strong submission project that can be extended into a production-ready student productivity platform.

This PRD is detailed enough to guide the complete design, development, testing, and deployment of the project while serving as professional documentation for academic evaluation or portfolio presentation.
