import { createBrowserRouter, Outlet } from "react-router-dom";
import Dashbroad from "../pages/admin/Dashbroad";
import Home from "../pages/customer/Home";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "../context/UserContext";

const AppLayout = () => (
  <UserProvider>
    <Outlet />
  </UserProvider>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute role="customer">
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute role="admin">
            <Dashbroad />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
