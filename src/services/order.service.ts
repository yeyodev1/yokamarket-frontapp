import { APIBase } from './httpBase'
import type { CartLine, CheckoutForm, PublicOrder } from '@/types'

export interface CreateOrderPayload {
  items: CartLine[]
  customer: Pick<CheckoutForm, 'name' | 'phone' | 'email' | 'documentId'>
  delivery: Pick<CheckoutForm, 'address' | 'city' | 'sector' | 'reference' | 'notes'>
}

class OrderService extends APIBase {
  create(payload: CreateOrderPayload) {
    return this.post<PublicOrder>('/orders', payload)
  }
  getByCode(code: string) {
    return this.get<PublicOrder>(`/orders/${encodeURIComponent(code)}`)
  }
  retry(code: string) {
    return this.post<PublicOrder>(`/orders/${encodeURIComponent(code)}/retry`)
  }
  confirm(id: number, clientTransactionId: string) {
    return this.post<PublicOrder>('/payments/confirm', { id, clientTransactionId })
  }
  cancel(clientTransactionId: string) {
    return this.post<PublicOrder>('/payments/cancel', { clientTransactionId })
  }
}

export const orderService = new OrderService()
