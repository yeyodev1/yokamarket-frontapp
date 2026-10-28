<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; size?: 'card' | 'hero' }>()

const slug = computed(() => (typeof props.product.category === 'string' ? '' : props.product.category.slug))

const icon = computed(() => {
  if (slug.value === 'sweet-bites') return 'fa-ice-cream'
  if (slug.value === 'yoka-green') return 'fa-leaf'
  return 'fa-bowl-food'
})
</script>

<template>
  <div class="pimg" :class="[`pimg--${slug || 'default'}`, size && `pimg--${size}`]">
    <img v-if="product.image" :src="product.image" :alt="product.name" loading="lazy" />
    <div v-else class="pimg__tile" aria-hidden="true">
      <span class="pimg__ring"><i class="fa-solid" :class="icon" /></span>
      <span class="pimg__word">YOKA</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pimg {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: $radius;
  overflow: hidden;
  background: $yellow-soft;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &--hero {
    aspect-ratio: 1;
    border-radius: $radius-lg;
  }
  &__tile {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: radial-gradient(120% 90% at 20% 10%, rgba($white, 0.75), transparent 60%), $yellow-soft;
  }
  &__ring {
    width: 34%;
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: $yellow;
    color: $ink;
    font-size: clamp(22px, 4vw, 38px);
    box-shadow: 0 10px 30px rgba($yellow-deep, 0.35);
  }
  &__word {
    position: absolute;
    right: -4%;
    bottom: -14%;
    font-family: $font-head;
    font-weight: 800;
    font-size: clamp(64px, 18vw, 140px);
    letter-spacing: -0.04em;
    color: rgba($ink, 0.05);
    user-select: none;
  }
  &--yoka-green {
    background: $green-soft;
    .pimg__tile {
      background: radial-gradient(120% 90% at 20% 10%, rgba($white, 0.7), transparent 60%), $green-soft;
    }
    .pimg__ring {
      background: $green;
      color: $white;
      box-shadow: 0 10px 30px rgba($green, 0.3);
    }
  }
  &--sweet-bites {
    background: $kraft-soft;
    .pimg__tile {
      background: radial-gradient(120% 90% at 20% 10%, rgba($white, 0.7), transparent 60%), $kraft-soft;
    }
    .pimg__ring {
      background: $kraft;
      color: $white;
      box-shadow: 0 10px 30px rgba($kraft, 0.3);
    }
  }
}
</style>
