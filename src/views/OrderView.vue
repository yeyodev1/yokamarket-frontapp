<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCatalogStore } from '@/stores/catalog'
import OrderReceipt from '@/components/order/OrderReceipt.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import PayphoneBox from '@/components/checkout/PayphoneBox.vue'
import type { PublicOrder } from '@/types'

const route = useRoute()
const catalog = useCatalogStore()
const order = shallowRef<PublicOrder | null>(null)
const error = shallowRef('')
const retrying = shallowRef(false)
const paying = shallowRef(false)

async function load() {
  error.value = ''
  try {
    order.value = await orderService.getByCode(String(route.params.code))
  } catch (e) {
    error.value = (e as { message?: string }).message || 'No encontramos el pedido'
  }
}

async function payAgain() {
  if (!order.value) return
  retrying.value = true
  try {
    // Cada intento necesita un clientTransactionId nuevo; el backend lo genera.
    const o = order.value.status === 'pending' && order.value.checkout ? order.value : await orderService.retry(order.value.code)
    order.value = o
    if (o.checkout) paying.value = true
    else if (o.payUrl) window.location.assign(o.payUrl)
  } catch (e) {
    error.value = (e as { message?: string }).message || 'No pudimos reabrir el pago'
  } finally {
    retrying.value = false
  }
}

onMounted(() => {
  catalog.load()
  load()
})
</script>

<template>
  <div class="ov">
    <div class="ov__inner">
      <h1>Tu pedido</h1>
      <LoadingBlock v-if="!order && !error" />
      <LoadingBlock v-else-if="error" :error="error" @retry="load" />
      <template v-else-if="order">
        <div v-if="['pending', 'failed', 'cancelled'].includes(order.status)" class="ov__pay">
          <p>Este pedido todavía no está pagado.</p>
          <button v-if="!paying" type="button" class="btn btn--yellow" :disabled="retrying" @click="payAgain">
            <i class="fa-solid fa-lock" /> {{ retrying ? 'Preparando…' : 'Pagar ahora' }}
          </button>
        </div>
        <div v-if="paying && order.checkout" class="ov__box">
          <h2>Paga aquí</h2>
          <PayphoneBox :key="order.checkout.clientTransactionId" :checkout="order.checkout" />
        </div>
        <OrderReceipt :order="order" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ov {
  padding-block: 32px 48px;
  &__inner {
    @include container(760px);
    display: flex;
    flex-direction: column;
    gap: 20px;
    h1 {
      font-size: clamp(28px, 4vw, 40px);
    }
  }
  &__box {
    padding: 22px;
    border-radius: $radius-lg;
    background: $white;
    box-shadow: $shadow;
    display: flex;
    flex-direction: column;
    gap: 12px;
    h2 {
      font-size: 20px;
    }
  }
  &__pay {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-radius: $radius;
    background: $yellow-soft;
    font-weight: 500;
  }
}
</style>
