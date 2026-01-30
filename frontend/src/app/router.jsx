import { createBrowserRouter, Outlet } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { UserProvider } from "../context/UserContext";

//------------------ PAGES/LAYOUTD/COMPOENTS...-----------------------//

// *[USTOMER]
import Home from "../pages/customer/Home";
import FieldDetail from "../pages/customer/FieldDetail";
import CustomerLayout from "../layouts/customer/CustomerLayout";
import BranchDetail from "../pages/customer/BranchDetail";
import Search from "../pages/customer/Search";
import Booking from "../pages/customer/Booking";
import Profile from "../pages/customer/Profile";

// *[ADMIN]
import Dashbroad from "../pages/admin/Dashbroad";
import Fields from "../pages/admin/Fields";
import Users from "../pages/admin/Users";
import AdminLayout from "../layouts/admin/AdminLayout";
import Branches from "../pages/admin/Branches";
import Services from "../pages/admin/Services";
import FieldsBranch from "../pages/admin/FieldsBranch";


// *[BRANCH OWNER]
import BranchOwnerLayout from "../layouts/branch_owner/BranchOwnerLayout";
import DashbroadBranch from "../pages/branch_owner/Dashbroad";
import { ServiceProvider } from "../context/ServiceContext";

//------------------ PAGES/LAYOUTD/COMPOENTS...-----------------------//

const AppLayout = () => (  //eslint-disable-line
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
        element: <CustomerLayout />,
        children: [
          {
            index: true,
            element: <Home />, //Route mặc định cho trang customer (Đang có banner và Field List)
          },
          { path: "detail/:field_id", element: <FieldDetail /> },
          { path: "branchDetail/:branch_id", element: <BranchDetail /> },
          { path: "search", element: <Search /> },
          { path: "booking/:field_field_type_id", element: <Booking /> },
          { path: "profile/:user_id", element: <Profile /> },
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
            element: <Dashbroad />, // Route mặc định cho /admin
          },
          { path: "fields", element: <Fields /> }, // route sân bóng
          { path: "users", element: <Users /> }, // route user
          { path: "branches", element: <Branches /> }, // router chủ sân
          {
            path: 'services/:branch_id', element: (
              <ServiceProvider>
                <Services />
              </ServiceProvider>
            ),
          },
          { path: "fields-branch/:branch_id", element: <FieldsBranch /> },
        ],
      },
      {
        path: "/branch_owner",
        element: (
          <ProtectedRoute role="branch_owner">
            <BranchOwnerLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashbroadBranch />, //Route mặc định cho trang chủ chi nhánh
          },
        ],
      },
    ],
  },
]);
