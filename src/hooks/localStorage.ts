import { useState } from 'react'

// TODO: use io-ts codec for safe encoding/decoding
export const useLocalStorage = <T>(key: string, initialValue: T): [T, ((v: T | ((p: T) => T)) => void)] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    const item = window.localStorage.getItem(key)

    return item ? JSON.parse(item) : initialValue
  })

  const setValue = (value: T | ((p: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value

    setStoredValue(valueToStore)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    }
  }

  return [storedValue, setValue]
}
