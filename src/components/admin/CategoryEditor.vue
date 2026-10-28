<script setup lang="ts">
import { reactive, shallowRef } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToast } from '@/composables/useToast'
import type { Category } from '@/types'

const props = defineProps<{ categories: Category[] }>()
const emit = defineEmits<{ changed: [] }>()
const toast = useToast()
const open = shallowRef<string | null>(null)
const saving = shallowRef(false)
const form = reactive({ name: '', tagline: '', description: '', note: '', sortOrder: 0, active: true })

function edit(c: Category) {
  open.value = c.id
  Object.assign(form, { name: c.name, tagline: c.tagline, description: c.description, note: c.note, sortOrder: c.sortOrder, active: c.active })
}

async function save() {
  if (!open.value) return
  saving.value = true
  try {
    await adminService.updateCategory(open.value, { ...form })
    toast.show('Línea guardada', 'ok')
    open.value = null
    emit('changed')
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo guardar', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="ce">
    <h2>Líneas de producto</h2>
    <ul class="ce__list">
      <li v-for="c in props.categories" :key="c.id" class="ce__item">
        <div class="ce__row">
          <div>
            <strong>{{ c.name }}</strong>
            <span>{{ c.tagline }}</span>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" @click="open === c.id ? (open = null) : edit(c)">
            <i class="fa-solid fa-pen" /> {{ open === c.id ? 'Cerrar' : 'Editar' }}
          </button>
        </div>
        <form v-if="open === c.id" class="ce__form" @submit.prevent="save">
          <div class="field"><label>Nombre</label><input v-model="form.name" type="text" required /></div>
          <div class="field"><label>Frase (se muestra como título de la sección)</label><input v-model="form.tagline" type="text" /></div>
          <div class="field"><label>Descripción</label><textarea v-model="form.description" rows="2" /></div>
          <div class="field"><label>Nota al pie (ej. presentación)</label><input v-model="form.note" type="text" /></div>
          <div class="ce__inline">
            <div class="field"><label>Orden</label><input v-model="form.sortOrder" type="number" /></div>
            <label class="ce__check"><input v-model="form.active" type="checkbox" /> Visible</label>
            <button type="submit" class="btn btn--primary btn--sm" :disabled="saving">Guardar</button>
          </div>
        </form>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.ce {
  display: flex;
  flex-direction: column;
  gap: 12px;
  h2 {
    font-size: 18px;
  }
  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__item {
    padding: 12px 14px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    div {
      display: flex;
      flex-direction: column;
      strong {
        font-family: $font-head;
      }
      span {
        font-size: 13px;
        color: $muted;
      }
    }
  }
  &__form {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid $line;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__inline {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 12px;
    .field {
      max-width: 100px;
    }
  }
  &__check {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    min-height: 48px;
  }
}
</style>
