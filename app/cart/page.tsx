'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Minus, Plus, X, ShoppingBag, Tag } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const subtotal = total()
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal >= 150 ? 0 : 15
  const tax = (subtotal - discount) * 0.13
  const orderTotal = subtotal - discount + shipping + tax

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'CGC10') {
      setPromoApplied(true)
    } else {
      alert('Invalid promo code')
    }
  }

  return (
    <div className="min-h-screen bg-cgc-black pt-20">
      {/* Hero Banner */}
      <div className="relative h-[200px] bg-cgc-surface flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-cinzel text-[200px] font-black text-white/[0.03] leading-none select-none">CGC</span>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-cinzel text-[56px] text-white font-black uppercase leading-none">Your Cart</h1>
          <div className="w-[60px] h-[2px] bg-cgc-red mx-auto my-4" />
          <p className="font-cinzel text-[11px] text-cgc-gray-1 uppercase tracking-[0.3em]">
            {items.length} Item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px]">
            <ShoppingBag size={64} className="text-white/10 mb-6" />
            <p className="font-cinzel text-[24px] text-cgc-gray-1 uppercase tracking-widest mb-8">Your cart is empty</p>
            <Link href="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items Table */}
            <div className="lg:col-span-2">
              {/* Table Header (desktop) */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 pb-4 border-b border-white/10 font-cinzel text-[9px] uppercase tracking-[0.3em] text-gray-500">
                <span>Product</span>
                <span className="text-center">Size / Color</span>
                <span className="text-center">Price</span>
                <span className="text-center">Qty / Total</span>
                <span />
              </div>

              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    className="py-6 border-b border-white/5"
                  >
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 items-center">
                      {/* Image + Name */}
                      <div className="flex gap-4 items-center">
                        <div className="w-[80px] h-[80px] bg-cgc-surface flex-shrink-0 overflow-hidden">
                          {item.product.images?.[0]
                            ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            : <img src="/images/logo.jpg" alt="" className="w-full h-full object-contain p-2" />}
                        </div>
                        <div>
                          <h3 className="font-cinzel text-[11px] text-white uppercase tracking-[0.1em]">{item.product.name}</h3>
                          <p className="font-cinzel text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1">{item.product.category}</p>
                        </div>
                      </div>
                      {/* Size / Color */}
                      <p className="font-inter text-[11px] text-gray-400 text-center">{item.size} / {item.color}</p>
                      {/* Price */}
                      <p className="font-cinzel text-[14px] text-cgc-red font-black text-center">${item.product.price}</p>
                      {/* Qty + Subtotal */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center border border-white/15">
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <Minus size={11} />
                          </button>
                          <span className="font-cinzel text-[12px] text-white w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="font-cinzel text-[12px] text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {/* Remove */}
                      <button onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-cgc-gray-2 hover:text-cgc-red transition-colors flex items-center justify-center"
                        aria-label="Remove item">
                        <X size={16} />
                      </button>
                    </div>

                    {/* Mobile row */}
                    <div className="flex gap-4 md:hidden">
                      <div className="w-[80px] h-[80px] bg-cgc-surface flex-shrink-0 overflow-hidden">
                        {item.product.images?.[0]
                          ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          : <img src="/images/logo.jpg" alt="" className="w-full h-full object-contain p-2" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-cinzel text-[11px] text-white uppercase tracking-[0.1em] flex-1 pr-2">{item.product.name}</h3>
                          <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="text-cgc-gray-2 hover:text-cgc-red transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                        <p className="font-inter text-[11px] text-cgc-gray-2 mt-1">{item.size} / {item.color}</p>
                        <p className="font-cinzel text-cgc-red font-black mt-1">${item.product.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-white/15">
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">
                              <Minus size={11} />
                            </button>
                            <span className="font-cinzel text-[12px] text-white w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="ml-auto font-cinzel text-white text-[13px]">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-4">
                <button onClick={clearCart}
                  className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-cgc-gray-2 hover:text-cgc-red transition-colors">
                  Clear Cart
                </button>
                <Link href="/shop"
                  className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary — Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-cgc-sidebar-bg border border-white/5 p-6 sticky top-[100px]">
                <h3 className="font-cinzel text-[12px] uppercase tracking-[0.3em] text-white mb-6">Order Summary</h3>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cgc-gray-2" />
                    <input
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="form-input pl-9"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    disabled={promoApplied}
                    className="font-cinzel text-[10px] uppercase tracking-[0.3em] px-4 bg-white/5 border border-white/10 hover:border-white/30 text-white transition-colors disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>

                {promoApplied && (
                  <p className="font-cinzel text-[10px] text-green-400 uppercase tracking-[0.2em] mb-4">10% discount applied!</p>
                )}

                {/* Line items */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                    ...(promoApplied ? [{ label: 'Discount (10%)', value: `-$${discount.toFixed(2)}` }] : []),
                    { label: 'Shipping', value: shipping === 0 ? 'FREE 🎉' : `$${shipping.toFixed(2)}` },
                    { label: 'HST (13%)', value: `$${tax.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between font-cinzel text-[10px] uppercase tracking-[0.2em] text-gray-400">
                      <span>{label}</span>
                      <span className={label === 'Discount (10%)' ? 'text-green-400' : 'text-white'}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-cinzel uppercase tracking-[0.2em] border-t border-white/10 pt-4 mb-6">
                  <span className="text-[11px] text-white">Total</span>
                  <span className="text-[18px] text-cgc-red font-black">${orderTotal.toFixed(2)}</span>
                </div>

                {subtotal < 150 && (
                  <div className="mb-4">
                    <p className="font-cinzel text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2">
                      Add ${(150 - subtotal).toFixed(2)} more for free shipping
                    </p>
                    <div className="h-[2px] bg-white/10">
                      <div
                        className="h-full bg-cgc-red transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link href="/checkout"
                  className="btn-primary w-full">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
