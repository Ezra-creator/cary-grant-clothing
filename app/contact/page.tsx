'use client'
import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'messages'), { ...form, createdAt: serverTimestamp() })
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cgc-ink pt-20">
      <div className="bg-cgc-ink py-16 text-center border-b border-white/5">
        <p className="font-inter text-cgc-red tracking-[0.4em] text-xs mb-4">Reach Out</p>
        <h1 className="section-heading">Get In Touch</h1>
        <div className="red-underline" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-inter text-2xl text-cgc-paper mb-6">Visit Us</h2>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Address', value: '54 Dunlop Street West, Main Floor, Barrie, ON' },
                  { icon: Phone, label: 'Phone', value: '+1 705-717-1073' },
                  { icon: Mail, label: 'Email', value: 'cary@carygrantclothing.com' },
                  { icon: Clock, label: 'Hours', value: 'Mon-Sat: 10am-7pm | Sun: 11am-5pm' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-cgc-red/10 border border-cgc-red/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-cgc-red" />
                    </div>
                    <div>
                      <p className="font-inter text-xs text-cgc-slate mb-1">{label}</p>
                      <p className="text-cgc-paper font-inter text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-inter text-xs text-cgc-slate mb-4">Follow The Movement</h3>
              <div className="flex gap-4">
                {[
                  { label: 'Instagram', href: 'https://instagram.com/cgclthn' },
                  { label: 'Twitter', href: 'https://twitter.com/CG021' },
                  { label: 'Facebook', href: 'https://facebook.com/Cary-Grant-Clothing-19389221599' },
                  { label: 'TikTok', href: 'https://tiktok.com' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="font-inter text-xs text-cgc-slate hover:text-cgc-paper transition-colors border border-white/10 hover:border-cgc-red px-3 py-2">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-inter text-2xl text-cgc-paper mb-6">Send A Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'name', placeholder: 'Your Name', type: 'text' },
                { name: 'email', placeholder: 'Email Address', type: 'email' },
                { name: 'subject', placeholder: 'Subject', type: 'text' },
              ].map(field => (
                <input key={field.name} type={field.type} placeholder={field.placeholder} required
                  value={form[field.name as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                  className="form-input" />
              ))}
              <textarea rows={5} placeholder="Your message..." required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="form-input h-auto py-4 resize-none" />
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
