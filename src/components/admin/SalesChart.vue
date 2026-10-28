<script setup lang="ts">
import { computed } from 'vue'
import { formatUsd } from '@/utils/money'

const props = defineProps<{ days: Array<{ date: string; count: number; totalCents: number }> }>()

const max = computed(() => Math.max(1, ...props.days.map((d) => d.totalCents)))
const total = computed(() => props.days.reduce((s, d) => s + d.totalCents, 0))
const bars = computed(() =>
  props.days.map((d) => {
    const date = new Date(`${d.date}T12:00:00`)
    return {
      ...d,
      height: Math.max(d.totalCents > 0 ? 6 : 2, Math.round((d.totalCents / max.value) * 100)),
      label: date.toLocaleDateString('es-EC', { weekday: 'short' }).replace('.', ''),
      day: date.getDate(),
      title: `${date.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}: ${d.count} pedidos · ${formatUsd(d.totalCents)}`,
    }
  })
)
</script>

<template>
  <section class="chart">
    <header>
      <h3>Ventas de los últimos 14 días</h3>
      <strong>{{ formatUsd(total) }}</strong>
    </header>
    <div class="chart__bars" role="img" :aria-label="`Ventas por día, total ${formatUsd(total)}`">
      <div v-for="b in bars" :key="b.date" class="chart__col" :title="b.title">
        <span class="chart__val" v-if="b.totalCents">{{ formatUsd(b.totalCents).replace(',00', '') }}</span>
        <span class="chart__bar" :class="{ 'chart__bar--empty': !b.totalCents }" :style="{ height: `${b.height}%` }" />
        <span class="chart__lbl">{{ b.label }}<small>{{ b.day }}</small></span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.chart {
  padding: 18px 20px 12px;
  border-radius: $radius;
  background: $white;
  box-shadow: $shadow-sm;
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
    h3 {
      font-size: 14px;
      color: $ink-soft;
    }
    strong {
      font-family: $font-head;
      font-size: 20px;
    }
  }
  &__bars {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 150px;
  }
  &__col {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  }
  &__val {
    font-size: 10px;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    display: none;
    @include from(md) {
      display: block;
    }
  }
  &__bar {
    width: 100%;
    max-width: 34px;
    border-radius: 6px 6px 3px 3px;
    background: $yellow;
    transition: height 0.4s $ease;
    &--empty {
      background: $cream-deep;
    }
  }
  &__lbl {
    font-size: 11px;
    color: $muted;
    text-transform: capitalize;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.1;
    small {
      font-size: 10px;
    }
  }
}
</style>
