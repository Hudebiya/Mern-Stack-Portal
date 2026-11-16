import { useCallback, useEffect, useState } from 'react'
import api, { getApiErrorMessage } from '../api/axios.js'

export default function useFetch(url, params, initial = []) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const key = JSON.stringify(params || {})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(url, { params: JSON.parse(key) })
      setData(res.data)
      setError('')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load data'))
    } finally {
      setLoading(false)
    }
  }, [url, key])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}