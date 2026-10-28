<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatUsd } from '@/utils/money'

const props = defineProps<{ subtotalCents: number; deliveryFeeCents: number; totalCents: number }>()
const catalog = useCatalogStore()

const freeHint = computed(() => {
  const from = catalog.settings.freeDeliveryFromCents
  if (from == null || props.deliveryFeeCents === 0) return ''
  const missing = from - props.subtotalCents
  return missing > 0 ? `Te faltan ${formatUsd(missing)} para envío gratis` : ''
})
</script>

<template>
  <dl class="totals">
    <div><dt>Subtotal</dt><dd>{{ formatUsd(subtotalCents) }}</dd></div>
    <div>
      <dt>Envío</dt>
      <dd>{{ deliveryFeeCents === 0 ? (catalog.settings.deliveryFeeCents ? 'Gratis' : 'Se coordina por WhatsApp') : formatUsd(deliveryFeeCents) }}</dd>
    </div>
    <p v-if="freeHint" class="totals__hint">{{ freeHint }}</p>
    <div class="totals__total"><dt>Total</dt><dd>{{ formatUsd(totalCents) }}</dd></div>
  </dl>
</template>

<style scoped lang="scss">
.totals {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  > div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    dt {
      color: $ink-soft;
    }
    dd {
      margin: 0;
      font-weight: 600;
    }
  }
  &__hint {
    font-size: 12px;
    color: $kraft;
    font-weight: 500;
  }
  &__total {
    padding-top: 10px;
    border-top: 1px solid $line;
    font-family: $font-head;
    font-size: 18px !important;
    dt,
    dd {
      font-weight: 700 !important;
      color: $ink !important;
    }
  }
}
</style>
