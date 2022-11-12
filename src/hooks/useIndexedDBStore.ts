import { useMemo } from 'react'
import { getActions } from '../utils/db'

export function useIndexedDBStore<T>(storeName: string) {
  const _actions = useMemo(() => getActions<T>(storeName), [storeName])
  return _actions
}
