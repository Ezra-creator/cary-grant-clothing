'use client'
import { useEffect, useState, useRef } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Heart, ChevronDown, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'

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
    { key: 'ship', label: 'Shipping & Returns', content: 'Free shipping on orders over $150 CAD. Standard delivery 3–7 business days across Canada. Easy returns within 30 days with receipt.' },
    { key: 'care', label: 'Care Instructions', content: 'Machine wash cold with similar colours. Do not bleach. Tumble dry low. Iron on low heat if needed.' },
    { key: 'store', label: 'Also In-Store', content: 'Available at our flagship store: 54 Dunlop St W, Barrie, ON L4N 1B2. Open Mon–Sat 10am–7pm, Sun 12pm–5pm.' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cgc-black pt-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-80px)]">
          <div className="aspect-square bg-cgc-surface animate-pulse" />
          <div className="p-12 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-cgc-surface animate-pulse h-10 rounded" style={{ width: `${[60,40,80,55,70][i]}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cgc-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-[32px] text-[#f5f0e8] uppercase tracking-widest mb-4">404</p>
          <p className="font-cinzel text-[#6e6358] uppercase tracking-widest mb-8">Product not found</p>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cgc-black pt-20">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <nav className="flex items-center gap-2 font-cinzel text-[9px] uppercase tracking-[0.3em]">
          <Link href="/" className="text-[#6e6358] hover:text-[#c9a84c] transition-colors">Home</Link>
          <span className="text-gray-600">/</span>
          <Link href="/shop" className="text-[#6e6358] hover:text-[#c9a84c] transition-colors">Shop</Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#6e6358] hover:text-[#c9a84c] transition-colors cursor-pointer">{product.category}</span>
          <span className="text-gray-600">/</span>
          <span className="text-[#f5f0e8] truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT: Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square bg-cgc-surface overflow-hidden group">
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
                <div className="absolute bottom-4 right-4 font-cinzel text-[10px] text-gray-400 tracking-[0.2em]">
                  {selectedImage + 1}/{product.images.length}
                </div>
              )}
              {/* Prev/Next Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => Math.max(0, i - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center text-white hover:bg-[#c9a84c] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => Math.min(product.images.length - 1, i + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center text-white hover:bg-[#c9a84c] transition-colors opacity-0 group-hover:opacity-100"
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
                    className={`flex-shrink-0 w-[80px] h-[80px] overflow-hidden transition-all duration-200 ${
                      selectedImage === i
                        ? 'border-2 border-[#c9a84c]'
                        : 'border border-transparent hover:border-[rgba(245,240,232,0.3)]'
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
              <span className="font-cinzel text-[10px] text-[#c9a84c] uppercase tracking-[0.5em]">{product.category}</span>
              <span className={`font-cinzel text-[9px] uppercase tracking-[0.3em] px-3 py-1 ${product.inStock ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                {product.inStock ? 'In Stock' : 'Sold Out'}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-cinzel text-[36px] md:text-[44px] text-[#f5f0e8] uppercase leading-tight tracking-wide">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="font-cinzel text-[32px] text-[#c9a84c] font-black">${product.price}</span>
              <span className="font-cinzel text-[11px] text-[#6e6358] uppercase tracking-[0.2em]">CAD</span>
            </div>

            <div className="w-[60px] h-[1px] bg-[#c9a84c]" />

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#6e6358] mb-3">
                  Size: <span className="text-[#f5f0e8]">{selectedSize}</span>
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
                      className={`font-cinzel text-[10px] uppercase tracking-[0.2em] w-[52px] h-[52px] flex items-center justify-center border transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0d0d0d]'
                          : 'border-[rgba(245,240,232,0.2)] text-[#6e6358] hover:border-[rgba(245,240,232,0.6)] hover:text-[#f5f0e8]'
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
                <p className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#6e6358] mb-3">
                  Color: <span className="text-[#f5f0e8]">{selectedColor}</span>
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
                      className={`font-cinzel text-[10px] uppercase tracking-[0.2em] px-5 py-3 border transition-all duration-200 ${
                        selectedColor === color
                          ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0d0d0d]'
                          : 'border-[rgba(245,240,232,0.2)] text-[#6e6358] hover:border-[rgba(245,240,232,0.6)] hover:text-[#f5f0e8]'
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
              <div className="flex items-center border border-[rgba(245,240,232,0.2)]">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-[#f5f0e8] hover:text-[#c9a84c] transition-colors text-xl font-light"
                >
                  −
                </button>
                <span className="font-cinzel text-[#f5f0e8] text-sm w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-full flex items-center justify-center text-[#f5f0e8] hover:text-[#c9a84c] transition-colors text-xl font-light"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 btn-primary gap-3 ${
                  added
                    ? '!bg-green-800 !border-green-700 !text-white'
                    : ''
                }`}
              >
                {added ? <><Check size={15} /> Added to Cart</> : <><ShoppingCart size={15} /> {product.inStock ? 'Add to Cart' : 'Sold Out'}</>}
              </motion.button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlist(w => !w)}
                className="w-14 border border-[rgba(245,240,232,0.2)] hover:border-[#c9a84c] flex items-center justify-center transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={18} className={wishlist ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-[#6e6358]'} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <p className="text-gray-500 text-[11px] font-inter flex items-center gap-2">🚚 Free shipping on orders over $150 CAD</p>
              <p className="text-gray-500 text-[11px] font-inter flex items-center gap-2">🔄 Easy returns within 30 days</p>
              <p className="text-gray-500 text-[11px] font-inter flex items-center gap-2">📍 Also in-store at 54 Dunlop St W, Barrie, ON</p>
            </div>

            {/* Accordions */}
            <div className="border-t border-white/10 mt-2">
              {accordions.map(a => (
                <div key={a.key} className="border-b border-white/10">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === a.key ? null : a.key)}
                    className="w-full flex items-center justify-between py-4 font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#f5f0e8] hover:text-[#c9a84c] transition-colors"
                  >
                    {a.label}
                    <motion.span animate={{ rotate: openAccordion === a.key ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown size={14} />
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
                        <p className="text-[#6e6358] font-inter text-[13px] leading-relaxed pb-5">{a.content}</p>
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/97 backdrop-blur-[20px] border-t border-[rgba(201,168,76,0.1)] px-4 py-3 flex items-center justify-between max-w-full lg:hidden">
        <div>
          <p className="font-cinzel text-[#f5f0e8] text-[12px] uppercase tracking-wide truncate max-w-[180px]">{product.name}</p>
          <p className="font-cinzel text-[#c9a84c] text-[14px] font-black">${product.price}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="btn-primary px-8 py-3"
        >
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </motion.button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}
