import { API_BASE_URL } from './constants'

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${SERVER_ORIGIN}${path}`
}