import { Navigate, useLocation } from "react-router-dom";

const isTokenValid = (token: string | null) => {
  if (!token) return false;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
};

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = localStorage.getItem("token-user");

  if (!isTokenValid(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children} </>;
}
