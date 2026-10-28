<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import ProductImage from '@/components/ui/ProductImage.vue'
import TagPill from '@/components/ui/TagPill.vue'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import ProductCard from '@/components/home/ProductCard.vue'
import { formatUsd } from '@/utils/money'

const route = useRoute()
const catalog = useCatalogStore()
const cart = useCartStore()
const toast = useToast()

onMounted(() => catalog.load())

const product = computed(() => catalog.products.find((p) => p.slug === route.params.slug))
const categorySlug = computed(() => (product.value && typeof product.value.category !== 'string' ? product.value.category.slug : ''))
const category = computed(() => catalog.categories.find((c) => c.slug === categorySlug.value))
const related = computed(() => (catalog.productsByCategory.get(categorySlug.value) || []).filter((p) => p.id !== product.value?.id).slice(0, 3))

const gallery = computed(() => (product.value ? [product.value.image, ...product.value.images].filter(Boolean) : []))
const activeImage = shallowRef('')
watch(gallery, (g) => {
  activeImage.value = g[0] || ''
}, { immediate: true })

const qty = computed({
  get: () => (product.value ? cart.qtyOf(product.value.id) : 0),
  set: (v: number) => product.value && cart.setQty(product.value.id, v),
})

watch(product, (p) => {
  if (p) document.title = `${p.name} · YOKA Market`
}, { immediate: true })

function add() {
  if (!product.value) return
  cart.add(product.value.id)
  toast.show(`${product.value.name} agregado al carrito`, 'ok', 2200)
}
</script>

<template>
  <div class="pv">
    <div class="pv__inner">
      <nav class="pv__crumbs" aria-label="Ruta">
        <RouterLink to="/">Inicio</RouterLink>
        <i class="fa-solid fa-chevron-right" />
        <RouterLink v-if="category" :to="`/#linea-${category.slug}`">{{ category.name }}</RouterLink>
      </nav>

      <LoadingBlock v-if="catalog.loading && !catalog.loaded" />
      <LoadingBlock v-else-if="catalog.error" :error="catalog.error" @retry="catalog.load(true)" />
      <div v-else-if="!product" class="pv__missing">
        <h1>No encontramos ese producto</h1>
        <RouterLink to="/#catalogo" class="btn btn--yellow">Ver catálogo</RouterLink>
      </div>

      <article v-else class="pv__main">
        <div class="pv__media">
          <div class="pv__main-img">
            <img v-if="activeImage" :src="activeImage" :alt="product.name" />
            <ProductImage v-else :product="product" size="hero" />
          </div>
          <div v-if="gallery.length > 1" class="pv__thumbs">
            <button v-for="(img, i) in gallery" :key="img" type="button" :class="{ active: img === activeImage }" :aria-label="`Foto ${i + 1}`" @click="activeImage = img">
              <img :src="img" alt="" loading="lazy" />
            </button>
          </div>
        </div>
        <div class="pv__info">
          <span class="eyebrow">{{ category?.name }}</span>
          <h1>{{ product.name }}</h1>
          <p class="pv__unit">{{ product.unit }}</p>
          <div class="pv__badges">
            <TagPill v-for="b in product.badges" :key="b" tone="green">{{ b }}</TagPill>
            <TagPill v-if="product.kcal" tone="neutral">{{ product.kcal }} kcal</TagPill>
            <TagPill v-if="product.portion" tone="neutral">Porción {{ product.portion }}</TagPill>
          </div>
          <p class="pv__desc">{{ product.description || product.shortDescription }}</p>
          <p v-if="product.ingredients" class="pv__ing"><strong>Ingredientes:</strong> {{ product.ingredients }}</p>
          <div class="pv__buy">
            <strong class="pv__price">{{ formatUsd(product.priceCents) }}</strong>
            <QtyStepper v-if="qty > 0" v-model="qty" />
            <button v-else type="button" class="btn btn--yellow" @click="add"><i class="fa-solid fa-plus" /> Agregar al carrito</button>
            <button v-if="qty > 0" type="button" class="btn btn--primary" @click="cart.open = true">Ver carrito</button>
          </div>
          <p v-if="category?.note" class="pv__note"><i class="fa-solid fa-box-open" /> {{ category.note }}</p>
        </div>
      </article>

      <section v-if="related.length" class="pv__related">
        <h2>También de {{ category?.name }}</h2>
        <div class="pv__related-grid">
          <ProductCard v-for="p in related" :key="p.id" :product="p" :qty="cart.qtyOf(p.id)" @add="cart.add(p.id); toast.show(`${p.name} agregado`, 'ok', 2000)" @change="cart.setQty(p.id, $event)" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pv {
  padding-block: 20px 48px;
  &__inner {
    @include container;
  }
  &__crumbs {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: $muted;
    margin-bottom: 24px;
    a:hover {
      color: $ink;
    }
    i {
      font-size: 10px;
    }
  }
  &__missing {
    text-align: center;
    padding: 64px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  &__main {
    display: flex;
    flex-direction: column;
    gap: 28px;
    @include from(md) {
      flex-direction: row;
      gap: 48px;
      align-items: flex-start;
    }
  }
  &__media {
    flex: 1 1 45%;
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__main-img {
    aspect-ratio: 1;
    border-radius: $radius-lg;
    overflow: hidden;
    background: $yellow-soft;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__thumbs {
    display: flex;
    gap: 8px;
    button {
      width: 68px;
      height: 68px;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid transparent;
      transition: border-color 0.15s;
      &.active {
        border-color: $yellow;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  &__info {
    flex: 1 1 55%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    h1 {
      font-size: clamp(30px, 4.5vw, 46px);
    }
  }
  &__unit {
    font-weight: 600;
    color: $yellow-deep;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 13px;
  }
  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  &__desc {
    font-size: 17px;
    color: $ink-soft;
  }
  &__ing {
    font-size: 14px;
    color: $ink-soft;
  }
  &__buy {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    padding: 18px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    margin-top: 8px;
  }
  &__price {
    font-family: $font-head;
    font-size: 28px;
    margin-right: auto;
  }
  &__note {
    font-size: 13px;
    color: $ink-soft;
    i {
      color: $yellow-deep;
      margin-right: 6px;
    }
  }
  &__related {
    margin-top: 64px;
    h2 {
      font-size: 24px;
      margin-bottom: 18px;
    }
  }
  &__related-grid {
    @include flex-cards(250px, 16px);
    > * {
      @include from(md) {
        max-width: calc(33.333% - 11px);
      }
    }
  }
}
</style>
