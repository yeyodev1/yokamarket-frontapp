<script setup lang="ts">
import { copy } from '@/config/site'
</script>

<template>
  <section id="como-funciona" class="how">
    <div class="how__inner">
      <header class="how__head">
        <span class="eyebrow">Cómo funciona</span>
        <h2>{{ copy.how.title }}</h2>
      </header>
      <ol class="how__steps">
        <li v-for="(s, i) in copy.how.steps" :key="s.title" class="how__step">
          <span class="how__num">{{ i + 1 }}</span>
          <i class="fa-solid" :class="s.icon" />
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.how {
  scroll-margin-top: 80px;
  background: $ink;
  color: $white;
  border-radius: $radius-lg;
  margin-inline: 12px;
  @include from(md) {
    margin-inline: 24px;
  }
  &__inner {
    @include container;
    padding-block: 56px;
  }
  &__head {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 32px;
    .eyebrow {
      color: $yellow;
    }
    h2 {
      font-size: clamp(26px, 3.6vw, 38px);
    }
  }
  &__steps {
    list-style: none;
    margin: 0;
    padding: 0;
    @include flex-cards(240px, 16px);
  }
  &__step {
    position: relative;
    padding: 24px;
    border-radius: $radius;
    background: rgba($white, 0.05);
    border: 1px solid rgba($white, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
    > i {
      font-size: 24px;
      color: $yellow;
    }
    h3 {
      font-size: 19px;
    }
    p {
      font-size: 14px;
      color: rgba($white, 0.72);
    }
  }
  &__num {
    position: absolute;
    top: 18px;
    right: 18px;
    font-family: $font-head;
    font-weight: 800;
    font-size: 40px;
    line-height: 1;
    color: rgba($white, 0.1);
  }
}
</style>
