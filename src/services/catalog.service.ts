import { APIBase } from './httpBase'
import type { Catalog, Product, StoreSettings } from '@/types'

class CatalogService extends APIBase {
  getCatalog() {
    return this.get<Catalog>('/catalog')
  }
  getProduct(slug: string) {
    return this.get<Product>(`/catalog/products/${encodeURIComponent(slug)}`)
  }
  getSettings() {
    return this.get<StoreSettings>('/settings')
  }
}

export const catalogService = new CatalogService()
