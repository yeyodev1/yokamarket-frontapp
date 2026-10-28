<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { PayphoneCheckout } from '@/types'

/**
 * Cajita de pagos de Payphone (v2.0). El script del CDN se carga en index.html y
 * expone window.PPaymentButtonBox; aquí solo se configura y se renderiza.
 * Al terminar el pago, Payphone redirige a la URL de respuesta registrada en su
 * consola (debe ser /pay-response de este dominio).
 */
const props = defineProps<{ checkout: PayphoneCheckout }>()

const token = (import.meta.env.VITE_PAYPHONE_TOKEN as string) || ''
const containerId = `pp-button-${Math.random().toString(36).slice(2, 8)}`
const state = shallowRef<'loading' | 'ready' | 'error'>('loading')
const error = shallowRef('')
let timer = 0

declare global {
  interface Window {
    PPaymentButtonBox?: new (config: Record<string, unknown>) => { render: (id: string) => void }
  }
}

function render() {
  const Box = window.PPaymentButtonBox
  if (!Box) return false
  try {
    const c = props.checkout
    const config: Record<string, unknown> = {
      token,
      clientTransactionId: c.clientTransactionId,
      amount: c.amount,
      amountWithoutTax: c.amountWithoutTax,
      amountWithTax: c.amountWithTax,
      tax: c.tax,
      service: 0,
      tip: 0,
      currency: 'USD',
      storeId: c.storeId || (import.meta.env.VITE_PAYPHONE_STORE_ID as string) || undefined,
      reference: c.reference,
      lang: 'es',
      defaultMethod: 'card',
      timeZone: -5,
    }
    if (c.email) config.email = c.email
    if (c.phoneNumber) config.phoneNumber = c.phoneNumber
    if (c.documentId) {
      config.documentId = c.documentId
      config.identificationType = c.documentId.length === 13 ? 2 : 1
    }
    new Box(config).render(containerId)
    state.value = 'ready'
  } catch (e) {
    state.value = 'error'
    error.value = (e as Error)?.message || 'No se pudo cargar la cajita de pagos'
  }
  return true
}

onMounted(() => {
  if (!token) {
    state.value = 'error'
    error.value = 'Pagos no configurados (falta el token de Payphone).'
    return
  }
  let tries = 0
  const tick = () => {
    if (render()) return
    if (++tries > 60) {
      state.value = 'error'
      error.value = 'No se pudo cargar Payphone. Revisa tu conexión y recarga la página.'
      return
    }
    timer = window.setTimeout(tick, 250)
  }
  tick()
})
onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <div class="ppbox">
    <p v-if="state === 'loading'" class="ppbox__status"><i class="fa-solid fa-spinner fa-spin" /> Cargando la cajita de pagos…</p>
    <p v-else-if="state === 'error'" class="ppbox__error"><i class="fa-solid fa-circle-exclamation" /> {{ error }}</p>
    <div :id="containerId" class="ppbox__mount" />
  </div>
</template>

<style scoped lang="scss">
.ppbox {
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__status {
    font-size: 14px;
    color: $ink-soft;
  }
  &__error {
    padding: 10px 14px;
    border-radius: $radius-sm;
    background: $red-soft;
    color: #8b2a22;
    font-size: 14px;
    font-weight: 500;
  }
  &__mount {
    min-height: 56px;
  }
}
</style>
