<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/layout/SiteHeader.vue'
import SiteFooter from '@/layout/SiteFooter.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import ToastStack from '@/components/ui/ToastStack.vue'

const route = useRoute()
const isAdmin = computed(() => Boolean(route.meta.admin))
</script>

<template>
  <div class="app" :class="{ 'app--admin': isAdmin }">
    <SiteHeader v-if="!isAdmin" />
    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in" appear>
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter v-if="!isAdmin" />
    <CartDrawer v-if="!isAdmin" />
    <ToastStack />
  </div>
</template>

<style scoped lang="scss">
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  &__main {
    flex: 1;
  }
}
</style>
