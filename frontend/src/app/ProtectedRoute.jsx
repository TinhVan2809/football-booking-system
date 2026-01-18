import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Lấy thông tin user từ localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}
