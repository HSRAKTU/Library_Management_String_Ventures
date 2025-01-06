# Library Management System - Backend

This repository contains the backend implementation of the Library Management System. The backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database. It provides RESTful APIs for managing books, users, and transactions.

## Features
- **CRUD Operations** for books and users
- Borrow and return functionality
- List books by availability
- Role-based authentication (Admin/User)
- Dashboard with library statistics (Bonus Feature)

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Management**: dotenv

## Installation and Setup

### Prerequisites
- Node.js (v20.12.1 or higher)
- MongoDB (local or cloud instance)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=<your_mongo_connection_string>
   JWT_SECRET=<your_secret_key>
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:5000`.

## API Endpoints

### Books
| Method | Endpoint        | Description                |
|--------|-----------------|----------------------------|
| POST   | `/api/books`    | Add a new book            |
| GET    | `/api/books`    | List all books            |
| PUT    | `/api/books/:id`| Update book details       |
| DELETE | `/api/books/:id`| Delete a book             |

### Users
| Method | Endpoint        | Description                |
|--------|-----------------|----------------------------|
| POST   | `/api/users`    | Add a new user            |
| GET    | `/api/users`    | List all users            |

### Transactions
| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/api/transactions/borrow`| Borrow a book                 |
| POST   | `/api/transactions/return`| Return a borrowed book        |

### Authentication
| Method | Endpoint        | Description                |
|--------|-----------------|----------------------------|
| POST   | `/api/auth/login` | Login (Admin/User)         |

## Folder Structure
```
backend/
├── models/          # Mongoose schemas (Books, Users, Transactions)
├── routes/          # API route definitions
├── controllers/     # Business logic for each route
├── utils/           # Utility functions (e.g., authentication)
├── config/          # Configuration files (e.g., database connection)
├── middleware/      # Middleware (e.g., authentication)
├── .env             # Environment variables
├── server.js        # Entry point
└── package.json     # Dependencies and scripts
```

## Usage
- Use Postman or a similar tool to test API endpoints.
- Ensure MongoDB is running and connected before starting the server.
- Include a valid JWT token in the `Authorization` header for protected routes.

## Deployment
This backend can be deployed on:
- **Heroku**
- **AWS** (Elastic Beanstalk)
- **Render**

Update the `MONGO_URI` and other environment variables as needed for production.

## Future Improvements
- Add pagination for listing books and users.
- Improve error handling and validation.
- Implement password reset functionality.

## License
This project is licensed under the ISC License.

---
Feel free to reach out for any questions or clarifications!

