import { Navigate } from "react-router-dom";
import useAuthContext from '../hooks/useAuthContext';

const PublicRoute = ({ children }) => {
  const { isAutenticated } = useAuthContext();

  return isAutenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;