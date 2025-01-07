import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Listings from './components/Listings/Listings';
import AdminDashboard from './components/Dashboards/adminDashboard';
import UserDashboard from './components/Dashboards/userDashboard';
import Layout from './Layout';
import { Provider } from 'react-redux';
import { store } from './lib/redux/store';
import ProtectedRoute from './ProtectedRoute';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Listings />,
      },
      {
        path: "/admin",
        element: ( 
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />, // Independent Login page
  },
  {
    path: "/signup",
    element: <SignupForm />, // Independent Signup page
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
      <Toaster />
    </Provider>
  </StrictMode>
)
