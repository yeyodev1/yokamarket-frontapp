import { onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import type { PublicOrder } from '@/types'

export type PayState = 'confirming' | 'approved' | 'rejected' | 'cancelled' | 'error'

/**
 * Página a la que vuelve Payphone: /pay-response?id=&clientTransactionId=
 * (o ?cancelled=1&clientTransactionId= si cerró la ventana).
 * Confirma contra el backend, que a su vez confirma con Payphone.
 */
export function usePayResponse() {
  const route = useRoute()
  const cart = useCartStore()
  const state = shallowRef<PayState>('confirming')
  const order = shallowRef<PublicOrder | null>(null)
  const message = shallowRef('')

  function readParams() {
    const q = route.query
    const get = (k: string) => {
      const v = q[k] ?? q[k.toLowerCase()] ?? q[k.toUpperCase()]
      return Array.isArray(v) ? String(v[0] ?? '') : String(v ?? '')
    }
    return {
      id: Number(get('id')),
      clientTransactionId: get('clientTransactionId') || get('clientTransactionID') || get('clienttransactionid'),
      cancelled: get('cancelled') === '1',
      // Payphone a veces vuelve con ?msg= (p. ej. dominio no autorizado).
      msg: get('msg'),
    }
  }

  async function run() {
    const { id, clientTransactionId, cancelled, msg } = readParams()
    state.value = 'confirming'
    message.value = ''

    if (!clientTransactionId) {
      state.value = 'error'
      message.value = 'No encontramos la referencia del pago. Si pagaste, escríbenos por WhatsApp con tu nombre.'
      return
    }

    try {
      if (cancelled || !id) {
        order.value = await orderService.cancel(clientTransactionId)
        state.value = 'cancelled'
        if (msg) message.value = `Payphone indicó: "${msg}". No se hizo ningún cobro.`
        return
      }
      const result = await orderService.confirm(id, clientTransactionId)
      order.value = result
      if (['paid', 'preparing', 'delivered'].includes(result.status)) {
        state.value = 'approved'
        cart.clear()
      } else if (result.status === 'review') {
        state.value = 'approved'
        cart.clear()
        message.value = 'Tu pago fue aprobado. Estamos revisando un detalle del pedido y te confirmamos por WhatsApp.'
      } else {
        state.value = 'rejected'
        message.value = result.payment.message || 'El banco no aprobó el pago. Puedes intentar con otra tarjeta.'
      }
    } catch (e) {
      state.value = 'error'
      message.value = (e as { message?: string }).message || 'No pudimos confirmar el pago.'
    }
  }

  onMounted(run)

  return { state, order, message, retry: run }
}
