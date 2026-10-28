import { APIBase } from './httpBase'
import type {
  AdminOrder,
  AdminStats,
  AuthUser,
  Category,
  OrderStatus,
  Paginated,
  Product,
  StoreSettings,
} from '@/types'

class AdminService extends APIBase {
  login(email: string, password: string) {
    return this.post<{ token: string; user: AuthUser }>('/auth/login', { email, password })
  }
  me() {
    return this.get<AuthUser>('/auth/me')
  }
  changePassword(currentPassword: string, newPassword: string) {
    return this.post<{ ok: true }>('/auth/change-password', { currentPassword, newPassword })
  }

  stats() {
    return this.get<AdminStats>('/admin/stats')
  }
  orders(params: { status?: string; q?: string; page?: number }) {
    return this.get<Paginated<AdminOrder>>('/admin/orders', { params })
  }
  order(id: string) {
    return this.get<AdminOrder>(`/admin/orders/${id}`)
  }
  setOrderStatus(id: string, status: OrderStatus) {
    return this.patch<AdminOrder>(`/admin/orders/${id}/status`, { status })
  }
  setOrderNotes(id: string, internalNotes: string) {
    return this.patch<AdminOrder>(`/admin/orders/${id}/notes`, { internalNotes })
  }

  products() {
    return this.get<Product[]>('/admin/products')
  }
  createProduct(body: Partial<Product> & { category: string }) {
    return this.post<Product>('/admin/products', body)
  }
  updateProduct(id: string, body: Partial<Product> & { category?: string }) {
    return this.patch<Product>(`/admin/products/${id}`, body)
  }
  deleteProduct(id: string) {
    return this.delete<void>(`/admin/products/${id}`)
  }

  categories() {
    return this.get<Category[]>('/admin/categories')
  }
  updateCategory(id: string, body: Partial<Category>) {
    return this.patch<Category>(`/admin/categories/${id}`, body)
  }
  createCategory(body: Partial<Category>) {
    return this.post<Category>('/admin/categories', body)
  }
  deleteCategory(id: string) {
    return this.delete<void>(`/admin/categories/${id}`)
  }

  uploadStatus() {
    return this.get<{ enabled: boolean }>('/admin/uploads/status')
  }
  uploadImage(file: File) {
    const form = new FormData()
    form.append('file', file)
    return this.post<{ url: string; publicId: string }>('/admin/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })
  }

  updateSettings(body: Partial<StoreSettings>) {
    return this.patch<StoreSettings>('/admin/settings', body)
  }
}

export const adminService = new AdminService()
