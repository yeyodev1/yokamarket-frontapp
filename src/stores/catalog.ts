import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { Category, Product, StoreSettings } from '@/types'

const defaultSettings: StoreSettings = {
  storeName: 'YOKA Market',
  whatsapp: '',
  email: '',
  instagram: 'https://www.instagram.com/yokamarket.ec/',
  city: '',
  deliveryFeeCents: 0,
  freeDeliveryFromCents: null,
  minOrderCents: 0,
  deliveryNote: '',
  announcement: '',
  acceptingOrders: true,
}

/** Catálogo público y ajustes de la tienda: se cargan una vez por visita. */
export const useCatalogStore = defineStore('catalog', () => {
  const categories = shallowRef<Category[]>([])
  const products = shallowRef<Product[]>([])
  const settings = shallowRef<StoreSettings>(defaultSettings)
  const loading = shallowRef(false)
  const error = shallowRef('')
  const loaded = shallowRef(false)

  const productsByCategory = computed(() => {
    const map = new Map<string, Product[]>()
    for (const c of categories.value) map.set(c.slug, [])
    for (const p of products.value) {
      const slug = typeof p.category === 'string' ? p.category : p.category.slug
      map.get(slug)?.push(p)
    }
    return map
  })

  const byId = computed(() => new Map(products.value.map((p) => [p.id, p])))
  const featured = computed(() => products.value.filter((p) => p.featured))

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = ''
    try {
      const [catalog, s] = await Promise.all([
        catalogService.getCatalog(),
        catalogService.getSettings().catch(() => defaultSettings),
      ])
      categories.value = catalog.categories
      products.value = catalog.products
      settings.value = s
      loaded.value = true
    } catch (e) {
      error.value = (e as { message?: string }).message || 'No pudimos cargar el catálogo'
    } finally {
      loading.value = false
    }
  }

  return { categories, products, settings, loading, error, loaded, productsByCategory, byId, featured, load }
})
