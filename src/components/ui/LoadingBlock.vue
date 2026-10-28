<script setup lang="ts">
defineProps<{ text?: string; error?: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="loading">
    <template v-if="error">
      <i class="fa-solid fa-triangle-exclamation loading__err" />
      <p>{{ error }}</p>
      <button type="button" class="btn btn--ghost btn--sm" @click="emit('retry')">Reintentar</button>
    </template>
    <template v-else>
      <span class="loading__spinner" />
      <p>{{ text || 'Cargando…' }}</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 20px;
  color: $ink-soft;
  text-align: center;
  &__spinner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid $yellow-soft;
    border-top-color: $yellow;
    animation: spin 0.8s linear infinite;
  }
  &__err {
    font-size: 28px;
    color: $red;
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
