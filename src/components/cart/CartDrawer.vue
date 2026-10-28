<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import CartLineItem from './CartLineItem.vue'
import CartTotals from './CartTotals.vue'

const cart = useCartStore()
const router = useRouter()

watch(
  () => cart.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  }
)

function close() {
  cart.open = false
}
function checkout() {
  close()
  router.push({ name: 'Checkout' })
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="cart.open" class="backdrop" @click="close" />
    </Transition>
    <Transition name="drawer">
      <aside v-if="cart.open" class="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" tabindex="-1" @keydown="onKey">
        <header class="drawer__head">
          <h3>Tu carrito <span v-if="cart.count">· {{ cart.count }}</span></h3>
          <button type="button" class="drawer__close" aria-label="Cerrar" @click="close"><i class="fa-solid fa-xmark" /></button>
        </header>

        <div v-if="cart.isEmpty" class="drawer__empty">
          <span class="drawer__empty-icon"><i class="fa-solid fa-basket-shopping" /></span>
          <p>Todavía no agregas nada.</p>
          <button type="button" class="btn btn--yellow" @click="close">Ver catálogo</button>
        </div>

        <template v-else>
          <ul class="drawer__list">
            <CartLineItem
              v-for="item in cart.items"
              :key="item.productId"
              :product="item.product"
              :qty="item.qty"
              :subtotal-cents="item.subtotalCents"
              @change="cart.setQty(item.productId, $event)"
            />
          </ul>
          <footer class="drawer__foot">
            <CartTotals :subtotal-cents="cart.subtotalCents" :delivery-fee-cents="cart.deliveryFeeCents" :total-cents="cart.totalCents" />
            <button type="button" class="btn btn--primary btn--block" @click="checkout">
              Finalizar pedido <i class="fa-solid fa-arrow-right" />
            </button>
            <button type="button" class="drawer__continue" @click="close">Seguir comprando</button>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba($ink, 0.4);
}
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 61;
  width: min(440px, 100%);
  background: $cream;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-lg;
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 14px;
    border-bottom: 1px solid $line;
    h3 {
      font-size: 20px;
      span {
        color: $muted;
        font-weight: 500;
      }
    }
  }
  &__close {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: $white;
    box-shadow: $shadow-sm;
  }
  &__list {
    list-style: none;
    margin: 0;
    padding: 0 20px;
    flex: 1;
    overflow-y: auto;
  }
  &__foot {
    padding: 16px 20px 20px;
    border-top: 1px solid $line;
    background: $white;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  &__continue {
    font-size: 14px;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 24px;
    text-align: center;
    color: $ink-soft;
  }
  &__empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: $yellow-soft;
    color: $yellow-deep;
    font-size: 26px;
  }
}
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.32s $ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
