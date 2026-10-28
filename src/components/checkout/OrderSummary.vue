<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import CartTotals from '@/components/cart/CartTotals.vue'
import { formatUsd } from '@/utils/money'

defineProps<{ submitting: boolean; canSubmit: boolean; error: string; locked?: boolean }>()
const emit = defineEmits<{ submit: [] }>()
const cart = useCartStore()
</script>

<template>
  <aside class="sum">
    <h2>Tu pedido</h2>
    <ul class="sum__list">
      <li v-for="it in cart.items" :key="it.productId">
        <span class="sum__qty">{{ it.qty }}×</span>
        <span class="sum__name">{{ it.product.name }}</span>
        <span class="sum__price">{{ formatUsd(it.subtotalCents) }}</span>
      </li>
    </ul>
    <button v-if="!locked" type="button" class="sum__edit" @click="cart.open = true"><i class="fa-solid fa-pen" /> Editar carrito</button>
    <CartTotals :subtotal-cents="cart.subtotalCents" :delivery-fee-cents="cart.deliveryFeeCents" :total-cents="cart.totalCents" />
    <p v-if="error" class="sum__error"><i class="fa-solid fa-circle-exclamation" /> {{ error }}</p>
    <p v-if="locked" class="sum__locked"><i class="fa-solid fa-arrow-left" /> Completa el pago en la cajita de Payphone.</p>
    <button v-else type="button" class="btn btn--yellow btn--block sum__pay" :disabled="!canSubmit" @click="emit('submit')">
      <template v-if="submitting"><i class="fa-solid fa-spinner fa-spin" /> Creando tu pedido…</template>
      <template v-else><i class="fa-solid fa-lock" /> Continuar al pago · {{ formatUsd(cart.totalCents) }}</template>
    </button>
    <p v-if="!locked" class="sum__safe">Pagas aquí mismo con Payphone: tarjeta de crédito, débito o saldo Payphone. Nunca vemos los datos de tu tarjeta.</p>
  </aside>
</template>

<style scoped lang="scss">
.sum {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border-radius: $radius-lg;
  background: $white;
  box-shadow: $shadow;
  h2 {
    font-size: 20px;
  }
  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    li {
      display: flex;
      gap: 10px;
      font-size: 14px;
    }
  }
  &__qty {
    color: $muted;
    font-weight: 600;
    min-width: 26px;
  }
  &__name {
    flex: 1;
  }
  &__price {
    font-weight: 600;
  }
  &__edit {
    align-self: flex-start;
    font-size: 13px;
    font-weight: 600;
    color: $ink-soft;
    i {
      margin-right: 4px;
      font-size: 11px;
    }
    &:hover {
      color: $ink;
    }
  }
  &__error {
    padding: 10px 14px;
    border-radius: $radius-sm;
    background: $red-soft;
    color: #8b2a22;
    font-size: 14px;
    font-weight: 500;
  }
  &__locked {
    padding: 12px 14px;
    border-radius: $radius-sm;
    background: $yellow-soft;
    font-size: 14px;
    font-weight: 600;
  }
  &__pay {
    min-height: 54px;
    font-size: 16px;
  }
  &__safe {
    font-size: 12px;
    color: $muted;
    text-align: center;
  }
}
</style>
