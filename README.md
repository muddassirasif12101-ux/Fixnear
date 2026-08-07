# FixNear

FixNear is a professional home-services marketplace connecting customers with verified local service providers in Islamabad and Rawalpindi, Pakistan.

## Product Vision
FixNear enables customers to discover, compare, book, and track trusted service providers for home services such as AC repair, electrician work, plumbing, carpentry, cleaning, painting, CCTV installation, and more.

## Architecture
- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend
- `database/` — MySQL schema and seed scripts

## Tech Stack
- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hook Form
- Backend: Node.js, Express, MySQL, JWT, bcrypt, dotenv
- File storage: Cloudinary-ready architecture

## Getting Started

### 1. Install dependencies
```bash
cd d:/Fixnear/server
npm install
cd ../client
npm install
```

### 2. Configure environment
Create `.env` files in `/server` and `/client` as needed.

### 3. Database setup
Use the SQL scripts in `/database` to create the schema and seed demo data.

### 4. Run development servers
```bash
cd d:/Fixnear/server
npm run dev
cd ../client
npm run dev
```

## Demo Accounts
- Admin: `admin@fixnear.local` / `Admin@123`
- Provider: `provider@fixnear.local` / `Provider@123`
- Customer: `customer@fixnear.local` / `Customer@123`

## Development Workflow
- Backend: `npm run dev` from `/server`
- Frontend: `npm run dev` from `/client`

## Notes
This project is designed for deployment readiness with environment-based configuration, role-based authorization, modular API design, and a production-focused folder structure.
