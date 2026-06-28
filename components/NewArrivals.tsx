'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import SwingTag from '@/components/ui/SwingTag';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const addCartItem = useCartStore((state) => state.addItem);

  // Drag to scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Scroll by buttons
  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Drag to scroll handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
    // Disable smooth scroll while dragging
    if (scrollRef.current) scrollRef.current.style.scrollBehavior = 'auto';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // Scroll speed multiplier
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handlePointerUpOrLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      // Restore smooth scroll
      scrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  // Wheel horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Only capture if deltaY is not 0 (meaning scrolling up/down on mouse)
      // and we want to scroll horizontally
      if (e.deltaY !== 0 && !e.shiftKey) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [loading]); // re-bind when content might have loaded

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addCartItem(
      product,
      product.sizes?.[0] || 'OS', // Default to first size or One Size
      product.colors?.[0] || 'Default'
    );
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-cgc-bone py-[100px] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <AnimatedSection direction="left" delay={0.2} className="flex flex-col">
            <span className="font-inter text-sm font-medium text-cgc-red mb-4">
              Just dropped
            </span>
            <h2 className="font-inter text-[48px] md:text-[72px] text-cgc-ink font-black leading-none">
              New arrivals
            </h2>
            <div className="w-[60px] h-[2px] bg-cgc-red mt-6" />
          </AnimatedSection>

          {/* Navigation Arrows */}
          <AnimatedSection direction="left" delay={0.4} className="flex gap-4">
            <button
              onClick={() => scrollByAmount(-320)}
              className="w-12 h-12 rounded-full border border-cgc-ink/20 flex items-center justify-center text-cgc-ink hover:bg-cgc-ink hover:text-white transition-colors duration-300 group"
              aria-label="Scroll left"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollByAmount(320)}
              className="w-12 h-12 rounded-full border border-cgc-ink/20 flex items-center justify-center text-cgc-ink hover:bg-cgc-ink hover:text-white transition-colors duration-300 group"
              aria-label="Scroll right"
            >
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimatedSection>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex flex-row overflow-x-auto hide-scrollbar gap-6 py-10 cursor-grab active:cursor-grabbing scroll-smooth"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          style={{ touchAction: 'pan-y' }}
        >
          {loading ? (
            // Skeleton Loader
            [...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[300px] bg-white rounded-cgc-lg overflow-hidden animate-pulse"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                <div className="w-full h-[360px] bg-gray-200" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="w-1/3 h-2 bg-gray-200" />
                  <div className="w-3/4 h-4 bg-gray-200" />
                  <div className="flex justify-between items-center mt-2">
                    <div className="w-1/4 h-4 bg-gray-200" />
                    <div className="w-1/4 h-3 bg-gray-200" />
                  </div>
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            // Empty State
            <div className="w-full py-20 flex flex-col items-center justify-center opacity-50">
              <Image src="/images/logo.jpg" alt="CGC" width={60} height={60} className="mb-4 grayscale" />
              <p className="font-inter text-sm text-cgc-ink">No new arrivals yet</p>
            </div>
          ) : (
            // Real Products
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group flex-shrink-0 w-[300px] bg-white rounded-cgc-lg overflow-hidden transition-all duration-400 ease-out hover:-translate-y-1"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'}
              >
                <Link href={`/product/${product.id}`} className="block h-full cursor-none" data-cursor-hover="true">
                  {/* Image Area */}
                  <div className="relative w-full h-[360px] overflow-hidden bg-gray-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.06]"
                        sizes="300px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-inter text-xs">No image</div>
                    )}

                    {/* NEW Badge */}
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                      <SwingTag variant="new">New</SwingTag>
                    </div>

                    {/* Wishlist Heart */}
                    <button
                      className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-cgc-red z-20"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.success('Added to wishlist'); }}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={16} />
                    </button>

                    {/* Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center">
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="w-full bg-cgc-red text-white py-3 rounded-cgc-md font-inter text-sm font-medium hover:bg-[#b8000d] transition-colors"
                      >
                        Quick add
                      </button>
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {product.sizes.map(size => (
                            <span key={size} className="text-xs text-white/80 font-inter">{size}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-5 flex flex-col justify-between h-[calc(100%-360px)]">
                    <div>
                      <p className="font-inter text-xs text-cgc-slate mb-1">
                        {product.category || "Collection"}
                      </p>
                      <h3 className="font-inter text-sm text-cgc-ink font-semibold line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <SwingTag variant="price">${product.price.toFixed(2)}</SwingTag>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg key={star} width="10" height="10" viewBox="0 0 24 24" fill="var(--cgc-red)" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
