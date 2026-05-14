import { Navigate } from "react-router-dom";

function parseToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = parseToken(token);

  if (!decoded || decoded.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
