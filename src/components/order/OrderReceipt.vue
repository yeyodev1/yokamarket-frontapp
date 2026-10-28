<script setup lang="ts">
import { computed } from 'vue'
import TagPill from '@/components/ui/TagPill.vue'
import { formatUsd } from '@/utils/money'
import { statusLabel, statusTone } from '@/utils/orderStatus'
import type { PublicOrder } from '@/types'

const props = defineProps<{ order: PublicOrder }>()
const date = computed(() => new Date(props.order.createdAt).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }))
</script>

<template>
  <section class="rc">
    <header class="rc__head">
      <div>
        <span class="rc__label">Pedido</span>
        <h2>{{ order.code }}</h2>
        <span class="rc__date">{{ date }}</span>
      </div>
      <TagPill :tone="statusTone[order.status]">{{ statusLabel[order.status] }}</TagPill>
    </header>

    <ul class="rc__items">
      <li v-for="(it, i) in order.items" :key="i">
        <span class="rc__qty">{{ it.qty }}×</span>
        <span class="rc__name">{{ it.name }} <small>{{ it.unit }}</small></span>
        <span>{{ formatUsd(it.subtotalCents) }}</span>
      </li>
    </ul>

    <dl class="rc__totals">
      <div><dt>Subtotal</dt><dd>{{ formatUsd(order.subtotalCents) }}</dd></div>
      <div><dt>Envío</dt><dd>{{ order.deliveryFeeCents ? formatUsd(order.deliveryFeeCents) : 'Se coordina por WhatsApp' }}</dd></div>
      <div class="rc__total"><dt>Total</dt><dd>{{ formatUsd(order.totalCents) }}</dd></div>
    </dl>

    <div class="rc__cols">
      <div>
        <h3>Entrega</h3>
        <p>{{ order.customer.name }}</p>
        <p>{{ order.delivery.address }}<template v-if="order.delivery.sector">, {{ order.delivery.sector }}</template><template v-if="order.delivery.city">, {{ order.delivery.city }}</template></p>
        <p v-if="order.delivery.reference" class="rc__muted">Ref: {{ order.delivery.reference }}</p>
        <p v-if="order.delivery.notes" class="rc__muted">Notas: {{ order.delivery.notes }}</p>
      </div>
      <div v-if="order.payment.authorizationCode">
        <h3>Pago</h3>
        <p>{{ order.payment.cardBrand || 'Payphone' }} <template v-if="order.payment.lastDigits">· {{ order.payment.lastDigits }}</template></p>
        <p class="rc__muted">Autorización {{ order.payment.authorizationCode }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rc {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: $radius-lg;
  background: $white;
  box-shadow: $shadow;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    h2 {
      font-size: 26px;
      letter-spacing: 0.02em;
    }
  }
  &__label,
  &__date {
    font-size: 12px;
    color: $muted;
    display: block;
  }
  &__items {
    list-style: none;
    margin: 0;
    padding: 14px 0;
    border-top: 1px solid $line;
    border-bottom: 1px solid $line;
    display: flex;
    flex-direction: column;
    gap: 8px;
    li {
      display: flex;
      gap: 10px;
      font-size: 14px;
    }
    small {
      color: $muted;
      display: block;
      font-size: 12px;
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
  &__totals {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    > div {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      dd {
        margin: 0;
        font-weight: 600;
      }
    }
  }
  &__total {
    font-family: $font-head;
    font-size: 18px !important;
    padding-top: 8px;
    border-top: 1px solid $line;
  }
  &__cols {
    @include flex-cards(200px, 16px);
    h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: $ink-soft;
      margin-bottom: 6px;
    }
    p {
      font-size: 14px;
    }
  }
  &__muted {
    color: $muted;
    font-size: 13px !important;
  }
}
</style>
