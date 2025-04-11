
# Campus Bridge

A comprehensive MERN stack application to connect students, faculty, and administrators for a seamless academic experience.

## Overview

Campus Bridge is a full-featured web application built using the MERN stack (MongoDB, Express.js, React, Node.js) that provides a unified platform for academic communities. It supports three user roles (student, faculty, and admin) with role-based access control and authentication using JWT.

## Features

- Complete authentication system with JWT tokens
- Role-based access control (Student, Faculty, Admin)
- Responsive design for all devices
- Dashboard views customized for each user role
- User profile management
- Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui component library
- TanStack Query for data fetching
- JWT for authentication

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication and authorization
- bcrypt for password hashing

## Project Structure

```
campus-bridge/
├── public/            # Static files
├── src/               # Source code
│   ├── backend/       # Backend code
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   └── server.js      # Express app
│   ├── components/    # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── App.tsx        # Main React component
│   └── index.css      # Global styles
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/campus-bridge.git
cd campus-bridge
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd src/backend
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the development servers

In one terminal (backend):
```bash
cd src/backend
npm run dev
```

In another terminal (frontend):
```bash
npm run dev
```

6. Access the application at `http://localhost:8080`

## Demo Users

For testing, the following demo users are available:

- **Student Account**
  - Email: student@example.com
  - Password: password123

- **Faculty Account**
  - Email: faculty@example.com
  - Password: password123

- **Admin Account**
  - Email: admin@example.com
  - Password: password123

## Development Notes

### Authentication Flow

The application uses JWT for authentication:
1. User logs in with credentials
2. Server validates credentials and returns a JWT token
3. Frontend stores the token in localStorage
4. Token is sent with subsequent API requests
5. Protected routes check for valid token

### MongoDB Schema Design

The application uses two main models:
- `User`: Basic user information and authentication
- `Profile`: Extended user information based on role

## License

This project is licensed under the MIT License.
