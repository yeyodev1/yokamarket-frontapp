<script setup lang="ts">
import { computed } from 'vue'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import { formatUsd } from '@/utils/money'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; qty: number; subtotalCents: number }>()
const emit = defineEmits<{ change: [qty: number] }>()

const qtyModel = computed({
  get: () => props.qty,
  set: (v: number) => emit('change', v),
})
</script>

<template>
  <li class="line">
    <div class="line__img"><ProductImage :product="product" /></div>
    <div class="line__body">
      <RouterLink :to="`/producto/${product.slug}`" class="line__name">{{ product.name }}</RouterLink>
      <span class="line__unit">{{ product.unit }}</span>
      <div class="line__row">
        <QtyStepper v-model="qtyModel" size="sm" />
        <strong>{{ formatUsd(subtotalCents) }}</strong>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.line {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid $line;
  &__img {
    width: 76px;
    flex: 0 0 76px;
    :deep(.pimg) {
      aspect-ratio: 1;
      border-radius: $radius-sm;
    }
  }
  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  &__name {
    font-family: $font-head;
    font-weight: 600;
    font-size: 15px;
  }
  &__unit {
    font-size: 12px;
    color: $muted;
  }
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    strong {
      font-family: $font-head;
      font-size: 15px;
    }
  }
}
</style>
