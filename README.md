# CSDA SGPA & CGPA Calculator

> A complete, production-ready, full-stack web application designed exclusively for students of the **B.Sc. Computer Science with Data Analytics (CSDA)** department to calculate credit-weighted SGPA and cumulative CGPA, manage student academic records, project future standing, and export printable transcripts.

---

## 🚀 Key Features

- **Public Landing Page:** Academic blue visual theme introducing the CSDA calculator, curriculum features, and secure entry points without exposing private student records.
- **Student Authentication & Multi-User Isolation:**
  - Secure registration with Full Name, Roll Number, Email Address, Username, and Password.
  - Strict database isolation in MongoDB Atlas (`csda_calculator` database).
  - Passwords hashed using `bcrypt` (never stored in plaintext).
  - Authentication session persisted securely via HTTP-only cookies and token verification.
  - Rate limiting on authentication endpoints to prevent brute-force attacks.
- **Student Settings — View & Edit Profile:**
  - Mandatory dedicated Settings page (`/settings`) accessible with a gear icon in the navigation.
  - Clean read-only view of student name, roll number, email, username, and account registration date.
  - Interactive **Edit Profile** form with real-time backend uniqueness verification and instant dashboard synchronization without requiring re-login.
  - **Security & Change Password** form with current password verification, matching validation, and secure hashing.
- **Configurable 6-Semester CSDA Curriculum:**
  - Modular curriculum framework supporting 6 full semesters.
  - Prepared for official syllabus integration (`curriculum.ts` on frontend and `defaultCurriculum.ts` on backend).
  - Explicit subject categorization (Core Theory, Allied, Core Practical, Elective, Skill Based, Value Added).
- **Official SGPA & CGPA Calculation Engine:**
  - **Grade Point:** `(Marks Obtained / Maximum Marks) × 10`
  - **Weighted Point:** `Grade Point × Subject Credits`
  - **Semester SGPA:** `Σ (Eligible Weighted Points) / Σ (Eligible Credits)`
  - **Cumulative CGPA:** `Σ (All Eligible Weighted Points) / Σ (All Eligible Credits)` (Never a simple average of SGPAs; true credit-weighted calculation across all semesters).
  - Handles incomplete semesters, excludes non-GPA subjects, accepts decimal marks and zero, and preserves floating-point precision before rounding to 2 decimal places.
- **Semester Coursework & Marks Entry:**
  - Dedicated interactive tabs for Semesters 1 through 6.
  - Responsive table showing subject code, category, max marks, credits, marks obtained, grade point, and weighted point.
  - Debounced auto-save to MongoDB with status indicators (*Saving...*, *Saved successfully*, *Unable to save; retry*).
- **What-If CGPA Simulator:**
  - Forecast hypothetical future CGPA by simulating target marks for upcoming coursework.
  - Strictly separated from saved records; never overwrites database entries.
- **Printable A4 Academic Transcripts:**
  - Dedicated Results page with full semester-by-semester breakdown and cumulative degree standing.
  - Clean A4 print styling (hides navigation, toolbars, and buttons for clean paper or PDF export).
- **Reset Functionality:**
  - Reset current semester marks.
  - Reset all academic marks with confirmation modal (preserves user account and profile).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router Dom |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose, JSON Web Tokens (JWT), bcryptjs, Cookie-Parser, Helmet, Express-Rate-Limit |
| **Database** | MongoDB Atlas (Database name: `csda_calculator`) |
| **Testing** | Vitest, Supertest |

---

## 📁 Project Structure

```
csda-calculator/
├── .env.example                # Root environment placeholder
├── package.json                # Root orchestration scripts
├── README.md                   # Documentation
│
├── server/                     # Backend API
│   ├── src/
│   │   ├── config/             # Database connection (Mongoose/MongoDB Atlas)
│   │   ├── controllers/        # Auth, Profile, Academic, Curriculum controllers
│   │   ├── data/               # Configurable curriculum template
│   │   ├── middleware/         # Auth, Rate limiting, Error handling
│   │   ├── models/             # User and AcademicRecord Mongoose schemas
│   │   ├── routes/             # REST API routes
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Calculation engine & validation
│   │   ├── app.ts              # Express application configuration
│   │   └── server.ts           # Server bootstrap
│   ├── tests/                  # Unit & integration test suites
│   ├── tsconfig.json
│   └── package.json
│
└── client/                     # Frontend Application
    ├── src/
    │   ├── components/         # Header, Footer, Cards, Tables, Forms, WhatIf
    │   ├── context/            # AuthContext (session state, user profile)
    │   ├── data/               # Centralized curriculum configuration
    │   ├── pages/              # Landing, Login, Register, Dashboard, Semesters, Results, Settings
    │   ├── services/           # Axios API services
    │   ├── types/              # TypeScript definitions
    │   ├── utils/              # Pure calculation functions & validators
    │   ├── App.tsx             # Route definitions & protected routes
    │   ├── main.tsx            # Entry point
    │   └── index.css           # Tailwind base & A4 print stylesheet
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## ⚙️ Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas cluster or local MongoDB instance

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your settings:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/csda_calculator?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_csda_calculator_2026
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies
From the root directory:

```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 4. Run Development Servers
In one terminal, start the backend server:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

In a second terminal, start the frontend client:
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

The application includes unit tests for calculations, mark validations, authentication, profile management, and multi-student data isolation.

```bash
# Run backend test suite
cd server
npm test

# Run frontend test suite
cd ../client
npm test
```

All 37 test cases run using `vitest` and verify calculation precision, edge cases (zero marks, decimal marks, max marks, negative marks, non-numeric inputs), password hashing, duplicate field checks, and data isolation.

---

## 📝 Configuring the Official CSDA Curriculum

The curriculum is modular and decoupled from UI components and calculation engines. When the official semester-wise subject details are provided by the department coordinator:

1. **Frontend Configuration:**
   Update `client/src/data/curriculum.ts`:
   - Replace the subject slots in `initialCurriculum.semesters` with official subject names, subject codes, maximum marks, credits, and practical classifications.
   - Set `isOfficialConfigLoaded: true`.

2. **Backend Configuration:**
   Update `server/src/data/defaultCurriculum.ts` with matching definitions so the backend validates marks against the official max marks and computes weighted credits accurately.

3. **Runtime API Update:**
   You can also update the active curriculum dynamically via `POST /api/curriculum` with a valid `CurriculumConfig` JSON payload.

---

## 🌐 REST API Endpoints

### Authentication
- `POST /api/auth/register` — Create student account (Full name, roll number, email, username, password)
- `POST /api/auth/login` — Sign in and issue secure HTTP-only cookie
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Retrieve active student session

### Student Settings & Profile
- `GET /api/profile` — Get authenticated student profile
- `PATCH /api/profile` — Update student name, roll number, email, username
- `PATCH /api/profile/password` — Verify current password and update to new hashed password

### Academic Records
- `GET /api/academic` — Fetch student transcript and cumulative CGPA
- `GET /api/academic/semesters/:semester` — Fetch marks for specific semester
- `PUT /api/academic/semesters/:semester` — Save/update marks for semester
- `DELETE /api/academic/semesters/:semester` — Reset marks for single semester
- `DELETE /api/academic` — Reset all academic marks (preserves student account)

### Curriculum
- `GET /api/curriculum` — Retrieve current active curriculum configuration
- `POST /api/curriculum` — Update official curriculum configuration

---

## 🔒 Security Measures

- **Password Protection:** Passwords are encrypted with `bcrypt` (10 salt rounds) and stripped from all JSON responses.
- **Session Security:** JWT stored in HTTP-only, SameSite cookies with production HTTPS flag.
- **Authorization Guard:** All academic records and profile endpoints access data strictly via `req.user._id` (client-supplied IDs cannot access another student's records).
- **Rate Limiting:** Auth endpoints are rate-limited with `express-rate-limit`.
- **Security Headers:** Enhanced HTTP headers provided via `helmet`.
- **Input Sanitization:** All incoming marks and string inputs are validated and sanitized on both client and server.
