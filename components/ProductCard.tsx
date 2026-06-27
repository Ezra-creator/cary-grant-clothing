'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    addItem(
      product, 
      product.sizes?.[0] || 'M', 
      product.colors?.[0] || 'Default' 
    )
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(!wishlisted)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div 
      className="group relative bg-cgc-surface overflow-hidden cursor-none border border-[rgba(245,240,232,0.05)]"
      data-cursor-hover="true"
      style={{ 
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.1)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(245,240,232,0.05)'
      }}
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[3/4] bg-cgc-black">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ transition: 'transform 0.6s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-cinzel text-xs">No Image</div>
          )}

          {/* Badges */}
          {!product.inStock ? (
            <span className="absolute top-3 left-3 bg-[#252525] text-[#6e6358] font-cinzel text-[9px] px-[10px] py-[5px] uppercase tracking-[0.3em] z-10 pointer-events-none">
              Sold Out
            </span>
          ) : product.featured ? (
            <span className="absolute top-3 left-3 bg-[#c9a84c] text-[#0d0d0d] font-cinzel text-[9px] px-[10px] py-[5px] uppercase tracking-[0.3em] z-10 pointer-events-none">
              NEW
            </span>
          ) : null}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-[32px] h-[32px] rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 z-20"
            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <Heart size={14} fill={wishlisted ? '#c9a84c' : 'none'} className={wishlisted ? 'text-[#c9a84c]' : 'text-gray-400 hover:text-[#c9a84c] transition-colors'} />
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="absolute bottom-0 left-0 right-0 h-[44px] bg-[#c9a84c] text-[#0d0d0d] font-cinzel text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 z-20 hover:bg-[#e2c06e] disabled:bg-[#3a3530] disabled:text-[#6e6358]"
            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <ShoppingCart size={14} />
            {product.inStock ? 'Quick Add' : 'Sold Out'}
          </button>
        </div>

        {/* Info Area */}
        <div className="p-[16px]">
          <p className="font-cinzel text-[9px] text-[#6e6358] uppercase tracking-[0.3em]">
            {product.category}
          </p>
          <h3 className="font-cinzel text-[13px] text-[#f5f0e8] uppercase tracking-[0.1em] mt-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <p className="font-cinzel text-[16px] text-[#c9a84c] font-bold">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1.5">
                {product.sizes.slice(0, 3).map((size) => (
                  <span key={size} className="font-cinzel text-[8px] text-gray-400 uppercase bg-white/5 px-1.5 py-0.5 border border-white/10">
                    {size}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
