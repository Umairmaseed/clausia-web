import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './Authcontext'
interface PrivateRouteProps {
  element: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <>{element}</> : <Navigate to="/login" replace />;
}

export default PrivateRoute
