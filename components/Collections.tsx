'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const collections = [
  { name: "Men's", subtitle: 'Hoodies, tracksuits, tees & more', slug: 'mens', color: 'from-cgc-red/60' },
  { name: "Women's", subtitle: 'Dresses, active wear & more', slug: 'womens', color: 'from-purple-900/60' },
  { name: 'African collection', subtitle: 'Heritage meets streetwear', slug: 'african', color: 'from-amber-900/60' },
  { name: 'Active wear', subtitle: 'Train in style', slug: 'activewear', color: 'from-blue-900/60' },
  { name: 'Kids', subtitle: 'CGC for the next generation', slug: 'kids', color: 'from-green-900/60' },
  { name: 'Footwear', subtitle: 'Step different', slug: 'footwear', color: 'from-cgc-ink/80' },
]

export default function Collections() {
  return (
    <section className="py-24 bg-cgc-paper">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading">Shop the collections</h2>
          <div className="red-underline" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative h-80 overflow-hidden cursor-pointer bg-cgc-ink rounded-cgc-lg">
              <Link href={`/shop?category=${col.slug}`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-t ${col.color} to-cgc-ink/90 group-hover:opacity-80 transition-opacity duration-500`} />

                {/* CGC Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <img src="/images/logo.jpg" alt="" className="w-48 h-48 object-contain filter invert" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="font-inter text-2xl md:text-3xl text-white font-bold mb-3 group-hover:text-cgc-red transition-colors duration-300">
                    {col.name}
                  </h3>
                  <div className="w-12 h-px bg-cgc-red mb-3" />
                  <p className="text-cgc-slate text-sm font-inter">{col.subtitle}</p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-4 font-inter text-cgc-red text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore →
                  </motion.p>
                </div>

                {/* Red border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cgc-red transition-all duration-500 rounded-cgc-lg" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
