# HRMS Lite

A lightweight Human Resource Management System built as a full-stack web application.

## Live URLs

- **Frontend**: https://hrmslite-frontends.vercel.app/
- **Backend API**: https://hrms-lite-backend-psq9.onrender.com/
- **API Docs**: https://hrms-lite-backend-psq9.onrender.com/docs

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS v4     |
| Backend    | Python, FastAPI                     |
| Database   | MongoDB (MongoDB Atlas)             |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
Ethara.Ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # MongoDB connection config
│   │   ├── models/              # Pydantic request/response models
│   │   ├── routes/              # API route handlers
│   │   └── services/            # Business logic layer
│   ├── requirements.txt
│   └── build.sh                 # Render build script
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Dashboard, Employees, Attendance
│   │   └── services/api.js      # Axios API layer
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

## Features

### Core

- **Employee Management**: Add, view, and delete employees with validation
- **Attendance Tracking**: Mark daily attendance (Present/Absent) per employee
- **RESTful API**: Full CRUD with proper HTTP status codes and error handling

### Bonus

- **Dashboard**: Summary cards (total employees, today's present/absent counts)
- **Date Filter**: Filter attendance records by specific date
- **Present Days Count**: Total present days displayed per employee

### UI States

- Loading spinners during data fetch
- Empty states with helpful messages
- Error states with retry buttons
- Toast notifications for success/error feedback
- Confirmation modal before delete

## API Endpoints

| Method | Endpoint                          | Description                         |
| ------ | --------------------------------- | ----------------------------------- |
| GET    | `/`                               | Health check                        |
| POST   | `/api/employees/`                 | Create employee                     |
| GET    | `/api/employees/`                 | List all employees                  |
| GET    | `/api/employees/{id}`             | Get single employee                 |
| DELETE | `/api/employees/{id}`             | Delete employee + attendance        |
| POST   | `/api/attendance/`                | Mark attendance                     |
| GET    | `/api/attendance/`                | List attendance (optional `?date=`) |
| GET    | `/api/attendance/employee/{id}`   | Attendance by employee              |
| GET    | `/api/attendance/dashboard/stats` | Dashboard statistics                |

## Running Locally

### Prerequisites

- Python 3.11+
- Node.js 20+
- MongoDB running locally (or MongoDB Atlas URI)

### Backend

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\Activate.ps1
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Set environment variables in .env
# MONGODB_URL=mongodb://localhost:27017
# DATABASE_NAME=hrms_lite

uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000` and docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install

# Set environment variable in .env
# VITE_API_URL=http://localhost:8000

npm run dev
```

App will be available at `http://localhost:5173`

## Validations

- All fields required (server + client side)
- Email format validation
- Unique Employee ID and Email (409 Conflict on duplicate)
- Employee must exist before marking attendance
- No duplicate attendance for same employee + date
- Graceful error messages with proper HTTP status codes

## Assumptions & Limitations

- Single admin user — no authentication required
- Employee records cannot be edited (only add/delete as per requirements)
- Attendance status is binary: Present or Absent
- MongoDB Atlas free tier (512 MB) used for production
- No real-time features
