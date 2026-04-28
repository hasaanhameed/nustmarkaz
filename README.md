# NUST Markaz

## Overview
NUST Markaz is a comprehensive, full-stack web application designed exclusively for the NUST campus community. It serves as a centralized hub for students to connect, trade, and navigate campus life efficiently. The platform integrates multiple services into a single ecosystem, streamlining daily student activities.

## Features
- **Campus Marketplace:** A dedicated platform for students to buy, sell, and trade items securely within the campus.
- **Carpooling Network:** Connect with fellow students for shared commutes, reducing travel costs and environmental impact.
- **Lost and Found:** A centralized registry to report lost items and claim found belongings across the university.
- **Events and Giveaways:** Stay updated on campus events, workshops, and society giveaways, with tools to host and manage new events.
- **Societies Hub:** Discover and explore various student societies, their activities, and membership details.
- **Campus Cafes:** Browse comprehensive information on campus cafes, including locations, menus, and offerings.
- **Trips and Excursions:** Plan, organize, and join student-led trips and off-campus excursions.
- **Donation Center:** Facilitate campus charity by posting and finding items available for donation.
- **User Dashboard and Profiles:** Personalized user dashboards to track activities, manage listings, and update profiles securely.
- **Secure Authentication:** Robust user authentication utilizing JWT and secure password hashing.

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite Build Tool
- TailwindCSS for utility-first styling
- Shadcn UI (Radix UI) for accessible, customizable components
- React Router DOM for client-side routing
- TanStack Query (React Query) for state and data fetching
- Framer Motion for UI animations
- Axios for API communication

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- Alembic (Database Migrations)
- PostgreSQL (Relational Database)
- JWT Authentication and Bcrypt Hashing

### Infrastructure and DevOps
- Docker and Docker Compose for containerized deployment

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v18 or higher)
- Python 3.9 or higher
- PostgreSQL

### Running with Docker (Recommended)
1. Ensure the Docker daemon is running on your machine.
2. Create the necessary `.env` files in both the `frontend/` and `backend/` directories based on the required environment variables (e.g., database credentials, secret keys).
3. Build and start the containers from the project root:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend application at `http://localhost:5173`.
5. Access the backend API documentation (Swagger UI) at `http://localhost:8000/docs`.

### Running Locally (Manual Setup)

#### Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment.
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply database migrations to set up the PostgreSQL schema:
   ```bash
   alembic upgrade head
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## License
Copyright (c) 2026. All Rights Reserved.

This project and its source code are proprietary and confidential. They are not intended for public use, distribution, or modification. Unauthorized copying, distribution, or use of this project, via any medium, is strictly prohibited.
