export interface Product {
  id: string
  name: string
  price: number
  category: string
  gender: 'mens' | 'womens' | 'kids' | 'unisex'
  description: string
  sizes: string[]
  colors: string[]
  images: string[]
  inStock: boolean
  featured: boolean
  createdAt: Date
}

export interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  paymentStatus: 'paid' | 'unpaid' | 'refunded'
  createdAt: Date
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
}

export interface AdminUser {
  uid: string
  email: string
  role: 'admin'
}

export interface Newsletter {
  id: string
  email: string
  createdAt: Date
}
