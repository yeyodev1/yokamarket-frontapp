export interface Category {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  note: string
  sortOrder: number
  active: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  category: { slug: string; name: string } | string
  priceCents: number
  unit: string
  shortDescription: string
  description: string
  ingredients: string
  badges: string[]
  kcal: number | null
  portion: string
  image: string
  images: string[]
  featured: boolean
  active: boolean
  sortOrder: number
}

export interface Catalog {
  categories: Category[]
  products: Product[]
}

export interface StoreSettings {
  storeName: string
  whatsapp: string
  email: string
  instagram: string
  city: string
  deliveryFeeCents: number
  freeDeliveryFromCents: number | null
  minOrderCents: number
  deliveryNote: string
  announcement: string
  acceptingOrders: boolean
}

export interface CartLine {
  productId: string
  qty: number
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'delivered'
  | 'failed'
  | 'cancelled'
  | 'review'

export interface OrderItem {
  name: string
  unit: string
  priceCents: number
  qty: number
  subtotalCents: number
}

export interface PublicOrder {
  code: string
  status: OrderStatus
  items: OrderItem[]
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
  customer: { name: string; phone: string; email: string }
  delivery: { address: string; city: string; sector: string; reference: string; notes: string }
  payment: {
    authorizationCode: string
    cardBrand: string
    lastDigits: string
    message: string
    confirmedAt: string | null
  }
  payUrl: string
  checkout: PayphoneCheckout | null
  paidAt: string | null
  createdAt: string
}

/** Lo que necesita la Cajita de Payphone para cobrar un pedido pendiente. */
export interface PayphoneCheckout {
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  amountWithTax: number
  tax: number
  storeId: string
  reference: string
  email: string
  phoneNumber: string
  documentId: string
}

export interface AdminOrder extends PublicOrder {
  id: string
  clientTransactionId: string
  customer: { name: string; phone: string; email: string; documentId: string }
  payment: PublicOrder['payment'] & {
    paymentId: number | null
    transactionId: number | null
    statusCode: number | null
    transactionStatus: string
    amountCents: number | null
  }
  attempts: number
  internalNotes: string
  updatedAt: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

export interface AdminStats {
  today: { count: number; totalCents: number }
  month: { count: number; totalCents: number }
  toPrepare: number
  inReview: number
  days: Array<{ date: string; count: number; totalCents: number }>
  topProducts: Array<{ name: string; qty: number; totalCents: number }>
  recent: AdminOrder[]
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin'
}

export interface CheckoutForm {
  name: string
  phone: string
  email: string
  documentId: string
  address: string
  city: string
  sector: string
  reference: string
  notes: string
}
