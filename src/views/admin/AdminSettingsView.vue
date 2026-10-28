<script setup lang="ts">
import { onMounted, reactive, shallowRef } from 'vue'
import { adminService } from '@/services/admin.service'
import { catalogService } from '@/services/catalog.service'
import { useToast } from '@/composables/useToast'
import { useCatalogStore } from '@/stores/catalog'

const toast = useToast()
const catalog = useCatalogStore()
const loading = shallowRef(true)
const saving = shallowRef(false)
const form = reactive({
  storeName: '',
  whatsapp: '',
  email: '',
  instagram: '',
  city: '',
  deliveryFee: '',
  freeDeliveryFrom: '',
  minOrder: '',
  deliveryNote: '',
  announcement: '',
  acceptingOrders: true,
})
const pw = reactive({ current: '', next: '' })

onMounted(async () => {
  try {
    const s = await catalogService.getSettings()
    Object.assign(form, {
      storeName: s.storeName,
      whatsapp: s.whatsapp,
      email: s.email,
      instagram: s.instagram,
      city: s.city,
      deliveryFee: (s.deliveryFeeCents / 100).toFixed(2),
      freeDeliveryFrom: s.freeDeliveryFromCents == null ? '' : (s.freeDeliveryFromCents / 100).toFixed(2),
      minOrder: (s.minOrderCents / 100).toFixed(2),
      deliveryNote: s.deliveryNote,
      announcement: s.announcement,
      acceptingOrders: s.acceptingOrders,
    })
  } finally {
    loading.value = false
  }
})

const cents = (v: string) => Math.round(Number(String(v).replace(',', '.') || 0) * 100)

async function save() {
  saving.value = true
  try {
    await adminService.updateSettings({
      storeName: form.storeName,
      whatsapp: form.whatsapp,
      email: form.email,
      instagram: form.instagram,
      city: form.city,
      deliveryFeeCents: cents(form.deliveryFee),
      freeDeliveryFromCents: form.freeDeliveryFrom === '' ? null : cents(form.freeDeliveryFrom),
      minOrderCents: cents(form.minOrder),
      deliveryNote: form.deliveryNote,
      announcement: form.announcement,
      acceptingOrders: form.acceptingOrders,
    })
    toast.show('Ajustes guardados', 'ok')
    catalog.load(true)
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo guardar', 'error')
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  try {
    await adminService.changePassword(pw.current, pw.next)
    pw.current = ''
    pw.next = ''
    toast.show('Contraseña actualizada', 'ok')
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo cambiar', 'error')
  }
}
</script>

<template>
  <div class="st">
    <h1>Tienda</h1>
    <form v-if="!loading" class="st__card" @submit.prevent="save">
      <h2>Contacto</h2>
      <div class="st__row">
        <div class="field"><label>Nombre</label><input v-model="form.storeName" type="text" /></div>
        <div class="field"><label>WhatsApp (ej. 0991234567)</label><input v-model="form.whatsapp" type="tel" /></div>
      </div>
      <div class="st__row">
        <div class="field"><label>Correo</label><input v-model="form.email" type="email" /></div>
        <div class="field"><label>Instagram (URL)</label><input v-model="form.instagram" type="url" /></div>
        <div class="field"><label>Ciudad</label><input v-model="form.city" type="text" /></div>
      </div>
      <h2>Envíos y pedidos</h2>
      <div class="st__row">
        <div class="field"><label>Costo de envío (USD)</label><input v-model="form.deliveryFee" type="text" inputmode="decimal" /><span class="field__hint">0 = se coordina por WhatsApp</span></div>
        <div class="field"><label>Envío gratis desde (USD)</label><input v-model="form.freeDeliveryFrom" type="text" inputmode="decimal" placeholder="vacío = nunca" /></div>
        <div class="field"><label>Pedido mínimo (USD)</label><input v-model="form.minOrder" type="text" inputmode="decimal" /></div>
      </div>
      <div class="field"><label>Nota de entrega (se muestra en el pie y en el carrito)</label><input v-model="form.deliveryNote" type="text" /></div>
      <div class="field"><label>Anuncio en la barra superior (vacío = oculto)</label><input v-model="form.announcement" type="text" placeholder="Ej. Entregas martes y viernes" /></div>
      <label class="st__check"><input v-model="form.acceptingOrders" type="checkbox" /> Recibiendo pedidos (desmarca para pausar la tienda)</label>
      <div><button type="submit" class="btn btn--primary" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar ajustes' }}</button></div>
    </form>

    <form class="st__card" @submit.prevent="changePassword">
      <h2>Cambiar contraseña</h2>
      <div class="st__row">
        <div class="field"><label>Actual</label><input v-model="pw.current" type="password" autocomplete="current-password" required /></div>
        <div class="field"><label>Nueva (mín. 8)</label><input v-model="pw.next" type="password" autocomplete="new-password" minlength="8" required /></div>
      </div>
      <div><button type="submit" class="btn btn--ghost">Actualizar contraseña</button></div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.st {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 820px;
  h1 {
    font-size: 28px;
  }
  &__card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 22px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    h2 {
      font-size: 17px;
      margin-top: 6px;
    }
  }
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    > * {
      flex: 1 1 200px;
    }
  }
  &__check {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
