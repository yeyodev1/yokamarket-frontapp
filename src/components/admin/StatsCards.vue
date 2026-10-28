<script setup lang="ts">
import { formatUsd } from '@/utils/money'
import type { AdminStats } from '@/types'

defineProps<{ stats: AdminStats | null }>()
</script>

<template>
  <div class="stats">
    <article><span>Hoy</span><strong>{{ stats ? formatUsd(stats.today.totalCents) : '—' }}</strong><small>{{ stats?.today.count ?? 0 }} pedidos</small></article>
    <article><span>Este mes</span><strong>{{ stats ? formatUsd(stats.month.totalCents) : '—' }}</strong><small>{{ stats?.month.count ?? 0 }} pedidos</small></article>
    <article class="stats--hot"><span>Por preparar</span><strong>{{ stats?.toPrepare ?? '—' }}</strong><small>pagados sin entregar</small></article>
    <article :class="{ 'stats--alert': stats?.inReview }"><span>En revisión</span><strong>{{ stats?.inReview ?? '—' }}</strong><small>pagos que no cuadran</small></article>
  </div>
</template>

<style scoped lang="scss">
.stats {
  @include flex-cards(150px, 12px);
  article {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 16px 18px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    span {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $muted;
    }
    strong {
      font-family: $font-head;
      font-size: 26px;
    }
    small {
      font-size: 12px;
      color: $muted;
    }
  }
  &--hot {
    background: $yellow-soft !important;
  }
  &--alert {
    background: $red-soft !important;
  }
}
</style>
