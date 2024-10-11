import React, { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserService } from '../services/User'
import { useNavigate } from 'react-router-dom'
import { set } from 'react-hook-form'

type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  logout: () => void
  login: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ['UserInfo'],
    queryFn: () => UserService.infoUser(),
  })

  useEffect(() => {
    if (data) {
      setUser(data)
    } else if (error) {
      setUser(null)
    }
    setIsLoading(queryLoading)
  }, [queryLoading])

  const logout = () => {
    setUser(null)
    navigate('/login')
  }

  const login = () => {
    data && setUser(data)
  }

  const isLoggedIn = Boolean(user)

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
