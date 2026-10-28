<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToast } from '@/composables/useToast'
import { useCatalogStore } from '@/stores/catalog'
import ProductForm from '@/components/admin/ProductForm.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import CategoryEditor from '@/components/admin/CategoryEditor.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import { formatUsd } from '@/utils/money'
import type { Category, Product } from '@/types'

const toast = useToast()
const catalog = useCatalogStore()
const products = shallowRef<Product[]>([])
const categories = shallowRef<Category[]>([])
const loading = shallowRef(true)
const editing = shallowRef<Product | null | 'new'>(null)
const saving = shallowRef(false)

async function load() {
  loading.value = true
  try {
    ;[products.value, categories.value] = await Promise.all([adminService.products(), adminService.categories()])
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No pudimos cargar', 'error')
  } finally {
    loading.value = false
  }
}

async function save(body: Record<string, unknown>) {
  saving.value = true
  try {
    if (editing.value === 'new') await adminService.createProduct(body as never)
    else if (editing.value) await adminService.updateProduct(editing.value.id, body as never)
    toast.show('Producto guardado', 'ok')
    editing.value = null
    await load()
    catalog.load(true)
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo guardar', 'error')
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!editing.value || editing.value === 'new') return
  if (!window.confirm(`¿Eliminar "${editing.value.name}"? Si solo quieres ocultarlo, desmarca "Visible".`)) return
  try {
    await adminService.deleteProduct(editing.value.id)
    toast.show('Producto eliminado', 'ok')
    editing.value = null
    await load()
    catalog.load(true)
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo eliminar', 'error')
  }
}

async function toggleActive(p: Product) {
  try {
    await adminService.updateProduct(p.id, { active: !p.active })
    await load()
    catalog.load(true)
  } catch (e) {
    toast.show((e as { message?: string }).message || 'No se pudo cambiar', 'error')
  }
}

function catName(p: Product) {
  return typeof p.category === 'string' ? p.category : p.category.name
}

onMounted(load)
</script>

<template>
  <div class="ap">
    <header class="ap__head">
      <h1>Productos</h1>
      <button type="button" class="btn btn--yellow btn--sm" @click="editing = 'new'"><i class="fa-solid fa-plus" /> Nuevo</button>
    </header>

    <ProductForm
      v-if="editing"
      :key="editing === 'new' ? 'new' : editing.id"
      :product="editing === 'new' ? null : editing"
      :categories="categories"
      :saving="saving"
      @save="save"
      @cancel="editing = null"
      @remove="remove"
    />

    <LoadingBlock v-if="loading" />
    <ul v-else class="ap__list">
      <li v-for="p in products" :key="p.id" class="ap__item" :class="{ 'ap__item--off': !p.active }">
        <div class="ap__img"><ProductImage :product="p" /></div>
        <div class="ap__info">
          <strong>{{ p.name }}</strong>
          <span>{{ catName(p) }} · {{ p.unit }}</span>
        </div>
        <strong class="ap__price">{{ formatUsd(p.priceCents) }}</strong>
        <div class="ap__actions">
          <button type="button" class="btn btn--ghost btn--sm" @click="editing = p"><i class="fa-solid fa-pen" /> Editar</button>
          <button type="button" class="btn btn--ghost btn--sm" @click="toggleActive(p)">{{ p.active ? 'Ocultar' : 'Mostrar' }}</button>
        </div>
      </li>
    </ul>

    <CategoryEditor v-if="!loading" :categories="categories" @changed="load(); catalog.load(true)" />
  </div>
</template>

<style scoped lang="scss">
.ap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 28px;
    }
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
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 14px 10px 10px;
    border-radius: $radius;
    background: $white;
    box-shadow: $shadow-sm;
    &--off {
      opacity: 0.55;
    }
  }
  &__img {
    width: 56px;
    flex: 0 0 56px;
    :deep(.pimg) {
      aspect-ratio: 1;
      border-radius: $radius-sm;
    }
  }
  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    strong {
      font-family: $font-head;
    }
    span {
      font-size: 12px;
      color: $muted;
    }
  }
  &__price {
    font-family: $font-head;
  }
  &__actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
