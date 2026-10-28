<script setup lang="ts">
import { computed } from 'vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import TagPill from '@/components/ui/TagPill.vue'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import { formatUsd } from '@/utils/money'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; qty: number }>()
const emit = defineEmits<{ add: []; change: [qty: number] }>()

const qtyModel = computed({
  get: () => props.qty,
  set: (v: number) => emit('change', v),
})
const meta = computed(() => [props.product.kcal ? `${props.product.kcal} kcal` : '', props.product.portion ? `Porción ${props.product.portion}` : ''].filter(Boolean).join(' · '))
</script>

<template>
  <article class="card" :class="{ 'card--in': qty > 0 }">
    <RouterLink :to="`/producto/${product.slug}`" class="card__media">
      <ProductImage :product="product" />
      <img v-if="product.images[0]" :src="product.images[0]" alt="" class="card__alt" loading="lazy" />
      <span v-if="product.featured" class="card__fav"><i class="fa-solid fa-star" /> Favorito</span>
    </RouterLink>
    <div class="card__body">
      <div class="card__head">
        <RouterLink :to="`/producto/${product.slug}`"><h3>{{ product.name }}</h3></RouterLink>
        <strong class="card__price">{{ formatUsd(product.priceCents) }}</strong>
      </div>
      <p class="card__unit">{{ product.unit }}</p>
      <p class="card__desc">{{ product.shortDescription }}</p>
      <p v-if="meta" class="card__meta">{{ meta }}</p>
      <div v-if="product.badges.length" class="card__badges">
        <TagPill v-for="b in product.badges" :key="b" :tone="b.toLowerCase().includes('gluten') ? 'kraft' : b.toLowerCase().includes('azúcar') || b.toLowerCase().includes('natural') ? 'green' : 'yellow'">{{ b }}</TagPill>
      </div>
      <div class="card__actions">
        <QtyStepper v-if="qty > 0" v-model="qtyModel" />
        <button v-else type="button" class="btn btn--yellow btn--block" @click="emit('add')">
          <i class="fa-solid fa-plus" /> Agregar
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: $radius-lg;
  padding: 10px;
  box-shadow: $shadow-sm;
  border: 1.5px solid transparent;
  transition:
    transform 0.25s $ease,
    box-shadow 0.25s $ease,
    border-color 0.25s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow;
  }
  &--in {
    border-color: $yellow;
  }
  &__media {
    position: relative;
    display: block;
    border-radius: $radius;
    overflow: hidden;
  }
  &__alt {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.35s $ease;
  }
  &:hover &__alt {
    opacity: 1;
  }
  &__fav {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    border-radius: 999px;
    background: $ink;
    color: $yellow;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 10px 8px;
    flex: 1;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    h3 {
      font-size: 18px;
    }
  }
  &__price {
    font-family: $font-head;
    font-size: 18px;
    white-space: nowrap;
  }
  &__unit {
    font-size: 12px;
    font-weight: 600;
    color: $yellow-deep;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  &__desc {
    font-size: 14px;
    color: $ink-soft;
  }
  &__meta {
    font-size: 12px;
    color: $muted;
  }
  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
  }
  &__actions {
    margin-top: auto;
    padding-top: 12px;
    display: flex;
    justify-content: center;
  }
}
</style>
