'use client'
import { useEffect, useState, useRef } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Heart, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SwingTag from '@/components/ui/SwingTag'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [shakeSize, setShakeSize] = useState(false)
  const [shakeColor, setShakeColor] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const { addItem } = useCartStore()
  const thumbnailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', params.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product
          setProduct(data)
          setSelectedSize(data.sizes?.[0] || '')
          setSelectedColor(data.colors?.[0] || '')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    let hasError = false
    if (!selectedSize && product.sizes?.length > 0) {
      setShakeSize(true)
      setTimeout(() => setShakeSize(false), 600)
      hasError = true
    }
    if (!selectedColor && product.colors?.length > 0) {
      setShakeColor(true)
      setTimeout(() => setShakeColor(false), 600)
      hasError = true
    }
    if (hasError) {
      toast.error('Please select your size and color')
      return
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }
    setAdded(true)
    toast.success(`${product.name} added to cart!`)
    setTimeout(() => setAdded(false), 2500)
  }

  const accordions = [
    { key: 'desc', label: 'Description', content: product?.description || '' },
    { key: 'ship', label: 'Shipping & returns', content: 'Free shipping on orders over $150 CAD. Standard delivery 3–7 business days across Canada. Easy returns within 30 days with receipt.' },
    { key: 'care', label: 'Care instructions', content: 'Machine wash cold with similar colours. Do not bleach. Tumble dry low. Iron on low heat if needed.' },
    { key: 'store', label: 'Also in-store', content: 'Available at our flagship store: 54 Dunlop St W, Barrie, ON L4N 1B2. Open Mon–Sat 10am–7pm, Sun 12pm–5pm.' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cgc-paper pt-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-80px)]">
          <div className="aspect-square bg-cgc-bone animate-pulse rounded-cgc-lg" />
          <div className="p-12 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-cgc-bone animate-pulse h-10 rounded-cgc-md" style={{ width: `${[60,40,80,55,70][i]}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cgc-paper pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-inter text-[32px] text-cgc-ink mb-4 font-semibold">404</p>
          <p className="font-inter text-cgc-slate mb-8">Product not found</p>
          <Link href="/shop" className="btn-primary inline-block">
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cgc-paper pt-20">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <nav className="flex items-center gap-2 font-inter text-sm font-medium">
          <Link href="/" className="text-cgc-slate hover:text-cgc-red transition-colors">Home</Link>
          <span className="text-cgc-slate">/</span>
          <Link href="/shop" className="text-cgc-slate hover:text-cgc-red transition-colors">Shop</Link>
          <span className="text-cgc-slate">/</span>
          <span className="text-cgc-slate hover:text-cgc-red transition-colors cursor-pointer capitalize">{product.category}</span>
          <span className="text-cgc-slate">/</span>
          <span className="text-cgc-ink truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT: Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square bg-cgc-bone overflow-hidden group rounded-cgc-lg border border-cgc-ink/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage] || '/images/logo.jpg'}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-[400ms]"
                />
              </AnimatePresence>
              {/* Image Counter */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-4 right-4 font-inter text-sm text-cgc-slate">
                  {selectedImage + 1}/{product.images.length}
                </div>
              )}
              {/* Prev/Next Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => Math.max(0, i - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cgc-ink/50 rounded-full flex items-center justify-center text-white hover:bg-[var(--cgc-red)] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => Math.min(product.images.length - 1, i + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cgc-ink/50 rounded-full flex items-center justify-center text-white hover:bg-[var(--cgc-red)] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images?.length > 1 && (
              <div ref={thumbnailRef} className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-[80px] h-[80px] overflow-hidden rounded-cgc-md transition-all duration-200 ${
                      selectedImage === i
                        ? 'border-2 border-[var(--cgc-red)]'
                        : 'border border-transparent hover:border-cgc-ink/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col gap-6">
            {/* Category + Stock badge */}
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm text-[var(--cgc-red)] font-medium capitalize">{product.category}</span>
              {product.inStock
                ? <SwingTag variant="new">In stock</SwingTag>
                : <SwingTag variant="sold-out">Sold out</SwingTag>
              }
            </div>

            {/* Name */}
            <h1 className="font-inter text-[36px] md:text-[44px] text-cgc-ink font-semibold leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <SwingTag variant="price">${product.price.toFixed(2)} CAD</SwingTag>
            </div>

            <div className="w-full h-[1px] bg-cgc-ink/10" />

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="font-inter text-sm font-medium text-cgc-slate mb-3">
                  Size: <span className="text-cgc-ink font-bold">{selectedSize}</span>
                </p>
                <motion.div
                  animate={shakeSize ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`font-inter text-sm font-medium w-[52px] h-[52px] rounded-cgc-md flex items-center justify-center border transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-[var(--cgc-ink)] border-[var(--cgc-ink)] text-white'
                          : 'border-cgc-ink/20 text-cgc-slate hover:border-cgc-ink/60 hover:text-cgc-ink'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="font-inter text-sm font-medium text-cgc-slate mb-3">
                  Color: <span className="text-cgc-ink font-bold">{selectedColor}</span>
                </p>
                <motion.div
                  animate={shakeColor ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`font-inter text-sm font-medium px-5 py-3 rounded-cgc-md border transition-all duration-200 ${
                        selectedColor === color
                          ? 'bg-[var(--cgc-ink)] border-[var(--cgc-ink)] text-white'
                          : 'border-cgc-ink/20 text-cgc-slate hover:border-cgc-ink/60 hover:text-cgc-ink'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 items-stretch mt-2">
              {/* Qty */}
              <div className="flex items-center border border-cgc-ink/20 rounded-cgc-md">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-cgc-ink hover:text-[var(--cgc-red)] transition-colors text-xl font-light"
                >
                  −
                </button>
                <span className="font-inter text-cgc-ink text-sm w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-full flex items-center justify-center text-cgc-ink hover:text-[var(--cgc-red)] transition-colors text-xl font-light"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 btn-primary gap-3 flex items-center justify-center rounded-cgc-md ${
                  added
                    ? '!bg-[#1f9254] !border-[#1f9254] !text-white'
                    : ''
                }`}
              >
                {added ? <><Check size={16} /> Added to cart</> : <><ShoppingCart size={16} /> {product.inStock ? 'Add to cart' : 'Sold out'}</>}
              </motion.button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlist(w => !w)}
                className="w-14 rounded-cgc-md border border-cgc-ink/20 hover:border-[var(--cgc-red)] flex items-center justify-center transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={18} className={wishlist ? 'text-[var(--cgc-red)] fill-[var(--cgc-red)]' : 'text-cgc-slate'} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-cgc-ink/10">
              <p className="text-cgc-slate text-[13px] font-inter flex items-center gap-2">🚚 Free shipping on orders over $150 CAD</p>
              <p className="text-cgc-slate text-[13px] font-inter flex items-center gap-2">🔄 Easy returns within 30 days</p>
              <p className="text-cgc-slate text-[13px] font-inter flex items-center gap-2">📍 Also in-store at 54 Dunlop St W, Barrie, ON</p>
            </div>

            {/* Accordions */}
            <div className="border-t border-cgc-ink/10 mt-2">
              {accordions.map(a => (
                <div key={a.key} className="border-b border-cgc-ink/10">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === a.key ? null : a.key)}
                    className="w-full flex items-center justify-between py-4 font-inter text-sm font-medium text-cgc-ink hover:text-[var(--cgc-red)] transition-colors"
                  >
                    {a.label}
                    <motion.span animate={{ rotate: openAccordion === a.key ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openAccordion === a.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <p className="text-cgc-slate font-inter text-[13px] leading-relaxed pb-5">{a.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-[20px] border-t border-cgc-ink/10 px-4 py-3 flex items-center justify-between max-w-full lg:hidden">
        <div>
          <p className="font-inter text-cgc-ink text-sm font-medium truncate max-w-[180px]">{product.name}</p>
          <SwingTag variant="price" className="mt-0.5">${product.price.toFixed(2)}</SwingTag>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="btn-primary px-8 py-3 rounded-cgc-md"
        >
          {product.inStock ? 'Add to cart' : 'Sold out'}
        </motion.button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}
