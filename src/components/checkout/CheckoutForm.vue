<script setup lang="ts">
import type { CheckoutForm } from '@/types'

defineProps<{ errors: Partial<Record<keyof CheckoutForm, string>> }>()
const form = defineModel<CheckoutForm>({ required: true })
</script>

<template>
  <div class="cf">
    <section class="cf__group">
      <h2><span>1</span> Tus datos</h2>
      <div class="cf__row">
        <div class="field">
          <label for="name">Nombre y apellido</label>
          <input id="name" v-model="form.name" type="text" autocomplete="name" :aria-invalid="Boolean(errors.name)" placeholder="Ej. María Pérez" />
          <span v-if="errors.name" class="field__error">{{ errors.name }}</span>
        </div>
        <div class="field">
          <label for="phone">Celular (WhatsApp)</label>
          <input id="phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel" :aria-invalid="Boolean(errors.phone)" placeholder="0991234567" />
          <span v-if="errors.phone" class="field__error">{{ errors.phone }}</span>
          <span v-else class="field__hint">Te escribimos por aquí para coordinar la entrega.</span>
        </div>
      </div>
      <div class="cf__row">
        <div class="field">
          <label for="email">Correo <small>(opcional)</small></label>
          <input id="email" v-model="form.email" type="email" autocomplete="email" :aria-invalid="Boolean(errors.email)" placeholder="tu@correo.com" />
          <span v-if="errors.email" class="field__error">{{ errors.email }}</span>
        </div>
        <div class="field">
          <label for="doc">Cédula <small>(opcional, para la factura)</small></label>
          <input id="doc" v-model="form.documentId" type="text" inputmode="numeric" placeholder="0912345678" />
        </div>
      </div>
    </section>

    <section class="cf__group">
      <h2><span>2</span> Entrega</h2>
      <div class="field">
        <label for="address">Dirección</label>
        <input id="address" v-model="form.address" type="text" autocomplete="street-address" :aria-invalid="Boolean(errors.address)" placeholder="Calle, número, urbanización o edificio" />
        <span v-if="errors.address" class="field__error">{{ errors.address }}</span>
      </div>
      <div class="cf__row">
        <div class="field">
          <label for="city">Ciudad</label>
          <input id="city" v-model="form.city" type="text" autocomplete="address-level2" />
        </div>
        <div class="field">
          <label for="sector">Sector <small>(opcional)</small></label>
          <input id="sector" v-model="form.sector" type="text" placeholder="Ej. Ceibos, Samborondón…" />
        </div>
      </div>
      <div class="field">
        <label for="reference">Referencia <small>(opcional)</small></label>
        <input id="reference" v-model="form.reference" type="text" placeholder="Casa esquinera, portón negro, frente a…" />
      </div>
      <div class="field">
        <label for="notes">Notas para tu pedido <small>(opcional)</small></label>
        <textarea id="notes" v-model="form.notes" placeholder="Horario preferido, indicaciones para el repartidor…" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.cf {
  display: flex;
  flex-direction: column;
  gap: 28px;
  &__group {
    display: flex;
    flex-direction: column;
    gap: 14px;
    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      margin-bottom: 4px;
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
    small {
      font-weight: 400;
      color: $muted;
    }
  }
  &__row {
    display: flex;
    flex-direction: column;
    gap: 14px;
    @include from(sm) {
      flex-direction: row;
      > * {
        flex: 1;
      }
    }
  }
}
</style>
