import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const TOKEN_KEY = 'yoka_admin_token'

/**
 * A qué backend hablar. localhost → backend local; túnel con "-front" en el
 * host → mismo host con "-back"; si no, VITE_API_BASE_URL o el backapp de prod.
 */
export function resolveApiBaseUrl(): string {
  const host = window.location.hostname
  const isLocal = ['localhost', '127.0.0.1'].includes(host)

  let fallback = 'https://yokamarket-backapp.vercel.app/api'
  if (isLocal) fallback = 'http://localhost:8100/api'
  else if (host.includes('-front')) {
    fallback = `${window.location.protocol}//${host.replace('-front', '-back')}/api`
  }

  const envUrl = (import.meta.env.VITE_API_BASE_URL as string) || ''
  const envIsLocal = envUrl.includes('localhost') || envUrl.includes('127.0.0.1')
  const raw = envUrl && (isLocal || !envIsLocal) ? envUrl : fallback
  const trimmed = raw.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

export interface ApiError {
  status: number
  message: string
  data?: unknown
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as { message?: string } | undefined
      return { status: error.response.status, message: data?.message || error.message, data }
    }
    if (error.code === 'ECONNABORTED') {
      return { status: 408, message: 'El servidor tardó demasiado en responder' }
    }
    return { status: 0, message: 'No pudimos conectar con el servidor. Revisa tu internet.' }
  }
  return { status: 500, message: (error as Error)?.message || 'Error inesperado' }
}

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token: string) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* modo privado */
  }
}

const http = axios.create({ baseURL: resolveApiBaseUrl(), timeout: 30000 })

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (r) => r,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && getToken()) {
      setToken('')
      window.dispatchEvent(new CustomEvent('auth:token-expired'))
    }
    return Promise.reject(toApiError(error))
  }
)

export class APIBase {
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await http.get<T>(url, config)).data
  }
  protected async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await http.post<T>(url, body, config)).data
  }
  protected async patch<T>(url: string, body?: unknown): Promise<T> {
    return (await http.patch<T>(url, body)).data
  }
  protected async delete<T>(url: string): Promise<T> {
    return (await http.delete<T>(url)).data
  }
}
