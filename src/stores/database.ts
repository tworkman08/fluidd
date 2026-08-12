import { defineStore } from 'pinia'
import getFilePaths from '@/util/get-file-paths'
import { SocketActions } from '@/api/socketActions'

export const useDatabaseStore = defineStore('database', {
  state: (): DatabaseState => ({
    info: null
  }),
  getters: {
    getBackups: (state): string[] => {
      const backups = [...state.info?.backups ?? []]

      return backups
        .sort((a, b) => a.localeCompare(b))
    }
  },
  actions: {
    async init () {
      SocketActions.serverDatabaseList()
    },

    async onServerDatabaseList (payload: DatabaseInfo) {
      this.info = payload
    },

    async onServerDatabasePostBackup (payload: { backup_path: string }) {
      if (this.info?.backups) {
        const { filename } = getFilePaths(payload.backup_path)

        this.info.backups.push(filename)
      }
    },
    async onServerDatabaseDeleteBackup (payload: { backup_path: string }) {
      if (this.info?.backups) {
        const { filename } = getFilePaths(payload.backup_path)
        const index = this.info.backups.findIndex(backup => backup === filename)

        if (index >= 0) {
          this.info.backups.splice(index, 1)
        }
      }
    }
  }
})

export interface DatabaseState {
  info: DatabaseInfo | null;
}

export interface DatabaseInfo {
  namespaces: string[];
  backups: string[];
}
