import { useMemo } from 'react'
import { getActions } from '../utils/indexedDB'

export function useIndexedDBStore<T>(storeName: string) {
  const _actions = useMemo(() => getActions<T>(storeName), [storeName])
  return _actions
}
