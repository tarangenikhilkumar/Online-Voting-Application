import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../utils/getErrorMessage'

export function useFetch(fetcher) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetcher()
      setData(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}