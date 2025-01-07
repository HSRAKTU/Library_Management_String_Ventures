# Frontend - Library Management System

This is the **frontend** for the Library Management System, built using **Vite** and **React** with **ShadCN UI** for styling and components. The application allows both users and admins to interact with the system. Users can borrow or return books, while admins can manage books (CRUD operations) via their dashboards.

## Features
- User and Admin authentication.
- Admin dashboard for managing books (CRUD).
- User dashboard for borrowing and returning books.
- Responsive and user-friendly UI using **ShadCN UI** and **TailwindCSS**.

## Technologies Used
- **Vite** - Fast build tool.
- **React** - Frontend framework.
- **ShadCN** - UI components and styling.
- **TailwindCSS** - Utility-first CSS framework.
- **React Router** - For routing and navigation.
- **Redux Toolkit** - State management.
- **Axios** - For API calls.
- **Radix UI** - Accessible React primitives.

---

## Setup and Installation

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16 or above)
- **npm** (or **yarn**/pnpm)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Configuration

### Vite Proxy
The frontend proxies API calls to the backend. The proxy is defined in `vite.config.js`:
```js
server: {
  proxy: {
    '/api': 'https://library-management-string-ventures-mryt.vercel.app'
  },
},
```
- All API requests starting with `/api` will be proxied to the backend.

### Backend API
The backend API is deployed at:
```
https://library-management-string-ventures-mryt.vercel.app/api
```
This URL is used in the proxy for API calls.

---

## Build and Deployment

### Building the App
To create an optimized production build:
```bash
npm run build
# or
yarn build
# or
pnpm build
```
The build output will be generated in the `dist/` folder.

### Preview the Production Build
To preview the production build locally:
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

### Deployment
The app is deployed on **Vercel**. Deployment is configured via the `vercel.json` file:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://library-management-string-ventures-mryt.vercel.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- All `/api` requests are routed to the backend.
- All other routes are redirected to `index.html` for SPA handling.

To deploy to Vercel:
1. Run:
   ```bash
   vercel --prod
   ```
2. Ensure environment variables (if any) are properly configured in the Vercel dashboard.

---

## Project Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/       # Reusable components
│   ├── hooks/            # for shadcn toast notification
│   ├── lib/ 
│   |   ├── redux/        # Redux slices and store
│   |   ├── utils.js           
│   ├── schemas          # Schemas for Zod Resolver
│   ├── ProtectRoutes.jsx  # wrapper component
│   ├── Layout.jsx         
│   └── main.jsx          # Entry point
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── vercel.json            # Vercel deployment configuration
```

---

## Scripts
Here are the key scripts available in `package.json`:

- **Development**:
  ```bash
  npm run dev
  ```
  Starts the development server.

- **Build**:
  ```bash
  npm run build
  ```
  Builds the app for production.

- **Preview**:
  ```bash
  npm run preview
  ```
  Previews the production build locally.

- **Lint**:
  ```bash
  npm run lint
  ```
  Runs ESLint to check for code quality issues.

---

## Dependencies
### Key Dependencies:
- **React**: ^18.3.1
- **Redux Toolkit**: ^2.5.0
- **React Router DOM**: ^7.1.1
- **TailwindCSS**: ^3.4.17
- **Axios**: ^1.7.9

### Dev Dependencies:
- **Vite**: ^6.0.5
- **ESLint**: ^9.17.0
- **TailwindCSS**: ^3.4.17

For the complete list, refer to `package.json`.

---

## Future Improvements
- Add tests using a testing framework like **Jest** or **React Testing Library**.
- Improve error handling for API calls.
- Optimize bundle size using advanced Vite plugins.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push the branch and create a pull request.

---

## License
This project is licensed under the ISC License.

