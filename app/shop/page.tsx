'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

const categories = ['ALL', "MEN'S", "WOMEN'S", 'AFRICAN', 'ACTIVEWEAR', 'KIDS', 'FOOTWEAR']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const mapParamToCategory = (param: string | null) => {
    if (!param) return 'ALL'
    const match = categories.find(c => c.replace(/[^A-Z]/gi, '').toLowerCase() === param.replace(/[^A-Z]/gi, '').toLowerCase())
    return match || 'ALL'
  }

  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(mapParamToCategory(categoryParam))
  const [selectedSize, setSelectedSize] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]
    if (selectedCategory !== 'ALL') {
      const normalizedSelected = selectedCategory.replace(/[^A-Z]/gi, '').toLowerCase()
      result = result.filter(p => p.category.replace(/[^A-Z]/gi, '').toLowerCase() === normalizedSelected)
    }
    if (selectedSize) {
      result = result.filter(p => p.sizes && p.sizes.includes(selectedSize))
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'featured') result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    setFiltered(result)
  }, [selectedCategory, selectedSize, sortBy, products])

  return (
    <div className="min-h-screen bg-cgc-paper pt-20">
      
      {/* Hero Banner */}
      <div className="relative h-[280px] bg-cgc-bone overflow-hidden flex flex-col items-center justify-center">
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url(/images/noise.png)', backgroundRepeat: 'repeat' }} />
        
        {/* CGC Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="font-inter text-[300px] font-black text-cgc-ink/[0.04] leading-none select-none">
            CGC
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="font-inter text-sm font-medium text-cgc-slate mb-4">
            <span className="hover:text-cgc-ink cursor-pointer transition-colors" onClick={() => window.location.href='/'}>Home</span> / Shop
          </p>
          <h1 className="h1 text-[72px] text-cgc-ink leading-none">
            Shop all
          </h1>
          <div className="w-[60px] h-[2px] bg-cgc-red my-6" />
          <p className="font-inter text-sm text-cgc-slate">
            {filtered.length} products
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[80px] z-30 bg-cgc-paper/95 backdrop-blur-[20px] border-b border-cgc-ink/5 h-[64px] w-full">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-4 md:px-8 gap-4">
          
          {/* Category Pills (Left) */}
          <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center gap-2 pr-4 min-w-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-inter text-sm capitalize rounded-cgc-md px-[20px] py-[8px] whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-cgc-red border-cgc-red text-white'
                    : 'bg-transparent border border-cgc-ink/[0.15] text-cgc-ink/50 hover:border-cgc-ink/40'
                }`}
              >
                {cat.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Sort & Filter (Right) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-cgc-paper border border-cgc-ink/[0.15] text-cgc-ink/80 font-inter text-sm rounded-cgc-md px-4 py-2 outline-none focus:border-cgc-red transition-colors cursor-pointer appearance-none pr-8 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230d0d0d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '8px auto' }}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="featured">Featured</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-transparent border border-cgc-ink/[0.15] text-cgc-ink/50 font-inter text-sm rounded-cgc-md px-[20px] py-[8px] hover:border-cgc-ink/40 transition-all duration-200"
            >
              Filter <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Size Filter Row */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden bg-cgc-bone border-b border-cgc-ink/5"
          >
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="font-inter text-sm text-gray-400 font-medium">
                  Size:
                </span>
                <div className="flex gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`font-inter text-sm rounded-cgc-md px-[20px] py-[8px] transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-cgc-red border-cgc-red text-white'
                          : 'bg-transparent border border-cgc-ink/[0.15] text-cgc-ink/50 hover:border-cgc-ink/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedSize || selectedCategory !== 'ALL') && (
                <button
                  onClick={() => { setSelectedSize(''); setSelectedCategory('ALL') }}
                  className="font-inter text-sm text-cgc-red font-medium hover:text-cgc-ink transition-colors flex items-center gap-1"
                >
                  <X size={14} /> Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-[48px] pb-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cgc-bone overflow-hidden relative rounded-cgc-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cgc-ink/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px]">
            <div className="w-[100px] h-[100px] opacity-10 mb-6 grayscale filter invert">
              <img src="/images/logo.jpg" alt="CGC" className="w-full h-full object-contain" />
            </div>
            <h2 className="font-inter text-2xl text-cgc-slate font-medium mb-6">
              No products found
            </h2>
            <button
              onClick={() => { setSelectedSize(''); setSelectedCategory('ALL') }}
              className="btn-primary inline-block"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify({ selectedCategory, selectedSize, sortBy })}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cgc-paper pt-20 flex items-center justify-center">
        <p className="font-inter text-cgc-slate text-sm font-medium">Loading...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
