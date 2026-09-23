 Job Tracker Application

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for tracking job applications — register/login, add and manage job applications, filter by status or company, and attach a resume to each application.

 Features

- 🔐 User authentication with JWT (register & login, passwords hashed with bcrypt)
- 📝 Full CRUD on job applications (create, view, update, delete)
- 📄 Resume upload per job (PDF/DOC/DOCX, up to 5 MB) via Multer
- 🔍 Filter jobs by status and search by company name
- 📌 Status tracking per application: `Pending`, `Applied`, `Interview`, `Offer`, `Rejected`
- 🎨 React (Vite) frontend built with Material UI

 Tech Stack

| Layer     | Technology                                              |
|-----------|-----------------------------------------------------------|
| Frontend  | React 19 (Vite), React Router, Material UI, Axios         |
| Backend   | Node.js, Express 5                                          |
| Database  | MongoDB (Mongoose)                                          |
| Auth      | JWT (jsonwebtoken), bcryptjs                                |
| File uploads | Multer (local disk storage)                              |

 Project Structure

```
.
├── server/                       # Express API
│   ├── server.js                 # Entry point — connects Mongo, starts the app
│   ├── app.js                    # Express app setup (CORS, routes, static /uploads)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── jobRoutes.js          # /api/jobs/*  (protected)
│   ├── controllers/
│   │   ├── authController.js     # register, login
│   │   └── jobController.js      # job CRUD, resume upload
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification (protect)
│   │   └── errorHandler.js       # request validation + error handler
│   ├── models/
│   │   ├── User.js               # name, email, hashed password
│   │   └── Job.js                # company, position, status, resume, notes, appliedDate
│   ├── utils/
│   │   └── multerConfig.js       # resume upload config (PDF/DOC/DOCX, 5MB limit)
│   ├── uploads/                  # uploaded resumes (served at /uploads)
│   └── .env                      # PORT, MONGO_URI, JWT_SECRET
│
└── job-tracker-frontend/         # React (Vite) frontend
    └── src/
        ├── App.jsx               # Routes: /, /login, /register, /dashboard, /add-job
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx     # list, filter, delete jobs, upload resume
            └── AddJob.jsx        # create a new job application
```

 Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance (local or Atlas)

 Setup & Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yeshvaanth/Job-Tracker-Application.git
   cd Job-Tracker-Application
```

2. **Backend setup**
```bash
   cd server
   npm install
```

   Create a `.env` file inside `server/`:
```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/job-tracker
   JWT_SECRET=your_jwt_secret_here
```

   Start the API:
```bash
   npm run dev      # nodemon, auto-restarts on change
   # or
   npm start
```
   The API runs at `http://localhost:5000` and expects requests from `http://localhost:5173` (CORS is currently locked to that origin in `app.js`).

3. **Frontend setup**
```bash
   cd ../job-tracker-frontend
   npm install
   npm run dev
```
   The app runs at `http://localhost:5173`.

   > **Note:** The frontend currently calls the backend with a hardcoded `http://localhost:5000` base URL in each page (`Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `AddJob.jsx`) rather than reading it from an env variable or a shared API client. Update these directly, or refactor them to use `import.meta.env.VITE_API_URL`, if you deploy the backend elsewhere.

 API Reference

All `/api/jobs` routes require an `Authorization: Bearer <token>` header (the token returned from register/login).

### Auth

| Method | Endpoint             | Body                                | Description             |
|--------|-----------------------|--------------------------------------|--------------------------|
| POST   | `/api/auth/register`  | `{ name, email, password }`          | Create a new user, returns `{ token, user }` |
| POST   | `/api/auth/login`     | `{ email, password }`                | Log in, returns `{ token, user }` |

### Jobs (protected)

| Method | Endpoint                       | Body / Notes                                   | Description                     |
|--------|----------------------------------|--------------------------------------------------|----------------------------------|
| GET    | `/api/jobs`                     | Query params: `status`, `company`                | List the logged-in user's jobs (optionally filtered) |
| POST   | `/api/jobs`                     | `multipart/form-data`: `company`, `position`, `status`, `notes`, `resume` (file) | Create a job application, optionally with a resume |
| GET    | `/api/jobs/:id`                 | —                                                 | Get a single job by ID          |
| PUT    | `/api/jobs/:id`                 | Any updatable job fields                          | Update a job                    |
| DELETE | `/api/jobs/:id`                 | —                                                 | Delete a job                    |
| POST   | `/api/jobs/upload/:id`          | `multipart/form-data`: `resume` (file)            | Attach/replace a resume on an existing job |

Uploaded resumes are served statically from `/uploads/<filename>`.

 Job Schema

```json
{
  "userId": "ObjectId",
  "company": "string (required)",
  "position": "string (required)",
  "status": "Pending | Applied | Interview | Offer | Rejected",
  "resume": "string (uploaded filename)",
  "notes": "string",
  "appliedDate": "date (defaults to creation time)"
}
```

 Example Usage (cURL)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Yeshvaanth","email":"you@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'

# Add a job (replace TOKEN with the JWT from login)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TOKEN" \
  -F "company=Acme Corp" \
  -F "position=Backend Engineer" \
  -F "status=Applied" \
  -F "resume=@/path/to/resume.pdf"

# List jobs, filtered
curl "http://localhost:5000/api/jobs?status=Applied&company=Acme" \
  -H "Authorization: Bearer TOKEN"
```

Known Limitations / Possible Improvements

- Frontend API base URL is hardcoded per-page — move it to a single `.env`-driven Axios instance
- CORS origin is hardcoded to `http://localhost:5173` — make this configurable for deployment
- `.env` files (with real secrets) currently exist in the repo tree — make sure `server/.env` and `job-tracker-frontend/.env` are in `.gitignore` and rotate `JWT_SECRET`/`MONGO_URI` if they were ever committed
- No automated tests yet
- Add pagination on `GET /api/jobs` for large job lists

 License

Add a license of your choice (e.g. MIT) if you intend this to be publicly reusable.
