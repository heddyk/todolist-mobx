import { IDB_KEY } from '../constants/indexeddb'
import { waitUntil } from './waitUntil'

interface IndexedDBColumn {
  name: string
  keyPath: string
  options?: IDBIndexParameters
}

interface IndexedDBStore {
  id: IDBObjectStoreParameters
  name: string
  indices?: IndexedDBColumn[]
}

interface IndexedDBConfig {
  databaseName: string
  version: number
  stores: IndexedDBStore[]
}

/* interface TransactionOptions {
  storeName: string
  dbMode: IDBTransactionMode
  error: (e: Event) => any
  complete: (e: Event) => any
  abort?: any
} */

function validateStore(db: IDBDatabase, storeName: string) {
  return db.objectStoreNames.contains(storeName)
}

export function validateBeforeTransaction(
  db: IDBDatabase,
  storeName: string,
  reject: (reason?: string) => void
) {
  if (!db) {
    reject('Queried before opening connection')
  }
  if (!validateStore(db, storeName)) {
    reject(`Store ${storeName} not found`)
  }
}

export function createTransaction(
  db: IDBDatabase,
  dbMode: IDBTransactionMode,
  currentStore: string,
  resolve: any,
  reject?: any,
  abort?: any
): IDBTransaction {
  const tx: IDBTransaction = db.transaction(currentStore, dbMode)
  tx.onerror = reject
  tx.oncomplete = resolve
  tx.onabort = abort
  return tx
}

export async function getConnection(
  config?: IndexedDBConfig
): Promise<IDBDatabase> {
  const idbInstance = typeof window !== 'undefined' ? window.indexedDB : null
  let _config = config

  if (!config && idbInstance) {
    const w = window as { [key: string]: any }
    await waitUntil(() => w?.[IDB_KEY]?.['init'] === 1)

    _config = w[IDB_KEY]?.['config']
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    if (_config && idbInstance) {
      const request: IDBOpenDBRequest = idbInstance.open(
        _config.databaseName,
        _config.version
      )

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (e: Event) => {
        reject(e)
      }

      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result

        console.log(e)

        config?.stores.forEach((s) => {
          if (!db.objectStoreNames.contains(s.name)) {
            const store = db.createObjectStore(s.name, s.id)
            s.indices?.forEach((c) => {
              store.createIndex(c.name, c.keyPath, c.options)
            })
          }
        })

        db.close()
        resolve(db)
      }
    } else {
      reject('Failed to connect')
    }
  })
}

export function getByID<T>(currentStore: string, id: string | number) {
  return new Promise<T>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readonly',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.get(id)
        request.onsuccess = (e: any) => {
          resolve(e.target.result as T)
        }
      })
      .catch(reject)
  })
}

export function getOneByKey<T>(
  currentStore: string,
  keyPath: string,
  value: string | number
) {
  return new Promise<T | undefined>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readonly',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const index = objectStore.index(keyPath)
        const request = index.get(value)
        request.onsuccess = (e: any) => {
          resolve(e.target.result)
        }
      })
      .catch(reject)
  })
}

export function getManyByKey<T>(
  currentStore: string,
  keyPath: string,
  value: string | number
) {
  return new Promise<T[]>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readonly',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const index = objectStore.index(keyPath)
        const request = index.getAll(value)
        request.onsuccess = (e: any) => {
          resolve(e.target.result)
        }
      })
      .catch(reject)
  })
}

export function getAll<T>(currentStore: string) {
  return new Promise<T[]>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readonly',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.getAll()
        request.onsuccess = (e: any) => {
          resolve(e.target.result as T[])
        }
      })
      .catch(reject)
  })
}

export function add<T>(currentStore: string, value: T, key?: any) {
  return new Promise<number>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readwrite',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.add(value, key)
        request.onsuccess = (e: any) => {
          ;(tx as any)?.commit?.()
          resolve(e.target.result)
        }
      })
      .catch(reject)
  })
}

export function update<T>(currentStore: string, value: T, key?: any) {
  return new Promise<T>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readwrite',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.put(value, key)
        request.onsuccess = (e: any) => {
          ;(tx as any)?.commit?.()
          resolve(e.target.result)
        }
      })
      .catch(reject)
  })
}

export function deleteByID(currentStore: string, id: any) {
  return new Promise<any>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readwrite',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.delete(id)
        request.onsuccess = (e: any) => {
          ;(tx as any)?.commit?.()
          resolve(e)
        }
      })
      .catch(reject)
  })
}

export function deleteAll(currentStore: string) {
  return new Promise<any>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readwrite',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.clear()
        request.onsuccess = (e: any) => {
          ;(tx as any)?.commit?.()
          resolve(e)
        }
      })
      .catch(reject)
  })
}

export function openCursor(
  currentStore: string,
  cursorCallback: any,
  keyRange?: IDBKeyRange
) {
  return new Promise<IDBCursorWithValue | void>((resolve, reject) => {
    getConnection()
      .then((db) => {
        validateBeforeTransaction(db, currentStore, reject)
        const tx = createTransaction(
          db,
          'readonly',
          currentStore,
          resolve,
          reject
        )
        const objectStore = tx.objectStore(currentStore)
        const request = objectStore.openCursor(keyRange)
        request.onsuccess = (e) => {
          cursorCallback(e)
          resolve()
        }
      })
      .catch(reject)
  })
}

export function getActions<T>(currentStore: string) {
  return {
    getByID(id: string | number) {
      return getByID<T>(currentStore, id)
    },

    getOneByKey(keyPath: string, value: string | number) {
      return getOneByKey<T>(currentStore, keyPath, value)
    },

    getManyByKey(keyPath: string, value: string | number) {
      return getManyByKey<T>(currentStore, keyPath, value)
    },

    getAll() {
      return getAll<T>(currentStore)
    },

    add(value: T, key?: any) {
      return add<T>(currentStore, value, key)
    },

    update(value: T, key?: any) {
      return update<T>(currentStore, value, key)
    },

    deleteByID(id: any) {
      return deleteByID(currentStore, id)
    },

    deleteAll() {
      return deleteAll(currentStore)
    },

    openCursor(cursorCallback: any, keyRange?: IDBKeyRange) {
      return openCursor(currentStore, cursorCallback, keyRange)
    },
  }
}

async function setupIndexedDB(config: IndexedDBConfig) {
  try {
    await getConnection(config)

    const w = window as { [key: string]: any }
    w[IDB_KEY] = { init: 1, config }
  } catch (e) {
    console.error(e)
  }
}

export default setupIndexedDB
