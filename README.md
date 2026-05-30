# Online Assessments Web App

A full-stack web application enabling professors to create, schedule, and manage online assessments while students attempt them in a controlled, timed environment. Supports multiple user roles — Admin, Professor, and Student — each with a dedicated feature set.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [API Overview](#api-overview)
- [Database Models](#database-models)
- [Question Types & Evaluation](#question-types--evaluation)

---

## Features

### Admin
- Approve or reject pending user registrations
- Manage course modules (create, edit, delete)
- Assign users to modules
- View enrolled users per module

### Professor
- Create and schedule assessments with a defined time window
- Add questions of four types: MCQ, Fill in the Blank, Essay, and Coding
- Add test cases for coding questions (executed via JDoodle API)
- Edit and delete assessments
- View student submissions and run batch auto-evaluation
- Manually override marks and add per-student feedback
- Release marks to students
- View class-wide performance statistics

### Student
- Browse available modules and their assessments
- Attempt assessments with a live countdown timer
- Save progress and resume within the assessment window
- Submit answers across all four question types
- View scores, auto-evaluation details, and professor feedback after marks are released
- Real-time internet connection monitoring with an alert modal

### Shared (Professor & Student)
- View assessment details and questions
- Discussion forum per question — start threads and reply to existing discussions

---

## Tech Stack

**Frontend**
| Library | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI framework |
| React Router | 6.3.0 | Client-side routing |
| Styled Components | 5.3.5 | CSS-in-JS styling |
| Axios | 0.27.2 | HTTP client |
| Recharts | 2.1.13 | Performance charts |
| React Select | — | Dropdown components |
| Firebase | 9.8.3 | (integrated) |

**Backend**
| Library | Version | Purpose |
|---|---|---|
| Node.js + Express | 4.18.1 | REST API server |
| Mongoose | 6.4.0 | MongoDB ODM |
| jsonwebtoken | 8.5.1 | JWT authentication |
| bcrypt | 5.0.1 | Password hashing |
| nodemailer | 6.7.7 | Email notifications (Gmail SMTP) |
| dotenv | 16.0.0 | Load environment variables from .env |
| nodemon | 2.0.16 | Dev auto-restart |

**External Services**
- **MongoDB Atlas** — cloud-hosted database
- **JDoodle API** — live code execution for coding questions (Java, Python, C++, C)
- **Gmail SMTP** — account activation, password reset, and approval emails

---

## Project Structure

```
OnlineAssessmentsWebApp/
├── client/                          # React frontend (port 3000)
│   └── src/
│       ├── components/
│       │   ├── admin/               # Admin dashboard & module management
│       │   ├── professor/           # Assessment creation, submissions, marking
│       │   ├── student/             # Assessment taking, results, modals
│       │   ├── common_for_all/      # Auth pages (login, register, profile)
│       │   └── common_for_prof_and_stu/  # Discussions, shared views
│       ├── contexts/
│       │   ├── LoginContext.js      # Auth state (role, user info)
│       │   ├── AssessmentContext.js # Active assessment state
│       │   └── LandingContext.js
│       └── App.js                   # Role-based route definitions
│
└── server/                          # Express backend (port 3001)
    ├── models/                      # Mongoose schemas
    ├── routes/                      # Route handlers
    ├── services/
    │   └── EmailService.js          # Email templates & SMTP config
    └── index.js                     # Server entry, DB connection, route mounting
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm
- A MongoDB Atlas cluster
- A Gmail account with an App Password enabled
- A JDoodle API client ID and secret

### Install & Run

**Backend**
```bash
cd server
npm install
npm start        # Starts on http://localhost:3001 with nodemon
```

**Frontend**
```bash
cd client
npm install
npm start        # Starts on http://localhost:3000
```

**Production build**
```bash
cd client
npm run build    # Outputs to client/build/
```

---

## Environment Setup

All secrets are loaded from `server/.env` via `dotenv`. The file is git-ignored and must be created locally before running the server.

Copy `server/.env.example` and fill in your values:

```bash
cp server/.env.example server/.env
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_LOGIN_SECRET` | Secret used to sign login JWTs |
| `JWT_RESET_SECRET` | Secret used to sign password-reset JWTs |
| `GMAIL_USER` | Gmail address used to send emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your account password) |
| `JDOODLE_CLIENT_ID` | JDoodle API client ID for code execution |
| `JDOODLE_CLIENT_SECRET` | JDoodle API client secret |

> If you have previously committed credentials to git history, rotate them (MongoDB password, Gmail App Password, JDoodle secret) even after moving them to `.env`.

---

## API Overview

All API requests are made to `http://localhost:3001`. CORS is enabled with credentials.

| Prefix | Responsibility |
|---|---|
| `/users` | Login, registration, password reset, module assignment |
| `/pendingregistrations` | Admin approval workflow, email activation |
| `/assessments` | Assessment CRUD |
| `/submissions` | Student answers, auto-evaluation, marks management |
| `/modules` | Module CRUD |
| `/discussions` | Question-level discussion threads |

Authentication uses JWT stored in HTTP-only cookies (1-hour expiry).

---

## Database Models

| Collection | Key Fields |
|---|---|
| `Users` | first_name, last_name, email, password (hashed), role, uni_id, assigned_modules |
| `PendingRegistrations` | Same as Users + activationToken |
| `Modules` | module_code, module_title, module_year, module_semester, assigned_users |
| `Assessments` | module_code, title, duration, window_start_time, window_end_time, questions[] |
| `Submissions` | assessment_id, student_uni_id, answers[], marks_awarded[], feedback, session_details |
| `Discussions` | assessment_id, discussions[][]: { user_name, discussion_point, responses[] } |

---

## Question Types & Evaluation

| Type | Input | Auto-Evaluation |
|---|---|---|
| MCQ | Select one option | Exact match against correct answer |
| Fill in the Blank (FIB) | Text per blank | Partial marks: correct blanks / total blanks |
| Essay | Free text | Keyword matching against model answer keywords |
| Coding | Code + language selection | Test case execution via JDoodle API |

Professors can manually override any auto-evaluated mark and add written feedback. Marks are only visible to students after the professor explicitly releases them.
