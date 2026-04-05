# Project Black Vein Oracle

## Short Description

Project Black Vein Oracle is a full-stack criminal intelligence and law-enforcement management system.
It includes role-based dashboards (Admin, Thana, Officer, Jail, User) and features like criminal records, GD reports, SOS alerts, incarceration, case files, analytics, and notifications.

## Authors

- Rayyan Khalil
- Student: 2305098
- Md Iztihad Islam
- ID: 2305095

## Tech Stack

- Backend: Node.js, Express, PostgreSQL
- Frontend: React (Vite), React Query, Axios

## How To Run (Using Only Files In This GitHub Project)

### 1) Prerequisites

- Node.js (v18+ recommended)
- npm
- PostgreSQL running locally or remotely

### 2) Setup Database

1. Create a PostgreSQL database.
2. Run the schema file from this repo:

```bash
psql -d <your_database_name> -f Backend/src/schemas/schema.sql
```

### 3) Run Backend

1. Open terminal in Backend folder:

```bash
cd Backend
npm install
```

2. Create `Backend/.env` with:

```env
DB_URI=postgresql://<user>:<password>@<host>:<port>/<database>
SERVER_PORT=6001
JWT_SECRET=your_jwt_secret
```

3. Start backend:

```bash
npm start
```

Backend runs on: `http://localhost:6001`

### 4) Run Frontend

1. Open another terminal in Frontend folder:

```bash
cd Frontend
npm install
npm run dev
```

2. Open the URL shown by Vite (usually `http://localhost:5173`).

## Important Note

The frontend API base is currently set in `Frontend/src/helpers/constants.js` as:

```js
export const API_URL = "http://localhost:6001/api/v1";
```

So keep backend `SERVER_PORT=6001` for direct compatibility.
