<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToast } from '@/composables/useToast'
import OrderReceipt from '@/components/order/OrderReceipt.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import { statusLabel } from '@/utils/orderStatus'
import { whatsappLink } from '@/utils/whatsapp'
import type { AdminOrder, OrderStatus } from '@/types'

const route = useRoute()
const toast = useToast()
const order = shallowRef<AdminOrder | null>(null)
const error = shallowRef('')
const notes = shallowRef('')
const saving = shallowRef(false)

const nextStatuses = computed<OrderStatus[]>(() => {
  const map: Record<OrderStatus, OrderStatus[]> = {
    paid: ['preparing', 'delivered', 'cancelled'],
    review: ['paid', 'preparing', 'cancelled'],
    preparing: ['delivered', 'cancelled', 'paid'],
    delivered: ['preparing'],
    pending: ['cancelled'],
    failed: ['cancelled'],
    cancelled: [],
  }
  return order.value ? map[order.value.status] : []
})

const wa = computed(() =>
  order.value
    ? whatsappLink(order.value.customer.phone, `Hola ${order.value.customer.name.split(' ')[0]}, te escribimos de YOKA Market por tu pedido ${order.value.code} 💛`)
    : ''
)

async function load() {
  try {
    order.value = await adminService.order(String(route.params.id))
    notes.value = order.value.internalNotes
  } catch (e) {
    error.value = (e as { message?: string }).message || 'No encontramos el pedido'
  }
}

async function setStatus(s: OrderStatus) {
  if (!order.value) return
  if (s === 'cancelled' && !window.confirm('¿Cancelar este pedido?')) return
  saving.value = true
  try {
    order.value = await adminService.setOrderStatus(order.value.id, s)
    toast.show(`Pedido marcado como ${statusLabel[s].toLowerCase()}`, 'ok')
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo cambiar el estado', 'error')
  } finally {
    saving.value = false
  }
}

async function saveNotes() {
  if (!order.value) return
  saving.value = true
  try {
    order.value = await adminService.setOrderNotes(order.value.id, notes.value)
    toast.show('Notas guardadas', 'ok')
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudieron guardar', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="od">
    <RouterLink :to="{ name: 'AdminOrders' }" class="od__back"><i class="fa-solid fa-arrow-left" /> Pedidos</RouterLink>
    <LoadingBlock v-if="!order && !error" />
    <LoadingBlock v-else-if="error" :error="error" @retry="load" />
    <div v-else-if="order" class="od__layout">
      <div class="od__main">
        <OrderReceipt :order="order" />
        <section class="od__card">
          <h3>Notas internas</h3>
          <textarea v-model="notes" rows="3" placeholder="Hora de entrega acordada, repartidor, etc." />
          <button type="button" class="btn btn--ghost btn--sm" :disabled="saving" @click="saveNotes">Guardar notas</button>
        </section>
      </div>
      <aside class="od__side">
        <section class="od__card">
          <h3>Acciones</h3>
          <a v-if="wa" :href="wa" target="_blank" rel="noopener" class="btn btn--primary btn--block"><i class="fa-brands fa-whatsapp" /> Escribir al cliente</a>
          <button v-for="s in nextStatuses" :key="s" type="button" class="btn btn--block" :class="s === 'cancelled' ? 'btn--ghost' : 'btn--yellow'" :disabled="saving" @click="setStatus(s)">
            Marcar {{ statusLabel[s].toLowerCase() }}
          </button>
        </section>
        <section class="od__card od__meta">
          <h3>Línea de tiempo</h3>
          <p><span>Creado</span>{{ new Date(order.createdAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }) }}</p>
          <p v-if="order.paidAt"><span>Pagado</span>{{ new Date(order.paidAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }) }}</p>
          <p><span>Último cambio</span>{{ new Date(order.updatedAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }) }}</p>
        </section>
        <section class="od__card od__meta">
          <h3>Payphone</h3>
          <p><span>Estado</span>{{ order.payment.transactionStatus || '—' }} <template v-if="order.payment.statusCode">({{ order.payment.statusCode }})</template></p>
          <p><span>Transacción</span>{{ order.payment.transactionId || '—' }}</p>
          <p><span>Autorización</span>{{ order.payment.authorizationCode || '—' }}</p>
          <p><span>Monto cobrado</span>{{ order.payment.amountCents != null ? `$${(order.payment.amountCents / 100).toFixed(2)}` : '—' }}</p>
          <p><span>Tarjeta</span>{{ order.payment.cardBrand || '—' }} {{ order.payment.lastDigits }}</p>
          <p><span>Mensaje</span>{{ order.payment.message || '—' }}</p>
          <p><span>Intentos</span>{{ order.attempts }}</p>
          <p><span>clientTransactionId</span><code>{{ order.clientTransactionId }}</code></p>
          <p v-if="order.customer.email"><span>Correo</span>{{ order.customer.email }}</p>
          <p v-if="order.customer.documentId"><span>Cédula</span>{{ order.customer.documentId }}</p>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.od {
  display: flex;
  flex-direction: column;
  gap: 18px;
  &__back {
    font-size: 14px;
    font-weight: 600;
    color: $ink-soft;
    i {
      margin-right: 6px;
    }
  }
  &__layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
    @include from(lg) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  &__main {
    flex: 1 1 60%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__side {
    flex: 1 1 40%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: $ink-soft;
    }
    textarea {
      width: 100%;
      padding: 10px 12px;
      border-radius: $radius-sm;
      border: 1.5px solid $line;
      resize: vertical;
    }
  }
  &__meta p {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 13px;
    span {
      color: $muted;
    }
    code {
      font-size: 11px;
      word-break: break-all;
    }
  }
}
</style>
