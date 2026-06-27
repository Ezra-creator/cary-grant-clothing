'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const TESTIMONIALS = [
  {
    quote: "CGC is not just clothing — it's a statement. I wore the eagle hoodie to an event and got compliments all night. Real quality.",
    name: "Marcus T.",
    location: "Toronto, ON"
  },
  {
    quote: "Finally a Canadian brand that actually hits different. The quality is insane for the price. Been rocking CGC for years.",
    name: "Aisha M.",
    location: "Barrie, ON"
  },
  {
    quote: "I bought the African print collection and people literally stopped me on the street asking where I got it. Priceless.",
    name: "Kwame A.",
    location: "Mississauga, ON"
  },
  {
    quote: "The tracksuits are next level. Comfortable, stylish and you can tell it's premium from the moment you touch the fabric.",
    name: "Jordan R.",
    location: "Ottawa, ON"
  },
  {
    quote: "CGC has been my go-to brand for years. They never miss. The customer service is also top tier.",
    name: "Natalie C.",
    location: "Hamilton, ON"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered]);

  const visibleTestimonials = Array.from({ length: itemsPerPage }).map(
    (_, i) => TESTIMONIALS[(currentIndex + i) % TESTIMONIALS.length]
  );

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <section
      ref={containerRef}
      className="relative bg-cgc-testimonials-bg py-[100px] overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="font-cinzel text-[300px] font-black text-white/5 leading-none select-none">
          CGC
        </span>
      </div>
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.06) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center">
        
        {/* Header */}
        <AnimatedSection direction="up" delay={0.2} className="flex flex-col items-center text-center mb-16">
          <span className="font-cinzel text-[10px] text-[#c9a84c] uppercase tracking-[0.5em] mb-4">
            Community
          </span>
          <h2 className="font-cinzel text-[40px] md:text-[64px] text-white font-black leading-none uppercase">
            What They&apos;re Saying
          </h2>
          <div className="w-[60px] h-[2px] bg-[#c9a84c] mt-6" />
        </AnimatedSection>

        {/* Carousel */}
        <div 
          className="w-full relative min-h-[340px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className={`grid gap-6 ${
                itemsPerPage === 1 ? 'grid-cols-1' : itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}
            >
              {visibleTestimonials.map((t, idx) => (
                <div 
                  key={`${currentIndex}-${idx}`} 
                  className="bg-cgc-surface-2 p-8 flex flex-col justify-between h-full transition-all duration-300 group"
                  style={{ 
                    borderTop: '3px solid #c9a84c',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderTopColor = '#e2c06e';
                    e.currentTarget.style.boxShadow = '0 -4px 20px rgba(201, 168, 76, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderTopColor = '#c9a84c';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div className="font-cinzel text-[60px] text-[#c9a84c]/30 leading-[0] mb-[-10px] mt-4">
                      &ldquo;
                    </div>
                    <p className="font-inter text-[15px] text-white/80 italic leading-[1.8]">
                      {t.quote}
                    </p>
                    <div className="w-[40px] h-[1px] bg-[#c9a84c] my-6" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cgc-surface" />
                      <div className="flex flex-col">
                        <span className="font-cinzel text-[12px] text-white uppercase">{t.name}</span>
                        <span className="font-inter text-[11px] text-cgc-gray-1">{t.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#c9a84c] text-[#c9a84c]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center mt-12 gap-6"
        >
          {/* Arrows */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-[#c9a84c]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
