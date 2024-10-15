import React from 'react'
import Loader from '../components/loader'
import { Navigate } from 'react-router-dom'
import { useAuth } from './Authcontext'
interface PrivateRouteProps {
  element: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isLoggedIn, isLoading } = useAuth()

  return <>
  {isLoggedIn ? <>{element}</> : <Navigate to="/login" replace />};
  {isLoading && <Loader/>}
  </>
}

export default PrivateRoute
