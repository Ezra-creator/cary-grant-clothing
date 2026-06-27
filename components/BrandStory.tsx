'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const stats = [
  { value: 'EST.', number: '2002', label: 'Year Founded' },
  { value: '20+', number: '', label: 'Years in Business' },
  { value: '120+', number: '', label: 'Products' },
  { value: '🇨🇦', number: '', label: 'Proudly Canadian' },
]

export default function BrandStory() {
  return (
    <section className="py-24 bg-cgc-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative">
            <div className="relative h-[500px] md:h-[600px] overflow-hidden">
              <Image
                src="/images/logo.jpg"
                alt="Cary Grant Clothing Story"
                fill
                className="object-contain p-16 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cgc-surface/50 to-transparent" />
            </div>
            {/* Gold accent borders */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border-l-2 border-b-2 border-[#c9a84c] opacity-40" />
          </motion.div>

          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            <div>
              <p className="font-cinzel text-[#c9a84c] uppercase tracking-[0.4em] text-xs mb-4">Our Story</p>
              <h2 className="font-cinzel font-black text-3xl md:text-5xl text-cgc-white uppercase leading-tight">
                FROM A DUFFLE BAG TO OWNING THE BUILDING.
              </h2>
            </div>

            <div className="w-16 h-px bg-[#c9a84c]" />

            <div className="space-y-4 text-cgc-gray-2 font-inter leading-relaxed">
              <p>
                It started with a duffle bag outside Eaton Centre in Toronto. Selling CG t-shirts and hats while hustling mix-tapes at the same time. Then the trunk of a car in the Yorkgate Mall parking lot. Then a folding table.
              </p>
              <p>
                Cary Grant Clothing was built on hustle, heritage, and an unshakeable belief that style is a statement. The haters came, but so did the supporters — and the supporters won.
              </p>
              <p>
                Today, CGC sits at 54 Dunlop Street West, Barrie, Ontario — and we own the building. But the streets? The streets will always be home.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-cinzel text-[#c9a84c] font-bold text-xl md:text-2xl">
                    {stat.value}{stat.number}
                  </p>
                  <p className="text-cgc-gray-2 text-xs uppercase tracking-widest mt-1 font-inter">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-primary inline-block">
              Learn Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
