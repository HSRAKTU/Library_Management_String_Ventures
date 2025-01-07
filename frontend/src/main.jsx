import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Listings from './components/Listings/Listings';
import AdminDashboard from './components/Dashboards/adminDashboard';
import UserDashboard from './components/Dashboards/userDashboard';
import Layout from './Layout';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './lib/redux/store';
import ProtectedRoute from './ProtectedRoute';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import { checkAuthSession } from './lib/redux/features/authSlice'
import { ThemeProvider } from "@/components/theme-provider"
import { LoaderCircle } from 'lucide-react'
 
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
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
]);

export default function AppWrapper() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);
  

  if (loading) {
    return <div><LoaderCircle className='animate-spin'/></div>;
  }

  return <RouterProvider router={router} />;
}

// Re

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppWrapper />
      <Toaster />
     </ThemeProvider>
    </Provider>
  </StrictMode>
)
