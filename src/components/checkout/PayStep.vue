<script setup lang="ts">
import PayphoneBox from './PayphoneBox.vue'
import { formatUsd } from '@/utils/money'
import type { PublicOrder } from '@/types'

defineProps<{ order: PublicOrder }>()
const emit = defineEmits<{ edit: [] }>()
</script>

<template>
  <section class="pay">
    <header class="pay__head">
      <span class="pay__check"><i class="fa-solid fa-check" /></span>
      <div>
        <h2>Pedido {{ order.code }} listo para pagar</h2>
        <p>{{ order.customer.name }} · {{ order.delivery.address }}<template v-if="order.delivery.sector">, {{ order.delivery.sector }}</template></p>
      </div>
      <button type="button" class="pay__edit" @click="emit('edit')"><i class="fa-solid fa-pen" /> Cambiar datos</button>
    </header>

    <div class="pay__box">
      <h3><span>3</span> Paga aquí · {{ formatUsd(order.totalCents) }}</h3>
      <p class="pay__hint">Elige tarjeta o saldo Payphone. Al terminar te mostramos la confirmación de tu pedido.</p>
      <PayphoneBox v-if="order.checkout" :checkout="order.checkout" />
      <p class="pay__safe"><i class="fa-solid fa-shield-halved" /> Pago procesado por Payphone. Nunca vemos los datos de tu tarjeta.</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pay {
  display: flex;
  flex-direction: column;
  gap: 18px;
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: $radius;
    background: $green-soft;
    h2 {
      font-size: 18px;
    }
    p {
      font-size: 13px;
      color: $ink-soft;
    }
    > div {
      flex: 1;
      min-width: 200px;
    }
  }
  &__check {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: $green;
    color: $white;
  }
  &__edit {
    font-size: 13px;
    font-weight: 600;
    color: $ink-soft;
    i {
      font-size: 11px;
      margin-right: 4px;
    }
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 22px;
    border-radius: $radius-lg;
    background: $white;
    box-shadow: $shadow;
    h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      span {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: $yellow;
        font-size: 14px;
      }
    }
  }
  &__hint {
    font-size: 14px;
    color: $ink-soft;
  }
  &__safe {
    font-size: 12px;
    color: $muted;
    i {
      margin-right: 4px;
    }
  }
}
</style>
