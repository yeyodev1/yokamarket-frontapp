<script setup lang="ts">
import { onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutForm from '@/components/checkout/CheckoutForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import PayStep from '@/components/checkout/PayStep.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const catalog = useCatalogStore()
const cart = useCartStore()
const checkout = useCheckout()

onMounted(() => catalog.load())
</script>

<template>
  <div class="co">
    <div class="co__inner">
      <header class="co__head">
        <RouterLink to="/#catalogo" class="co__back"><i class="fa-solid fa-arrow-left" /> Seguir comprando</RouterLink>
        <h1>Finalizar pedido</h1>
      </header>

      <LoadingBlock v-if="catalog.loading && !catalog.loaded" />

      <div v-else-if="cart.isEmpty" class="co__empty">
        <i class="fa-solid fa-basket-shopping" />
        <h2>Tu carrito está vacío</h2>
        <p>Elige algo rico del catálogo y vuelve aquí para pagar.</p>
        <RouterLink to="/#catalogo" class="btn btn--yellow">Ver catálogo</RouterLink>
      </div>

      <div v-else-if="!catalog.settings.acceptingOrders" class="co__empty">
        <i class="fa-solid fa-store-slash" />
        <h2>Por ahora no estamos recibiendo pedidos</h2>
        <p>Vuelve pronto o escríbenos por Instagram.</p>
      </div>

      <form v-else class="co__layout" novalidate @submit.prevent="checkout.submit()">
        <div class="co__form">
          <PayStep v-if="checkout.order.value" :order="checkout.order.value" @edit="checkout.editAgain()" />
          <CheckoutForm v-else v-model="checkout.form" :errors="checkout.errors" />
        </div>
        <div class="co__side">
          <OrderSummary
            :submitting="checkout.submitting.value"
            :can-submit="checkout.canSubmit.value && !checkout.order.value"
            :error="checkout.serverError.value"
            :locked="Boolean(checkout.order.value)"
            @submit="checkout.submit()"
          />
        </div>
        <button type="submit" class="sr-only">Pagar</button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.co {
  padding-block: 24px 48px;
  &__inner {
    @include container;
  }
  &__head {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
    h1 {
      font-size: clamp(28px, 4vw, 40px);
    }
  }
  &__back {
    font-size: 14px;
    font-weight: 600;
    color: $ink-soft;
    i {
      margin-right: 6px;
    }
  }
  &__empty {
    text-align: center;
    padding: 48px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    > i {
      font-size: 40px;
      color: $yellow;
    }
    p {
      color: $ink-soft;
    }
  }
  &__layout {
    display: flex;
    flex-direction: column;
    gap: 28px;
    @include from(md) {
      flex-direction: row;
      align-items: flex-start;
      gap: 40px;
    }
  }
  &__form {
    flex: 1 1 60%;
    min-width: 0;
  }
  &__side {
    flex: 1 1 40%;
    @include from(md) {
      position: sticky;
      top: 90px;
      max-width: 420px;
    }
  }
}
</style>
