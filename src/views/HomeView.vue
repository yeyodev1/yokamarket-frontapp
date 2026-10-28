<script setup lang="ts">
import { onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import HeroSection from '@/components/home/HeroSection.vue'
import CatalogNav from '@/components/home/CatalogNav.vue'
import CategorySection from '@/components/home/CategorySection.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import WhySection from '@/components/home/WhySection.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const catalog = useCatalogStore()
onMounted(() => catalog.load())
</script>

<template>
  <div class="home">
    <HeroSection />

    <section id="catalogo" class="home__catalog">
      <div class="home__catalog-inner">
        <div class="home__catalog-head">
          <span class="eyebrow">Catálogo</span>
          <h2>Elige tus favoritos</h2>
          <CatalogNav v-if="catalog.categories.length" :categories="catalog.categories" />
        </div>

        <LoadingBlock v-if="catalog.loading && !catalog.loaded" text="Cargando el catálogo…" />
        <LoadingBlock v-else-if="catalog.error" :error="catalog.error" @retry="catalog.load(true)" />

        <div v-else class="home__sections">
          <CategorySection
            v-for="c in catalog.categories"
            :key="c.id"
            :category="c"
            :products="catalog.productsByCategory.get(c.slug) || []"
          />
        </div>
      </div>
    </section>

    <HowItWorks />
    <WhySection />
  </div>
</template>

<style scoped lang="scss">
.home {
  &__catalog {
    scroll-margin-top: 70px;
    padding-block: 24px 64px;
  }
  &__catalog-inner {
    @include container;
  }
  &__catalog-head {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 36px;
    h2 {
      font-size: clamp(28px, 4vw, 42px);
    }
  }
  &__sections {
    display: flex;
    flex-direction: column;
    gap: 64px;
  }
}
</style>
