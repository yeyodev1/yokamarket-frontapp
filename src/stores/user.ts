import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { adminService } from '@/services/admin.service'
import { getToken, setToken } from '@/services/httpBase'
import type { AuthUser } from '@/types'

/** Sesión del panel admin. */
export const useUserStore = defineStore('user', () => {
  const user = shallowRef<AuthUser | null>(null)
  const restoring = shallowRef(false)

  async function login(email: string, password: string) {
    const { token, user: u } = await adminService.login(email, password)
    setToken(token)
    user.value = u
  }

  function clear() {
    setToken('')
    user.value = null
  }

  /** Al arrancar: si hay token guardado, se verifica contra /auth/me. */
  async function restore() {
    if (!getToken() || user.value) return
    restoring.value = true
    try {
      user.value = await adminService.me()
    } catch {
      clear()
    } finally {
      restoring.value = false
    }
  }

  return { user, restoring, login, clear, restore }
})
