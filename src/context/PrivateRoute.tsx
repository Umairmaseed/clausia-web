import React from 'react'
import Loader from '../components/loader'
import { useAuth } from './Authcontext'
import { Navigate } from 'react-router-dom'
interface PrivateRouteProps {
  element: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isLoggedIn, isLoading, user } = useAuth()

  return (
    <>
      {isLoggedIn ? <>{element}</> : <Loader />}
      {!isLoggedIn && !user && isLoading && <Navigate to="/login" />}
      {isLoading && <Loader />}
    </>
  )
}

export default PrivateRoute
