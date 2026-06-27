'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

const FREE_SHIPPING_THRESHOLD = 150

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const subtotal = total()
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-[#0f0e0c] border-l border-[rgba(201,168,76,0.15)] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
              <div className="flex items-center gap-3">
                <h2 className="font-cinzel text-[14px] uppercase tracking-[0.3em] text-[#f5f0e8]">Your Cart</h2>
                {items.length > 0 && (
                  <span className="font-cinzel text-[11px] text-[#c9a84c] tracking-[0.1em]">({items.length})</span>
                )}
              </div>
              <motion.button
                onClick={closeCart}
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="text-[#6e6358] hover:text-[#f5f0e8] transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-b border-[rgba(245,240,232,0.05)]">
                <p className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#6e6358] mb-2">
                  {remaining === 0
                    ? '🎉 You have free shipping!'
                    : `Add $${remaining.toFixed(2)} more for free shipping`}
                </p>
                <div className="h-[2px] bg-white/10 w-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full bg-[#c9a84c]"
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5">
                  <ShoppingBag size={56} className="text-white/10" />
                  <div className="text-center">
                    <p className="font-cinzel text-[14px] text-[#6e6358] uppercase tracking-widest mb-1">Your cart is empty</p>
                    <p className="font-inter text-[12px] text-[#6e6358]">Add something to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-secondary mt-2 px-8 py-3"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 py-5 border-b border-[rgba(245,240,232,0.05)]"
                    >
                      {/* Image */}
                      <div className="w-[80px] h-[80px] flex-shrink-0 bg-cgc-black overflow-hidden">
                        {item.product.images?.[0] && (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-cinzel text-[11px] text-[#f5f0e8] uppercase tracking-[0.1em] leading-tight">{item.product.name}</h3>
                          <p className="font-inter text-[11px] text-[#6e6358] mt-1">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="font-cinzel text-[14px] text-[#c9a84c] font-black mt-1">${item.product.price}</p>
                        </div>

                        {/* Qty + Remove */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-[rgba(245,240,232,0.1)] hover:border-[rgba(201,168,76,0.4)] transition-colors">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#6e6358] hover:text-[#f5f0e8] transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-cinzel text-[12px] text-[#f5f0e8] w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#6e6358] hover:text-[#f5f0e8] transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            className="ml-auto font-cinzel text-[9px] uppercase tracking-[0.3em] text-[#6e6358] hover:text-[#c9a84c] transition-colors flex items-center gap-1"
                          >
                            <X size={11} /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 pb-6 pt-4 border-t border-[rgba(245,240,232,0.05)] space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#6e6358]">Subtotal</span>
                  <span className="font-cinzel text-[16px] text-[#f5f0e8] font-black">${subtotal.toFixed(2)} CAD</span>
                </div>
                <p className="font-inter text-[11px] text-[#6e6358]">Taxes and shipping calculated at checkout</p>

                {/* CTA Buttons */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full gap-3 py-4"
                >
                  Checkout <ArrowRight size={14} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-secondary w-full py-3"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
