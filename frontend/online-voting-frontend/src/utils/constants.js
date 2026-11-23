export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const STORAGE_KEYS = {
  TOKEN: 'sv_token',
  USER: 'sv_user',
  THEME: 'sv_theme',
}

export const ROLES = {
  ADMIN: 'ADMIN',
  VOTER: 'VOTER',
  CANDIDATE: 'CANDIDATE',
}

export const ELECTION_STATUS = {
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  RESULTS_PUBLISHED: 'RESULTS_PUBLISHED',
}

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  VOTER: '/voter/dashboard',
  CANDIDATE: '/candidate/dashboard',
}