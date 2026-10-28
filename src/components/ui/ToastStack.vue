<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <button
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.tone}`"
        type="button"
        @click="dismiss(t.id)"
      >
        <i
          class="fa-solid"
          :class="t.tone === 'ok' ? 'fa-check' : t.tone === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'"
        />
        <span>{{ t.text }}</span>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toasts {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 420px;
  padding: 12px 18px;
  border-radius: 999px;
  background: $ink;
  color: $white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: $shadow-lg;
  text-align: left;
  i {
    color: $yellow;
  }
  &--error {
    background: $red;
    i {
      color: $white;
    }
  }
  &--ok i {
    color: #8ee0a6;
  }
}
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s $ease,
    transform 0.25s $ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
