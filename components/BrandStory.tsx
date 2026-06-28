'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const stats = [
  { value: 'EST.', number: '2002', label: 'Year founded' },
  { value: '20+', number: '', label: 'Years in business' },
  { value: '120+', number: '', label: 'Products' },
  { value: '🇨🇦', number: '', label: 'Proudly Canadian' },
]

export default function BrandStory() {
  return (
    <section className="py-24 bg-cgc-paper">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative">
            <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-cgc-xl">
              <Image
                src="/images/logo.jpg"
                alt="Cary Grant Clothing Story"
                fill
                className="object-contain p-16 opacity-80 filter invert"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cgc-paper/50 to-transparent" />
            </div>
            {/* Red accent borders */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border-l-2 border-b-2 border-cgc-red opacity-40 rounded-cgc-xl" />
          </motion.div>

          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            <div>
              <p className="font-inter text-cgc-red text-sm font-medium mb-4">Our story</p>
              <h2 className="font-inter font-black text-3xl md:text-5xl text-cgc-ink leading-tight">
                From a duffle bag to owning the building.
              </h2>
            </div>

            <div className="w-16 h-px bg-cgc-red" />

            <div className="space-y-4 text-cgc-slate font-inter leading-relaxed">
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
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-cgc-ink/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-inter text-cgc-red font-bold text-xl md:text-2xl">
                    {stat.value}{stat.number}
                  </p>
                  <p className="text-cgc-slate text-xs mt-1 font-inter">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-primary inline-block">
              Learn our story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
