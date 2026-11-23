import { STORAGE_KEYS } from './constants'

export const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)

export const setToken = (token) =>
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)

export const removeToken = () => localStorage.removeItem(STORAGE_KEYS.TOKEN)

export const getUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setUser = (user) =>
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}