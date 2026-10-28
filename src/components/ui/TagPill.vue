<script setup lang="ts">
defineProps<{ tone?: 'yellow' | 'green' | 'kraft' | 'neutral' | 'red' }>()
</script>

<template>
  <span class="pill" :class="`pill--${tone || 'yellow'}`"><slot /></span>
</template>

<style scoped lang="scss">
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  &--yellow {
    background: $yellow-soft;
    color: #6b4f00;
  }
  &--green {
    background: $green-soft;
    color: #245c38;
  }
  &--kraft {
    background: $kraft-soft;
    color: #6a4426;
  }
  &--neutral {
    background: $cream-deep;
    color: $ink-soft;
  }
  &--red {
    background: $red-soft;
    color: #8b2a22;
  }
}
</style>
