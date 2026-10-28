import { ref } from 'vue'

export interface Toast {
  id: number
  text: string
  tone: 'ok' | 'error' | 'info'
}

// Estado de módulo: un solo stack de toasts para toda la app.
const toasts = ref<Toast[]>([])
let seq = 0

export function useToast() {
  function show(text: string, tone: Toast['tone'] = 'info', ms = 3200) {
    const id = ++seq
    toasts.value.push({ id, text, tone })
    window.setTimeout(() => dismiss(id), ms)
  }
  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }
  return { toasts, show, dismiss }
}
