<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import type { Category, Product } from '@/types'

defineProps<{ category: Category; products: Product[] }>()

const cart = useCartStore()
const toast = useToast()

function add(p: Product) {
  cart.add(p.id)
  toast.show(`${p.name} agregado al carrito`, 'ok', 2200)
}
</script>

<template>
  <section :id="`linea-${category.slug}`" class="cat">
    <header class="cat__head">
      <span class="eyebrow">{{ category.name }}</span>
      <h2>{{ category.tagline }}</h2>
      <p v-if="category.description">{{ category.description }}</p>
    </header>
    <div class="cat__grid">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :qty="cart.qtyOf(p.id)"
        @add="add(p)"
        @change="cart.setQty(p.id, $event)"
      />
    </div>
    <p v-if="category.note" class="cat__note"><i class="fa-solid fa-box-open" /> {{ category.note }}</p>
  </section>
</template>

<style scoped lang="scss">
.cat {
  scroll-margin-top: 90px;
  &__head {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 22px;
    max-width: 640px;
    h2 {
      font-size: clamp(24px, 3.4vw, 34px);
    }
    p {
      color: $ink-soft;
    }
  }
  &__grid {
    @include flex-cards(250px, 16px);
    > * {
      max-width: 100%;
      @include from(sm) {
        max-width: calc(50% - 8px);
      }
      @include from(lg) {
        max-width: calc(25% - 12px);
      }
    }
  }
  &__note {
    margin-top: 16px;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    padding: 10px 16px;
    border-radius: 999px;
    background: $yellow-soft;
    font-size: 13px;
    font-weight: 500;
    i {
      color: $yellow-deep;
    }
  }
}
</style>
