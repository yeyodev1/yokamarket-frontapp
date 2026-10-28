<script setup lang="ts">
import { onMounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToast } from '@/composables/useToast'
import StatsCards from '@/components/admin/StatsCards.vue'
import OrdersTable from '@/components/admin/OrdersTable.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import { statusLabel } from '@/utils/orderStatus'
import type { AdminOrder, AdminStats, OrderStatus } from '@/types'

const toast = useToast()
const route = useRoute()
const stats = shallowRef<AdminStats | null>(null)
const orders = shallowRef<AdminOrder[]>([])
const total = shallowRef(0)
const pages = shallowRef(1)
const page = shallowRef(1)
const status = shallowRef<OrderStatus | ''>((route.query.status as OrderStatus) || '')
const q = shallowRef('')
const loading = shallowRef(false)

const filters: Array<{ value: OrderStatus | ''; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'paid', label: statusLabel.paid },
  { value: 'preparing', label: statusLabel.preparing },
  { value: 'delivered', label: statusLabel.delivered },
  { value: 'review', label: statusLabel.review },
  { value: 'pending', label: statusLabel.pending },
  { value: 'failed', label: statusLabel.failed },
  { value: 'cancelled', label: statusLabel.cancelled },
]

async function load() {
  loading.value = true
  try {
    const [s, list] = await Promise.all([
      adminService.stats(),
      adminService.orders({ status: status.value || undefined, q: q.value || undefined, page: page.value }),
    ])
    stats.value = s
    orders.value = list.items
    total.value = list.total
    pages.value = list.pages
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No pudimos cargar los pedidos', 'error')
  } finally {
    loading.value = false
  }
}

async function quickStatus(order: AdminOrder, next: OrderStatus) {
  try {
    await adminService.setOrderStatus(order.id, next)
    toast.show(`${order.code} marcado como ${statusLabel[next].toLowerCase()}`, 'ok')
    await load()
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo cambiar el estado', 'error')
  }
}

let timer = 0
watch([status, q], () => {
  page.value = 1
  window.clearTimeout(timer)
  timer = window.setTimeout(load, 250)
})
watch(page, load)
onMounted(load)
</script>

<template>
  <div class="ord">
    <header class="ord__head">
      <h1>Pedidos</h1>
      <button type="button" class="btn btn--ghost btn--sm" :disabled="loading" @click="load"><i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }" /> Actualizar</button>
    </header>
    <StatsCards :stats="stats" />
    <div class="ord__filters">
      <div class="ord__chips">
        <button v-for="f in filters" :key="f.value" type="button" :class="{ active: status === f.value }" @click="status = f.value">{{ f.label }}</button>
      </div>
      <input v-model="q" type="search" placeholder="Buscar por código, nombre o teléfono" class="ord__search" />
    </div>
    <LoadingBlock v-if="loading && !orders.length" />
    <OrdersTable v-else :orders="orders" @status="quickStatus" />
    <footer v-if="pages > 1" class="ord__pager">
      <button type="button" class="btn btn--ghost btn--sm" :disabled="page <= 1" @click="page--">Anterior</button>
      <span>Página {{ page }} de {{ pages }} · {{ total }} pedidos</span>
      <button type="button" class="btn btn--ghost btn--sm" :disabled="page >= pages" @click="page++">Siguiente</button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.ord {
  display: flex;
  flex-direction: column;
  gap: 20px;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 28px;
    }
  }
  &__filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
    @include from(lg) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  &__chips {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    button {
      flex: 0 0 auto;
      padding: 8px 14px;
      border-radius: 999px;
      background: $white;
      box-shadow: inset 0 0 0 1.5px $line;
      font-size: 13px;
      font-weight: 600;
      &.active {
        background: $ink;
        color: $white;
        box-shadow: none;
      }
    }
  }
  &__search {
    min-height: 42px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1.5px solid $line;
    background: $white;
    min-width: 260px;
    &:focus {
      outline: none;
      border-color: $ink;
    }
  }
  &__pager {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    font-size: 13px;
    color: $muted;
  }
}
</style>
