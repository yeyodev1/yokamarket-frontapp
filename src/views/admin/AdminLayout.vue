<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminService } from '@/services/admin.service'
import ToastStack from '@/components/ui/ToastStack.vue'

const userStore = useUserStore()
const router = useRouter()
const toPrepare = shallowRef(0)
let timer = 0

// Contador de pedidos por preparar en el menú; se refresca cada minuto.
async function refreshBadge() {
  try {
    toPrepare.value = (await adminService.stats()).toPrepare
  } catch {
    /* sin sesión o sin red: el badge simplemente no se muestra */
  }
}
onMounted(() => {
  refreshBadge()
  timer = window.setInterval(refreshBadge, 60000)
})
onUnmounted(() => window.clearInterval(timer))

function logout() {
  userStore.clear()
  router.replace({ name: 'AdminLogin' })
}
</script>

<template>
  <div class="adm">
    <aside class="adm__side">
      <RouterLink to="/admin/pedidos" class="adm__brand"><img src="/wordmark.png" alt="YOKA Market" width="120" height="42" /></RouterLink>
      <nav class="adm__nav">
        <RouterLink :to="{ name: 'AdminDashboard' }" exact-active-class="router-link-active" :class="{ 'router-link-active': $route.name === 'AdminDashboard' }"><i class="fa-solid fa-gauge-high" /> Resumen</RouterLink>
        <RouterLink :to="{ name: 'AdminOrders' }"><i class="fa-solid fa-receipt" /> Pedidos <span v-if="toPrepare" class="adm__badge">{{ toPrepare }}</span></RouterLink>
        <RouterLink :to="{ name: 'AdminProducts' }"><i class="fa-solid fa-box" /> Productos</RouterLink>
        <RouterLink :to="{ name: 'AdminSettings' }"><i class="fa-solid fa-store" /> Tienda</RouterLink>
        <a href="/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square" /> Ver tienda</a>
      </nav>
      <div class="adm__user">
        <span>{{ userStore.user?.name }}</span>
        <button type="button" @click="logout"><i class="fa-solid fa-right-from-bracket" /> Salir</button>
      </div>
    </aside>
    <main class="adm__main">
      <RouterView />
    </main>
    <ToastStack />
  </div>
</template>

<style scoped lang="scss">
.adm {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: $cream;
  @include from(md) {
    flex-direction: row;
  }
  &__side {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
    background: $white;
    border-bottom: 1px solid $line;
    @include from(md) {
      width: 230px;
      flex: 0 0 230px;
      min-height: 100dvh;
      position: sticky;
      top: 0;
      border-bottom: 0;
      border-right: 1px solid $line;
      padding: 24px 18px;
    }
  }
  &__brand img {
    height: 32px;
    width: auto;
  }
  &__nav {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    @include from(md) {
      flex-direction: column;
      flex: 1;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: $radius-sm;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      color: $ink-soft;
      i {
        width: 16px;
        text-align: center;
      }
      &:hover {
        background: $cream;
      }
      &.router-link-active {
        background: $yellow-soft;
        color: $ink;
      }
    }
  }
  &__badge {
    margin-left: auto;
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 999px;
    background: $ink;
    color: $yellow;
    font-size: 12px;
    display: grid;
    place-items: center;
  }
  &__user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: $muted;
    button {
      font-weight: 600;
      color: $ink-soft;
      &:hover {
        color: $red;
      }
    }
  }
  &__main {
    flex: 1;
    min-width: 0;
    padding: 24px 20px 48px;
    @include from(md) {
      padding: 32px 36px 64px;
    }
  }
}
</style>
