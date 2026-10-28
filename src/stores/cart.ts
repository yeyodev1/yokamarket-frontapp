import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import type { CartLine } from '@/types'
import { useCatalogStore } from './catalog'

const STORAGE_KEY = 'yoka_cart_v1'

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : []
    return Array.isArray(parsed) ? parsed.filter((l) => l?.productId && l.qty > 0) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartLine[]>(readStorage())
  const open = shallowRef(false)
  const catalog = useCatalogStore()

  watch(
    lines,
    (v) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
      } catch {
        /* modo privado */
      }
    },
    { deep: true }
  )

  /** Líneas con su producto resuelto; las que ya no existen en el catálogo se ignoran. */
  const items = computed(() =>
    lines.value
      .map((l) => ({ ...l, product: catalog.byId.get(l.productId) }))
      .filter((l) => l.product && l.product.active)
      .map((l) => ({ ...l, product: l.product!, subtotalCents: l.product!.priceCents * l.qty }))
  )

  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotalCents = computed(() => items.value.reduce((s, i) => s + i.subtotalCents, 0))
  const deliveryFeeCents = computed(() => {
    const s = catalog.settings
    if (s.freeDeliveryFromCents != null && subtotalCents.value >= s.freeDeliveryFromCents) return 0
    return s.deliveryFeeCents
  })
  const totalCents = computed(() => subtotalCents.value + deliveryFeeCents.value)
  const isEmpty = computed(() => items.value.length === 0)

  function qtyOf(productId: string): number {
    return lines.value.find((l) => l.productId === productId)?.qty || 0
  }

  function add(productId: string, qty = 1) {
    const line = lines.value.find((l) => l.productId === productId)
    if (line) line.qty = Math.min(99, line.qty + qty)
    else lines.value.push({ productId, qty })
  }

  function setQty(productId: string, qty: number) {
    const idx = lines.value.findIndex((l) => l.productId === productId)
    if (qty <= 0) {
      if (idx >= 0) lines.value.splice(idx, 1)
      return
    }
    if (idx >= 0) lines.value[idx]!.qty = Math.min(99, qty)
    else lines.value.push({ productId, qty: Math.min(99, qty) })
  }

  function remove(productId: string) {
    setQty(productId, 0)
  }

  function clear() {
    lines.value = []
  }

  return {
    lines,
    open,
    items,
    count,
    subtotalCents,
    deliveryFeeCents,
    totalCents,
    isEmpty,
    qtyOf,
    add,
    setQty,
    remove,
    clear,
  }
})
