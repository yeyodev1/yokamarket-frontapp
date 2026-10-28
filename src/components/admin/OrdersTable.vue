<script setup lang="ts">
import TagPill from '@/components/ui/TagPill.vue'
import { formatUsd } from '@/utils/money'
import { statusLabel, statusTone } from '@/utils/orderStatus'
import type { AdminOrder, OrderStatus } from '@/types'

defineProps<{ orders: AdminOrder[]; compact?: boolean }>()
const emit = defineEmits<{ status: [order: AdminOrder, status: OrderStatus] }>()

const quick: Partial<Record<OrderStatus, { label: string; next: OrderStatus; icon: string }>> = {
  paid: { label: 'Preparar', next: 'preparing', icon: 'fa-fire' },
  preparing: { label: 'Entregado', next: 'delivered', icon: 'fa-check' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="tbl">
    <table>
      <thead>
        <tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th><th v-if="!compact"></th></tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td><RouterLink :to="{ name: 'AdminOrderDetail', params: { id: o.id } }" class="tbl__code">{{ o.code }}</RouterLink></td>
          <td><div class="tbl__client"><strong>{{ o.customer.name }}</strong><span>{{ o.customer.phone }}</span></div></td>
          <td class="tbl__items">{{ o.items.map((i) => `${i.qty}× ${i.name}`).join(', ') }}</td>
          <td><strong>{{ formatUsd(o.totalCents) }}</strong></td>
          <td><TagPill :tone="statusTone[o.status]">{{ statusLabel[o.status] }}</TagPill></td>
          <td class="tbl__date">{{ fmtDate(o.createdAt) }}</td>
          <td v-if="!compact" class="tbl__quick">
            <button v-if="quick[o.status]" type="button" class="btn btn--yellow btn--sm" @click="emit('status', o, quick[o.status]!.next)">
              <i class="fa-solid" :class="quick[o.status]!.icon" /> {{ quick[o.status]!.label }}
            </button>
          </td>
        </tr>
        <tr v-if="!orders.length"><td colspan="7" class="tbl__empty">No hay pedidos con ese filtro.</td></tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.tbl {
  overflow-x: auto;
  border-radius: $radius;
  background: $white;
  box-shadow: $shadow-sm;
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    min-width: 720px;
  }
  th,
  td {
    padding: 12px 14px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid $line;
  }
  th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $muted;
    font-weight: 600;
  }
  tbody tr:hover {
    background: $yellow-tint;
  }
  &__code {
    font-family: $font-head;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  &__client {
    display: flex;
    flex-direction: column;
    span {
      font-size: 12px;
      color: $muted;
    }
  }
  &__items {
    max-width: 320px;
    color: $ink-soft;
  }
  &__date {
    white-space: nowrap;
    color: $muted;
  }
  &__quick {
    white-space: nowrap;
    text-align: right;
  }
  &__empty {
    text-align: center;
    color: $muted;
    padding: 32px;
  }
}
</style>
