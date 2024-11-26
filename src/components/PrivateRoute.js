// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Add your authentication logic here
  const isAuthenticated = true; // Replace with actual auth check

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
