<script setup lang="ts">
const props = withDefaults(defineProps<{ min?: number; max?: number; size?: 'sm' | 'md' }>(), {
  min: 0,
  max: 99,
  size: 'md',
})
const model = defineModel<number>({ required: true })

function step(delta: number) {
  const next = Math.min(props.max, Math.max(props.min, model.value + delta))
  model.value = next
}
</script>

<template>
  <div class="stepper" :class="`stepper--${size}`">
    <button type="button" aria-label="Quitar uno" :disabled="model <= min" @click="step(-1)">
      <i class="fa-solid" :class="model <= 1 && min === 0 ? 'fa-trash-can' : 'fa-minus'" />
    </button>
    <span class="stepper__value" aria-live="polite">{{ model }}</span>
    <button type="button" aria-label="Agregar uno" :disabled="model >= max" @click="step(1)">
      <i class="fa-solid fa-plus" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: $white;
  box-shadow: inset 0 0 0 1.5px $line;
  overflow: hidden;
  button {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    font-size: 13px;
    transition: background 0.15s;
    &:hover:not(:disabled) {
      background: $yellow-tint;
    }
    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }
  &__value {
    min-width: 28px;
    text-align: center;
    font-family: $font-head;
    font-weight: 700;
    font-size: 15px;
  }
  &--sm button {
    width: 34px;
    height: 34px;
    font-size: 12px;
  }
}
</style>
