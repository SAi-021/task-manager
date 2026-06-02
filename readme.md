# Taskboard - Task Manager

A full-stack task manager where users register, log in, and manage tasks across
three stages: Todo, In Progress, and Done.

## Live Demo

- **Frontend:** https://task-manager-orcin-mu-33.vercel.app
- **Backend API:** https://task-manager-api-ehfz.onrender.com (interactive docs at `/docs`)

> **Note:** The backend runs on a free tier that sleeps after ~15 minutes of
> inactivity. The first request (e.g. your first login) may take 30-50 seconds
> while it wakes up. It is fast after that.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 18 + Vite + React Router      |
| Backend  | FastAPI (Python) + SQLAlchemy       |
| Database | MySQL (hosted on Aiven)             |
| Auth     | JWT with bcrypt-hashed passwords    |
| Hosting  | Vercel (frontend), Render (backend) |

## Features

- User registration and login (JWT authentication)
- Create, update, and delete tasks
- Three stages per task: Todo, In Progress, Done; move tasks between stages
- Clean, responsive UI with loading and error states

## API Endpoints

| Method | Endpoint        | Auth | Description           |
| ------ | --------------- | ---- | --------------------- |
| POST   | /auth/register  | No   | Create account        |
| POST   | /auth/login     | No   | Log in                |
| GET    | /auth/me        | Yes  | Current user          |
| GET    | /tasks          | Yes  | List the user's tasks |
| POST   | /tasks          | Yes  | Create a task         |
| PUT    | /tasks/{id}     | Yes  | Update a task         |
| DELETE | /tasks/{id}     | Yes  | Delete a task         |

## Run locally

### Backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   (then fill in DB details and SECRET_KEY)
uvicorn app.main:app --reload --port 8000

### Frontend
cd frontend
npm install
copy .env.example .env   (set VITE_API_URL=http://localhost:8000)
npm run dev

Screenshots of the app are in the `output/` folder.
