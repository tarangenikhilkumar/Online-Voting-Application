const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (value) => EMAIL_REGEX.test(value.trim())

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', required: true, test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', required: true, test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter', required: true, test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', required: true, test: (p) => /\d/.test(p) },
  { id: 'special', label: 'One special character', required: false, test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '' }

  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length

  if (passed <= 2) return { level: 1, label: 'Weak' }
  if (passed === 3) return { level: 2, label: 'Fair' }
  if (passed === 4) return { level: 3, label: 'Good' }
  return { level: 4, label: 'Strong' }
}

const validatePassword = (password) => {
  if (!password) return 'Password is required'

  const failed = PASSWORD_RULES.some((rule) => rule.required && !rule.test(password))
  return failed ? 'Password does not meet the requirements' : undefined
}

const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required'
  if (!isValidEmail(email)) return 'Enter a valid email address'
  return undefined
}

export const validateLogin = ({ email, password }) => {
  const errors = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  if (!password) errors.password = 'Password is required'

  return errors
}

export const validateRegister = ({ fullName, email, password, confirmPassword }) => {
  const errors = {}

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required'
  } else if (fullName.trim().length < 3) {
    errors.fullName = 'Name must be at least 3 characters'
  }

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export const validateForgotPassword = ({ email }) => {
  const errors = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  return errors
}

export const validateResetPassword = ({ newPassword, confirmPassword }) => {
  const errors = {}

  const passwordError = validatePassword(newPassword)
  if (passwordError) errors.newPassword = passwordError

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}