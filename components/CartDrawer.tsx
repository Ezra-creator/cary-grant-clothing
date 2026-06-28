'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import SwingTag from '@/components/ui/SwingTag'

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
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-cgc-paper border-l border-cgc-red/20 z-50 flex flex-col shadow-2xl md:rounded-l-cgc-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cgc-ink/5">
              <div className="flex items-center gap-3">
                <h2 className="font-inter text-lg font-semibold text-cgc-ink">Your cart</h2>
                {items.length > 0 && (
                  <span className="font-inter text-sm text-cgc-red">({items.length})</span>
                )}
              </div>
              <motion.button
                onClick={closeCart}
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="text-cgc-ink/60 hover:text-cgc-ink transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-b border-cgc-ink/5">
                <p className="font-inter text-sm text-cgc-slate mb-2">
                  {remaining === 0
                    ? '🎉 You have free shipping!'
                    : `Add $${remaining.toFixed(2)} more for free shipping`}
                </p>
                <div className="h-[4px] rounded-full bg-cgc-ink/10 w-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full bg-cgc-red rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5">
                  <ShoppingBag size={56} className="text-cgc-ink/10" />
                  <div className="text-center">
                    <p className="font-inter text-lg text-cgc-slate font-medium mb-1">Your cart is empty</p>
                    <p className="font-inter text-sm text-cgc-slate">Add something to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-secondary mt-2 px-8 py-3"
                  >
                    Continue shopping
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
                      className="flex gap-4 py-5 border-b border-cgc-ink/5"
                    >
                      {/* Image */}
                      <div className="w-[80px] h-[80px] flex-shrink-0 bg-cgc-bone overflow-hidden rounded-cgc-md">
                        {item.product.images?.[0] && (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-inter text-sm text-cgc-ink font-semibold leading-tight">{item.product.name}</h3>
                          <p className="font-inter text-xs text-cgc-slate mt-1">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <div className="mt-1">
                            <SwingTag variant="price">${item.product.price.toFixed(2)}</SwingTag>
                          </div>
                        </div>

                        {/* Qty + Remove */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-cgc-ink/10 rounded-cgc-md hover:border-cgc-red/40 transition-colors">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-cgc-ink/60 hover:text-cgc-ink transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-inter text-xs text-cgc-ink w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-cgc-ink/60 hover:text-cgc-ink transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            className="ml-auto font-inter text-xs text-cgc-slate hover:text-cgc-red transition-colors flex items-center gap-1"
                          >
                            <X size={14} /> Remove
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
              <div className="px-6 pb-6 pt-4 border-t border-cgc-ink/5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm font-medium text-cgc-slate">Subtotal</span>
                  <span className="font-inter text-lg text-cgc-ink font-bold">${subtotal.toFixed(2)} CAD</span>
                </div>
                <p className="font-inter text-xs text-cgc-slate">Taxes and shipping calculated at checkout</p>

                {/* CTA Buttons */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full gap-3 py-4 flex items-center justify-center"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-secondary w-full py-3 flex items-center justify-center"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
