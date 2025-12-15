import { Navigate } from "react-router-dom";
import UseAuth from "./UseAuth";


const AdminRoute = ({ children }) => {
  const { user, loading } = UseAuth();

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
