import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

interface PrivateRouteProps {
    element: React.ReactNode;
    [key: string]: any; 
  }

  const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
    const { isLoggedIn } = useAuth(); // Check if the user is logged in
  
    return (
      <Route
        {...rest}
        element={isLoggedIn ? element : <Navigate to="/login" replace />}
      />
    );
  };
  
  export default PrivateRoute;
