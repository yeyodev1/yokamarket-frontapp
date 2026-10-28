<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToast } from '@/composables/useToast'
import StatsCards from '@/components/admin/StatsCards.vue'
import SalesChart from '@/components/admin/SalesChart.vue'
import OrdersTable from '@/components/admin/OrdersTable.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import { formatUsd } from '@/utils/money'
import type { AdminStats } from '@/types'

const toast = useToast()
const stats = shallowRef<AdminStats | null>(null)
const loading = shallowRef(true)

async function load() {
  loading.value = true
  try {
    stats.value = await adminService.stats()
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No pudimos cargar el resumen', 'error')
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>

<template>
  <div class="dash">
    <header class="dash__head">
      <div>
        <h1>Hola, YOKA</h1>
        <p>Así va tu tienda hoy.</p>
      </div>
      <div class="dash__actions">
        <RouterLink :to="{ name: 'AdminOrders', query: { status: 'paid' } }" class="btn btn--yellow btn--sm"><i class="fa-solid fa-fire" /> Por preparar</RouterLink>
        <a href="/" target="_blank" rel="noopener" class="btn btn--ghost btn--sm"><i class="fa-solid fa-store" /> Ver tienda</a>
      </div>
    </header>

    <LoadingBlock v-if="loading && !stats" />
    <template v-else-if="stats">
      <StatsCards :stats="stats" />
      <div class="dash__row">
        <SalesChart :days="stats.days" class="dash__chart" />
        <section class="dash__top">
          <h3>Más vendidos este mes</h3>
          <ol v-if="stats.topProducts.length">
            <li v-for="p in stats.topProducts" :key="p.name">
              <span>{{ p.name }}</span>
              <small>{{ p.qty }} uds · {{ formatUsd(p.totalCents) }}</small>
            </li>
          </ol>
          <p v-else class="dash__empty">Todavía no hay ventas este mes.</p>
        </section>
      </div>
      <section class="dash__recent">
        <header>
          <h3>Últimos pedidos</h3>
          <RouterLink :to="{ name: 'AdminOrders' }">Ver todos <i class="fa-solid fa-arrow-right" /></RouterLink>
        </header>
        <OrdersTable :orders="stats.recent" compact />
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dash {
  display: flex;
  flex-direction: column;
  gap: 20px;
  &__head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    h1 {
      font-size: 28px;
    }
    p {
      color: $muted;
    }
  }
  &__actions {
    display: flex;
    gap: 8px;
  }
  &__row {
    display: flex;
    flex-direction: column;
    gap: 16px;
    @include from(lg) {
      flex-direction: row;
      align-items: stretch;
    }
  }
  &__chart {
    flex: 2 1 420px;
  }
  &__top {
    flex: 1 1 260px;
    padding: 18px 20px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    h3 {
      font-size: 14px;
      color: $ink-soft;
      margin-bottom: 12px;
    }
    ol {
      margin: 0;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      li {
        display: flex;
        flex-direction: column;
        font-weight: 600;
        font-size: 14px;
        small {
          font-weight: 400;
          color: $muted;
          font-size: 12px;
        }
      }
    }
  }
  &__empty {
    font-size: 14px;
    color: $muted;
  }
  &__recent {
    display: flex;
    flex-direction: column;
    gap: 12px;
    header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      h3 {
        font-size: 18px;
      }
      a {
        font-size: 13px;
        font-weight: 600;
        color: $ink-soft;
        i {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
