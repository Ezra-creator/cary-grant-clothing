'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const collections = [
  { name: "MEN'S", subtitle: 'Hoodies, Tracksuits, Tees & More', slug: 'mens', color: 'from-[#c9a84c]/60' },
  { name: "WOMEN'S", subtitle: 'Dresses, Active Wear & More', slug: 'womens', color: 'from-purple-900/60' },
  { name: 'AFRICAN COLLECTION', subtitle: 'Heritage Meets Streetwear', slug: 'african', color: 'from-amber-900/60' },
  { name: 'ACTIVE WEAR', subtitle: 'Train in Style', slug: 'activewear', color: 'from-blue-900/60' },
  { name: 'KIDS', subtitle: 'CGC for the Next Generation', slug: 'kids', color: 'from-green-900/60' },
  { name: 'FOOTWEAR', subtitle: 'Step Different', slug: 'footwear', color: 'from-cgc-surface/80' },
]

export default function Collections() {
  return (
    <section className="py-24 bg-cgc-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading">Shop The Collections</h2>
          <div className="gold-underline" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative h-80 overflow-hidden cursor-pointer bg-cgc-surface">
              <Link href={`/shop?category=${col.slug}`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-t ${col.color} to-cgc-black/90 group-hover:opacity-80 transition-opacity duration-500`} />

                {/* CGC Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <img src="/images/logo.jpg" alt="" className="w-48 h-48 object-contain" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="font-cinzel text-2xl md:text-3xl text-[#f5f0e8] uppercase tracking-widest font-bold mb-3 group-hover:text-[#c9a84c] transition-colors duration-300">
                    {col.name}
                  </h3>
                  <div className="w-12 h-px bg-[#c9a84c] mb-3" />
                  <p className="text-cgc-gray-2 text-sm tracking-widest uppercase font-inter">{col.subtitle}</p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-4 font-cinzel text-[#c9a84c] text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore →
                  </motion.p>
                </div>

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#c9a84c] transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
