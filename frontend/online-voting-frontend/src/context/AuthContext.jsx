import { createContext, useCallback, useMemo, useState } from 'react'
import authService from '../services/authService'
import {
  clearAuth,
  getToken,
  getUser,
  setToken as saveToken,
  setUser as saveUser,
} from '../utils/tokenStorage'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken)
  const [user, setUser] = useState(getUser)

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    const { token: newToken, user: newUser } = response.data

    saveToken(newToken)
    saveUser(newUser)
    setToken(newToken)
    setUser(newUser)

    return newUser
  }, [])

  const register = useCallback((payload) => authService.register(payload), [])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback(
    (updates) => {
      const merged = { ...user, ...updates }
      saveUser(merged)
      setUser(merged)
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, login, register, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}