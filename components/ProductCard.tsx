'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import SwingTag from '@/components/ui/SwingTag'

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
      className="group relative bg-cgc-paper overflow-hidden cursor-none border border-cgc-ink/5 rounded-cgc-lg"
      data-cursor-hover="true"
      style={{ 
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(227,6,19,0.1)'
        e.currentTarget.style.borderColor = 'rgba(227,6,19,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(13,13,13,0.05)'
      }}
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[3/4] bg-cgc-bone">
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
            <div className="w-full h-full flex items-center justify-center text-cgc-slate font-inter text-xs">No image</div>
          )}

          {/* Badges */}
          {!product.inStock ? (
            <span className="absolute top-3 left-3 z-10 pointer-events-none">
              <SwingTag variant="sold-out">Sold out</SwingTag>
            </span>
          ) : product.featured ? (
            <span className="absolute top-3 left-3 z-10 pointer-events-none">
              <SwingTag variant="new">New</SwingTag>
            </span>
          ) : null}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-[32px] h-[32px] rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 z-20"
            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <Heart size={14} fill={wishlisted ? 'var(--cgc-red)' : 'none'} className={wishlisted ? 'text-[var(--cgc-red)]' : 'text-cgc-slate hover:text-[var(--cgc-red)] transition-colors'} />
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="absolute bottom-0 left-0 right-0 h-[44px] bg-[var(--cgc-red)] text-white font-inter text-sm font-medium flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 z-20 hover:bg-[#b91c1c] disabled:bg-cgc-ink/10 disabled:text-cgc-slate"
            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <ShoppingCart size={16} />
            {product.inStock ? 'Quick add' : 'Sold out'}
          </button>
        </div>

        {/* Info Area */}
        <div className="p-[16px]">
          <p className="font-inter text-xs text-cgc-slate capitalize">
            {product.category}
          </p>
          <h3 className="font-inter text-sm text-cgc-ink font-medium mt-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <SwingTag variant="price">${Number(product.price).toFixed(2)}</SwingTag>
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1.5">
                {product.sizes.slice(0, 3).map((size) => (
                  <span key={size} className="font-inter text-xs text-cgc-slate bg-cgc-ink/5 px-1.5 py-0.5 border border-cgc-ink/10 rounded">
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
