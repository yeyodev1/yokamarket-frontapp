import { computed, reactive, shallowRef } from 'vue'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import type { CheckoutForm, PublicOrder } from '@/types'

const DRAFT_KEY = 'yoka_checkout_draft'

function readDraft(): Partial<CheckoutForm> {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
  } catch {
    return {}
  }
}

/** Formulario de checkout: validación en cliente, envío y redirección a Payphone. */
export function useCheckout() {
  const cart = useCartStore()
  const draft = readDraft()

  const form = reactive<CheckoutForm>({
    name: draft.name || '',
    phone: draft.phone || '',
    email: draft.email || '',
    documentId: draft.documentId || '',
    address: draft.address || '',
    city: draft.city || 'Guayaquil',
    sector: draft.sector || '',
    reference: draft.reference || '',
    notes: '',
  })

  const errors = reactive<Partial<Record<keyof CheckoutForm, string>>>({})
  const submitting = shallowRef(false)
  const serverError = shallowRef('')
  // Pedido creado y pendiente de pago: con él se renderiza la Cajita de Payphone.
  const order = shallowRef<PublicOrder | null>(null)

  function validate(): boolean {
    for (const k of Object.keys(errors) as (keyof CheckoutForm)[]) delete errors[k]
    if (form.name.trim().length < 2) errors.name = 'Escribe tu nombre'
    const phone = form.phone.replace(/[\s\-().]/g, '')
    if (!/^(\+?593|0)?9\d{8}$/.test(phone) && !/^(\+?593|0)[2-7]\d{7}$/.test(phone)) {
      errors.phone = 'Escribe un celular válido (ej. 0991234567)'
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) errors.email = 'El correo no es válido'
    if (form.address.trim().length < 5) errors.address = 'Escribe la dirección de entrega'
    return Object.keys(errors).length === 0
  }

  const canSubmit = computed(() => !cart.isEmpty && !submitting.value)

  async function submit(): Promise<void> {
    serverError.value = ''
    if (!validate()) return
    submitting.value = true
    try {
      try {
        const { notes: _n, ...rest } = form
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
      } catch {
        /* privado */
      }
      const created = await orderService.create({
        items: cart.lines.map((l) => ({ productId: l.productId, qty: l.qty })),
        customer: { name: form.name, phone: form.phone, email: form.email, documentId: form.documentId },
        delivery: { address: form.address, city: form.city, sector: form.sector, reference: form.reference, notes: form.notes },
      })
      // El carrito se vacía al confirmarse el pago, no antes: si vuelve sin pagar, lo conserva.
      try {
        sessionStorage.setItem('yoka_last_order', created.code)
      } catch {
        /* privado */
      }
      if (created.checkout) {
        order.value = created
        submitting.value = false
        return
      }
      // Modo redirección (si el backend está configurado así).
      if (!created.payUrl) throw new Error('No recibimos el enlace de pago. Intenta de nuevo.')
      window.location.assign(created.payUrl)
    } catch (e) {
      serverError.value = (e as { message?: string }).message || 'No pudimos crear tu pedido'
      submitting.value = false
    }
  }

  function editAgain() {
    order.value = null
  }

  return { form, errors, submitting, serverError, canSubmit, order, submit, editAgain }
}
