import { createBrowserRouter, Outlet } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "../context/UserContext";

//------------------ PAGES/LAYOUTD/COMPOENTS...-----------------------//
// [USTOMER]
import Home from "../pages/customer/Home";
import FieldDetail from "../pages/customer/FieldDetail";
import CustomerLayout from "../layouts/customer/CustomerLayout";
import BranchDetail from "../pages/customer/BranchDetail";
import Search from "../pages/customer/Search";

// [ADMIN]
import Dashbroad from "../pages/admin/Dashbroad";
import Fields from "../pages/admin/Fields";
import Users from "../pages/admin/Users";
import AdminLayout from "../layouts/admin/AdminLayout";
import Branches from "../pages/admin/Branches";

// [BRANCH OWNER]
import DashbroadBranch from "../pages/branch_owner/Dashbroad";

//------------------ PAGES/LAYOUTD/COMPOENTS...-----------------------//

const AppLayout = () => (   //eslint-disable-line
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
          <CustomerLayout />       
        ),
         children: [
         {
           index: true,
           element: <Home />, // Route mặc định cho trang customer
         },
         { path: "detail/:field_id", element: <FieldDetail /> },
         { path: "branchDetail/:branch_id", element: <BranchDetail /> },
         { path: "search", element: <Search /> },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/admin", // Route cha cho khu vực admin
        element: (
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashbroad />,  // Route mặc định cho /admin
          },
          { path: "fields", element: <Fields /> },  // route sân bóng
          { path: "users", element: <Users /> }, // route user
          { path: "branches", element: <Branches /> },  // router chủ sân

        ],
      },
      {
        path: "/branch_owner",
        element: (
          <ProtectedRoute role="branch_owner">
            <DashbroadBranch />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
