'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { db } from '@/lib/firebase'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import Link from 'next/link'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'products'), where('featured', '==', true), limit(4))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-cgc-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-cgc-surface animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-px bg-cgc-surface animate-pulse w-20 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-cgc-surface animate-pulse aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-24 bg-cgc-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="section-heading mb-4">Featured Drops</h2>
          <div className="gold-underline mb-12" />
          <p className="text-cgc-gray font-inter mb-8">New drops coming soon. Stay tuned.</p>
          <Link href="/shop" className="btn-primary">Browse All Products</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-cgc-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="section-heading">Featured Drops</h2>
          <div className="gold-underline mb-4" />
          <p className="text-cgc-gray font-inter mt-4">Hand-picked pieces from the CGC vault</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="btn-secondary">View All Products</Link>
        </div>
      </div>
    </section>
  )
}
