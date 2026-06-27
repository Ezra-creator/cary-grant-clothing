'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Category } from '@/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm = { name: '', slug: '', description: '', image: '' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      const snap = await getDocs(collection(db, 'categories'))
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)))
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description, image: c.image }); setShowModal(true) }

  const handleSave = async () => {
    if (!form.name || !form.slug) return toast.error('Name and slug are required')
    setSaving(true)
    try {
      if (editing) {
        await updateDoc(doc(db, 'categories', editing.id), form)
        toast.success('Category updated!')
      } else {
        await addDoc(collection(db, 'categories'), { ...form, createdAt: serverTimestamp() })
        toast.success('Category added!')
      }
      setShowModal(false)
      fetchCategories()
    } catch {
      toast.error('Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"?`)) return
    try {
      await deleteDoc(doc(db, 'categories', cat.id))
      toast.success('Category deleted')
      fetchCategories()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-2xl text-cgc-white uppercase tracking-widest">Categories</h1>
          <p className="text-cgc-gray font-inter text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-xs">
          <Plus size={14} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-cgc-surface animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-cgc-surface border border-white/5 p-16 text-center">
          <p className="font-cinzel text-cgc-gray uppercase tracking-widest mb-4">No categories yet</p>
          <button onClick={openAdd} className="btn-primary text-xs">Add First Category</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-cgc-surface border border-white/5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-cinzel text-cgc-white uppercase tracking-widest text-sm">{cat.name}</p>
                  <p className="text-cgc-gray text-xs font-mono mt-1">/{cat.slug}</p>
                  {cat.description && <p className="text-cgc-gray text-xs font-inter mt-2">{cat.description}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => openEdit(cat)}
                    className="w-8 h-8 bg-white/5 hover:bg-cgc-red/20 flex items-center justify-center text-cgc-gray hover:text-cgc-red transition-all">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(cat)}
                    className="w-8 h-8 bg-white/5 hover:bg-red-900/30 flex items-center justify-center text-cgc-gray hover:text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-cgc-surface border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-cinzel text-cgc-white uppercase tracking-widest text-sm">
                {editing ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-cgc-gray hover:text-cgc-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'name', label: 'Category Name *', placeholder: 'e.g. Mens Collection' },
                { key: 'slug', label: 'Slug *', placeholder: 'e.g. mens' },
                { key: 'description', label: 'Description', placeholder: 'Short description...' },
                { key: 'image', label: 'Image URL', placeholder: 'https://...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="font-cinzel text-xs uppercase tracking-widest text-cgc-gray block mb-2">{field.label}</label>
                  <input type="text" value={form[field.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-cgc-black border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-white font-inter text-sm placeholder-cgc-gray/30 transition-colors" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 text-xs">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-xs disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
