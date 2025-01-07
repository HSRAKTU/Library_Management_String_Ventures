# Backend - Library Management System

This is the **backend** for the Library Management System, built using **Node.js** and **Express.js**. It provides APIs for user and admin functionalities, such as authentication, book management (CRUD), borrowing/returning books, and retrieving user transaction history.

---

## Features
- **CRUD Operations** for books and users.
- Borrow and return functionality.
- List books by availability.
- Role-based authentication (Admin/User).
- Dashboard with library statistics (Bonus Feature).
- User authentication and authorization using **JWT**.
- Admin dashboard functionalities for managing books (CRUD).
- User dashboard for borrowing and returning books.
- Secure file uploads to **Cloudinary** for book thumbnails.
- MongoDB for database storage, integrated via **Mongoose**.

---

## Technologies Used
- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **Mongoose**: MongoDB object modeling.
- **Cloudinary**: For file uploads.
- **Multer**: Middleware for handling file uploads.
- **JWT**: Authentication.
- **dotenv**: For environment variable management.

---

## Setup and Installation

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16 or above)
- **npm** (or **yarn**/pnpm)
- **MongoDB** (Local instance or MongoDB Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```env
     PORT=8000
     CORS_ORIGIN=*
     MONGODB_URI=<your-mongodb-uri>

     ACCESS_TOKEN_SECRET=<your-access-token-secret>
     ACCESS_TOKEN_EXPIRY=1d

     REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
     REFRESH_TOKEN_EXPIRY=10d

     CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. The server will start at:
   ```
   http://localhost:8000
   ```

---

## API Documentation

API documentation is available in the `latest_api_doc.json` file or on Postman via the following link:
[Postman Collection](https://assignment-for-reunion.postman.co/workspace/Testing~aaf2b6b1-3c13-4577-8668-62cf66db8a32/collection/32695735-b18f4bb8-7fbf-46d9-81df-25d6bdf973cd?action=share&source=collection_link&creator=32695735)

### Key Endpoints

#### **User Endpoints**
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/user/register`            | Register a new user. |
| POST   | `/user/login`               | Log in a user.       |
| POST   | `/user/logout`              | Log out a user.      |
| POST   | `/user/refreshAccessToken`  | Refresh access token.|
| GET    | `/user/currentUser`         | Get current user.    |

#### **Book Endpoints**
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/book/add`                 | Add a new book.      |
| GET    | `/book/getAll`              | Get all books.       |
| GET    | `/book/getById/:bookId`     | Get book by ID.      |
| PATCH  | `/book/update/:bookId`      | Update book details. |
| DELETE | `/book/delete/:bookId`      | Delete a book.       |
| GET    | `/book/getStats`            | Get admin dashboard stats. |

#### **Transaction Endpoints**
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/transaction/borrow`       | Borrow a book.       |
| PATCH  | `/transaction/return`       | Return a book.       |
| GET    | `/transaction/history`      | Get user history.    |

---

## Project Structure
```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   ├── db/                 # Database connection logic
│   ├── middlewares/        # Custom middlewares (auth, error handling, etc.)
│   ├── models/             # Mongoose models (User, Book, Transaction)
│   ├── routes/             # API routes
│   ├── utils/              # Utility files (Cloudinary, error handling)
│   ├── app.js              # App initialization
│   └── index.js            # Entry point
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

---

## Scripts
Here are the key scripts available in `package.json`:

- **Development**:
  ```bash
  npm run dev
  ```
  Starts the development server with **nodemon** and environment variable loading.

- **Production**:
  ```bash
  npm start
  ```
  Runs the backend server in production mode.

---

## Environment Variables
The following environment variables must be configured:

| Variable               | Description                                   |
|------------------------|-----------------------------------------------|
| `PORT`                | The port the server runs on.                 |
| `CORS_ORIGIN`         | Allowed origins for CORS.                    |
| `MONGODB_URI`         | MongoDB connection string.                   |
| `ACCESS_TOKEN_SECRET` | Secret key for access tokens.                |
| `ACCESS_TOKEN_EXPIRY` | Expiry duration for access tokens (e.g., `1d`).|
| `REFRESH_TOKEN_SECRET`| Secret key for refresh tokens.               |
| `REFRESH_TOKEN_EXPIRY`| Expiry duration for refresh tokens (e.g., `10d`).|
| `CLOUDINARY_CLOUD_NAME`| Your Cloudinary cloud name.                  |
| `CLOUDINARY_API_KEY`  | Cloudinary API key.                          |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret.                       |

---

## Deployment
This backend is deployed on **Vercel**. Follow these steps to deploy:

1. Ensure your `.env` variables are added to the Vercel dashboard under **Settings → Environment Variables**.
2. Deploy using the Vercel CLI:
   ```bash
   vercel --prod
   ```

---

## Future Improvements
- Add validation for inputs using a library like **Joi** or **Zod**.
- Implement logging using **Winston** or **Pino**.
- Add testing using **Jest** or **Mocha**.

---

## License
This project is licensed under the ISC License.

