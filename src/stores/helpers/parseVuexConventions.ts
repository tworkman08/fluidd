import { consola } from 'consola'
import { getStores } from './storesPlugins'

// Parses a vuex 'namespace/action' string for pinia's use
export function usePiniaStore (piniaAction: string, result: unknown) {
  const [namespace, action] = piniaAction.split('/')

  for (const piniaStore of getStores()) {
    if (piniaStore.$id === namespace) {
      return piniaStore[action](result)
    }
  }
  consola.error('pinia request failed')
}
