<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { copy, site } from '@/config/site'

const cart = useCartStore()
const catalog = useCatalogStore()
const scrolled = shallowRef(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div v-if="catalog.settings.announcement" class="header__bar">{{ catalog.settings.announcement }}</div>
    <div class="header__inner">
      <RouterLink to="/" class="header__brand" :aria-label="site.name">
        <img src="/wordmark.png" :alt="site.name" width="128" height="44" />
      </RouterLink>
      <nav class="header__nav" aria-label="Principal">
        <RouterLink to="/#catalogo">{{ copy.nav.catalog }}</RouterLink>
        <RouterLink to="/#como-funciona">{{ copy.nav.how }}</RouterLink>
      </nav>
      <button type="button" class="header__cart" :aria-label="`${copy.nav.cart}, ${cart.count} productos`" @click="cart.open = true">
        <i class="fa-solid fa-basket-shopping" />
        <span class="header__cart-label">{{ copy.nav.cart }}</span>
        <Transition name="fade">
          <span v-if="cart.count" class="header__count">{{ cart.count }}</span>
        </Transition>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba($cream, 0.85);
  backdrop-filter: saturate(160%) blur(12px);
  transition: box-shadow 0.2s;
  &--scrolled {
    box-shadow: 0 1px 0 $line;
  }
  &__bar {
    background: $ink;
    color: $white;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    padding: 8px 16px;
  }
  &__inner {
    @include container;
    display: flex;
    align-items: center;
    gap: 20px;
    height: 68px;
  }
  &__brand img {
    height: 36px;
    width: auto;
    @include from(md) {
      height: 42px;
    }
  }
  &__nav {
    display: none;
    gap: 26px;
    margin-left: 16px;
    font-weight: 600;
    font-size: 15px;
    a {
      position: relative;
      padding: 6px 0;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 100%;
        bottom: 0;
        height: 2px;
        background: $yellow;
        transition: right 0.25s $ease;
      }
      &:hover::after {
        right: 0;
      }
    }
    @include from(md) {
      display: flex;
    }
  }
  &__cart {
    margin-left: auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 16px;
    border-radius: 999px;
    background: $ink;
    color: $white;
    font-family: $font-head;
    font-weight: 600;
    font-size: 14px;
    transition: transform 0.15s $ease;
    &:hover {
      transform: translateY(-1px);
    }
    i {
      color: $yellow;
    }
  }
  &__cart-label {
    display: none;
    @include from(sm) {
      display: inline;
    }
  }
  &__count {
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 999px;
    background: $yellow;
    color: $ink;
    font-size: 12px;
    font-weight: 700;
    display: grid;
    place-items: center;
  }
}
</style>
