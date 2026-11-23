export const getErrorMessage = (error) => {
  if (error?.response) {
    const data = error.response.data

    if (data?.message) return data.message

    if (data?.errors && typeof data.errors === 'object') {
      const firstError = Object.values(data.errors)[0]
      if (firstError) return String(firstError)
    }

    return `Request failed with status ${error.response.status}`
  }

  if (error?.request) {
    return 'Cannot reach the server. Please check your connection.'
  }

  return error?.message || 'Something went wrong. Please try again.'
}