import type { OrderStatus } from '@/types'

export const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  preparing: 'En preparación',
  delivered: 'Entregado',
  failed: 'Pago rechazado',
  cancelled: 'Cancelado',
  review: 'En revisión',
}

export const statusTone: Record<OrderStatus, 'neutral' | 'green' | 'yellow' | 'red' | 'kraft'> = {
  pending: 'yellow',
  paid: 'green',
  preparing: 'kraft',
  delivered: 'neutral',
  failed: 'red',
  cancelled: 'neutral',
  review: 'red',
}
