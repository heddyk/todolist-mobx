import { IDB_KEY } from '../constants/indexeddb'
import { IndexedDBConfig } from '../types/indexeddb.types'
import { getConnection } from './db'

async function setupIndexedDB(config: IndexedDBConfig) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await getConnection(config)

      console.log('inside Init', config)

      const w = window as { [key: string]: any }
      w[IDB_KEY] = { init: 1, config }

      resolve()
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

export default setupIndexedDB
