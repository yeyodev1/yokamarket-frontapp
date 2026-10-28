<script setup lang="ts">
import { reactive, shallowRef } from 'vue'
import type { Category, Product } from '@/types'

const props = defineProps<{ product: Product | null; categories: Category[]; saving: boolean }>()
const emit = defineEmits<{ save: [body: Record<string, unknown>]; cancel: []; remove: [] }>()

const p = props.product
const form = reactive({
  name: p?.name || '',
  category: p ? (typeof p.category === 'string' ? p.category : p.category.slug) : props.categories[0]?.slug || '',
  price: p ? (p.priceCents / 100).toFixed(2) : '',
  unit: p?.unit || '',
  shortDescription: p?.shortDescription || '',
  description: p?.description || '',
  ingredients: p?.ingredients || '',
  badges: p?.badges.join(', ') || '',
  kcal: p?.kcal?.toString() || '',
  portion: p?.portion || '',
  image: p?.image || '',
  images: [...(p?.images || []), '', '', '', ''].slice(0, 4),
  featured: p?.featured ?? false,
  active: p?.active ?? true,
  sortOrder: p?.sortOrder ?? 0,
})
const error = shallowRef('')

function submit() {
  error.value = ''
  const price = Number(String(form.price).replace(',', '.'))
  if (!form.name.trim()) return (error.value = 'El nombre es obligatorio')
  if (!Number.isFinite(price) || price < 0) return (error.value = 'El precio no es válido')
  emit('save', {
    name: form.name,
    category: form.category,
    priceCents: Math.round(price * 100),
    unit: form.unit,
    shortDescription: form.shortDescription,
    description: form.description,
    ingredients: form.ingredients,
    badges: form.badges.split(',').map((b) => b.trim()).filter(Boolean),
    kcal: form.kcal === '' ? null : Number(form.kcal),
    portion: form.portion,
    image: form.image,
    images: form.images.map((i) => i.trim()).filter(Boolean),
    featured: form.featured,
    active: form.active,
    sortOrder: Number(form.sortOrder) || 0,
  })
}
</script>

<template>
  <form class="pf" @submit.prevent="submit">
    <h2>{{ product ? 'Editar producto' : 'Nuevo producto' }}</h2>
    <div class="pf__row">
      <div class="field pf__grow"><label>Nombre</label><input v-model="form.name" type="text" required /></div>
      <div class="field"><label>Precio (USD)</label><input v-model="form.price" type="text" inputmode="decimal" placeholder="6.75" required /></div>
    </div>
    <div class="pf__row">
      <div class="field"><label>Línea</label><select v-model="form.category"><option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.name }}</option></select></div>
      <div class="field pf__grow"><label>Presentación</label><input v-model="form.unit" type="text" placeholder="Pack de 4 unidades" /></div>
    </div>
    <div class="field"><label>Descripción corta</label><input v-model="form.shortDescription" type="text" /></div>
    <div class="field"><label>Descripción</label><textarea v-model="form.description" rows="3" /></div>
    <div class="field"><label>Ingredientes</label><input v-model="form.ingredients" type="text" /></div>
    <div class="pf__row">
      <div class="field pf__grow"><label>Etiquetas (separadas por coma)</label><input v-model="form.badges" type="text" placeholder="Sin azúcares añadidos, Sin gluten" /></div>
      <div class="field"><label>kcal</label><input v-model="form.kcal" type="number" min="0" /></div>
      <div class="field"><label>Porción</label><input v-model="form.portion" type="text" placeholder="225 g" /></div>
    </div>
    <div class="pf__photos">
      <div class="field">
        <label>Foto principal (enlace)</label>
        <div class="pf__photo-row">
          <input v-model="form.image" type="url" placeholder="https://…/foto.jpg" />
          <img v-if="form.image" :src="form.image" alt="" />
        </div>
        <span class="field__hint">Pega el enlace directo de la imagen (termina en .jpg o .png). Ideal 4:3 o cuadrada.</span>
      </div>
      <div class="field">
        <label>Fotos adicionales (galería)</label>
        <div v-for="(_, i) in form.images" :key="i" class="pf__photo-row">
          <input v-model="form.images[i]" type="url" :placeholder="`Foto ${i + 2}`" />
          <img v-if="form.images[i]" :src="form.images[i]" alt="" />
        </div>
      </div>
    </div>
    <div class="pf__row pf__checks">
      <label><input v-model="form.active" type="checkbox" /> Visible en la tienda</label>
      <label><input v-model="form.featured" type="checkbox" /> Favorito</label>
      <div class="field"><label>Orden</label><input v-model="form.sortOrder" type="number" /></div>
    </div>
    <p v-if="error" class="pf__error">{{ error }}</p>
    <div class="pf__actions">
      <button type="submit" class="btn btn--primary" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar' }}</button>
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">Cancelar</button>
      <button v-if="product" type="button" class="pf__delete" @click="emit('remove')"><i class="fa-solid fa-trash-can" /> Eliminar</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.pf {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border-radius: $radius;
  background: $white;
  box-shadow: $shadow;
  h2 {
    font-size: 20px;
  }
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    > * {
      flex: 1 1 140px;
    }
  }
  &__grow {
    flex: 3 1 240px !important;
  }
  &__photos {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: $radius-sm;
    background: $cream;
  }
  &__photo-row {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 6px;
    input {
      flex: 1;
    }
    img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 8px;
      flex: 0 0 48px;
    }
  }
  &__checks {
    align-items: flex-end;
    label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      min-height: 48px;
    }
  }
  &__error {
    color: $red;
    font-size: 14px;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
  &__delete {
    margin-left: auto;
    color: $red;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
