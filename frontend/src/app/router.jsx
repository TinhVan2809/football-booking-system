import { createBrowserRouter, Outlet } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "../context/UserContext";


//------------------ PAGES/LAYOUTD/COMPOENTS...-----------------------//
// [USTOMER]
import Home from "../pages/customer/Home";

// [ADMIN] 
import Dashbroad from "../pages/admin/Dashbroad";
import Fields from "../pages/admin/Fields";

// [BRANCH OWNER] 
import DashbroadBranch from "../pages/branch_owner/Dashbroad";

//------------------ PAGES/LAYOUTD/COMPOENTS...-----------------------//

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
          // <ProtectedRoute role="customer">
            <Home />
          // </ProtectedRoute>
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
      {
        path: "/fields",
        element: <Fields />
      },
      {
        path: "/branch_owner",
        element: (
          <ProtectedRoute role="branch_owner">
            <DashbroadBranch />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);
