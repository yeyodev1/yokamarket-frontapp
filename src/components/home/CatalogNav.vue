<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{ categories: Category[] }>()
</script>

<template>
  <nav class="cnav" aria-label="Líneas de producto">
    <a v-for="c in categories" :key="c.id" :href="`#linea-${c.slug}`" class="cnav__item">{{ c.name }}</a>
  </nav>
</template>

<style scoped lang="scss">
.cnav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &__item {
    flex: 0 0 auto;
    padding: 10px 16px;
    border-radius: 999px;
    background: $white;
    box-shadow: inset 0 0 0 1.5px $line;
    font-family: $font-head;
    font-weight: 600;
    font-size: 14px;
    transition:
      background 0.15s,
      box-shadow 0.15s;
    &:hover {
      background: $yellow-soft;
      box-shadow: inset 0 0 0 1.5px $yellow;
    }
  }
}
</style>
