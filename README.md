# 📚 Course Management System (Node.js + PostgreSQL)

A simple backend for managing users, courses, and registrations using Node.js, Express, and PostgreSQL.

---

## 📦 Project Structure

project-root/
├── server/
│ ├── controller/ # Route controllers
│ ├── routes/ # API routes
│ ├── prisma/migrations # SQL migration files
│ └── server.js # Express app
├── .env # Environment variables
├── .gitignore
├── package.json
└── README.md

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- `psql` CLI installed and added to PATH

## 📥 Installation

```bash
# Clone the repo
git clone https://github.com/Davda-James/faculty-service.git
cd faculty-service

# Install dependencies
npm install express nodemon dotenv prisma

Create a .env file in the root with:
PORT = 3000
POSTGRES_DATABASE_URL = 

Run the SQL schema creation:
psql -U your_db_user -d your_db_name -f src/migrations/001_init.sql

Start the Server:
nodemon server/server.js


