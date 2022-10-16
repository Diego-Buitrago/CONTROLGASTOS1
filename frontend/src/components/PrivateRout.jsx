import { Navigate } from "react-router-dom";
import useAuthContext from '../hooks/useAuthContext';

const PrivateRoute = ({ children }) => {
  const { isAutenticated } = useAuthContext();
 
  return isAutenticated ? children  : <Navigate to="/login" />;
};

export default PrivateRoute;