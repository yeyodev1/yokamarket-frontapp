<script setup lang="ts">
import { copy } from '@/config/site'
</script>

<template>
  <section class="why">
    <div class="why__inner">
      <header class="why__head">
        <span class="eyebrow">Por qué YOKA</span>
        <h2>{{ copy.why.title }}</h2>
      </header>
      <div class="why__items">
        <article v-for="it in copy.why.items" :key="it.title" class="why__item">
          <span class="why__icon"><i class="fa-solid" :class="it.icon" /></span>
          <h3>{{ it.title }}</h3>
          <p>{{ it.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.why {
  &__inner {
    @include container;
    padding-block: 64px 16px;
  }
  &__head {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
    h2 {
      font-size: clamp(26px, 3.6vw, 38px);
    }
  }
  &__items {
    @include flex-cards(240px, 16px);
  }
  &__item {
    padding: 24px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    display: flex;
    flex-direction: column;
    gap: 10px;
    h3 {
      font-size: 18px;
    }
    p {
      font-size: 14px;
      color: $ink-soft;
    }
  }
  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: $yellow-soft;
    color: $yellow-deep;
    font-size: 18px;
  }
}
</style>
