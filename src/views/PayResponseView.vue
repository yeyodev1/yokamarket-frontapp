<script setup lang="ts">
import { computed } from 'vue'
import { usePayResponse } from '@/composables/usePayResponse'
import { useCatalogStore } from '@/stores/catalog'
import OrderReceipt from '@/components/order/OrderReceipt.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import { whatsappLink } from '@/utils/whatsapp'
import { formatUsd } from '@/utils/money'

const { state, order, message, retry } = usePayResponse()
const catalog = useCatalogStore()
catalog.load()

const wa = computed(() => {
  if (!order.value) return whatsappLink(catalog.settings.whatsapp, 'Hola YOKA Market, tengo una duda con mi pago.')
  const o = order.value
  const lines = o.items.map((i) => `• ${i.qty}× ${i.name}`).join('\n')
  return whatsappLink(
    catalog.settings.whatsapp,
    `Hola YOKA Market 👋 Acabo de pagar el pedido ${o.code} (${formatUsd(o.totalCents)}).\n${lines}\nEntrega: ${o.delivery.address}${o.delivery.sector ? ', ' + o.delivery.sector : ''}.`
  )
})
</script>

<template>
  <div class="pr">
    <div class="pr__inner">
      <LoadingBlock v-if="state === 'confirming'" text="Confirmando tu pago con Payphone…" />

      <template v-else>
        <header class="pr__head" :class="`pr__head--${state}`">
          <span class="pr__icon">
            <i class="fa-solid" :class="state === 'approved' ? 'fa-check' : state === 'cancelled' ? 'fa-arrow-rotate-left' : 'fa-xmark'" />
          </span>
          <h1 v-if="state === 'approved'">¡Pago aprobado! Tu pedido ya está con nosotros.</h1>
          <h1 v-else-if="state === 'rejected'">El pago no se completó</h1>
          <h1 v-else-if="state === 'cancelled'">Pago cancelado</h1>
          <h1 v-else>No pudimos confirmar el pago</h1>
          <p v-if="message">{{ message }}</p>
          <p v-else-if="state === 'approved'">Te escribimos por WhatsApp para coordinar la entrega. Guarda tu código de pedido.</p>
          <p v-else-if="state === 'cancelled'">No se hizo ningún cobro. Tu carrito sigue intacto por si quieres volver a intentarlo.</p>
        </header>

        <div class="pr__actions">
          <a v-if="state === 'approved' && wa" :href="wa" target="_blank" rel="noopener" class="btn btn--primary"><i class="fa-brands fa-whatsapp" /> Avisar por WhatsApp</a>
          <RouterLink v-if="state === 'approved' && order" :to="`/pedido/${order.code}`" class="btn btn--ghost">Ver mi pedido</RouterLink>
          <RouterLink v-if="state === 'rejected' || state === 'cancelled'" to="/checkout" class="btn btn--yellow"><i class="fa-solid fa-rotate-right" /> Intentar de nuevo</RouterLink>
          <button v-if="state === 'error'" type="button" class="btn btn--yellow" @click="retry"><i class="fa-solid fa-rotate-right" /> Reintentar confirmación</button>
          <a v-if="state !== 'approved' && wa" :href="wa" target="_blank" rel="noopener" class="btn btn--ghost"><i class="fa-brands fa-whatsapp" /> Escribir a la tienda</a>
          <RouterLink to="/" class="btn btn--ghost">Volver al inicio</RouterLink>
        </div>

        <OrderReceipt v-if="order" :order="order" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pr {
  padding-block: 32px 48px;
  &__inner {
    @include container(760px);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__head {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    h1 {
      font-size: clamp(26px, 4vw, 38px);
      max-width: 20ch;
    }
    p {
      color: $ink-soft;
      max-width: 50ch;
    }
    &--approved .pr__icon {
      background: $green;
      color: $white;
      box-shadow: 0 14px 34px rgba($green, 0.35);
    }
    &--cancelled .pr__icon {
      background: $yellow;
      color: $ink;
    }
    &--rejected .pr__icon,
    &--error .pr__icon {
      background: $red;
      color: $white;
    }
  }
  &__icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 30px;
    margin-bottom: 6px;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
}
</style>
