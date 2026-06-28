'use client'
import React, { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query
} from 'firebase/firestore'
import { Product } from '@/types'
import { Plus, Pencil, Trash2, X, Upload, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImageToSupabase } from '@/lib/supabase'
import SwingTag from '@/components/ui/SwingTag'

const emptyForm = {
  name: '', price: '', category: 'Mens', gender: 'mens',
  description: '', sizes: [] as string[], colors: [] as string[],
  inStock: true, featured: false, images: [] as string[],
}

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const categories = ['Mens', 'Womens', 'African', 'Activewear', 'Kids', 'Footwear', 'Accessories']
const genders = ['mens', 'womens', 'kids', 'unisex']

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [colorInput, setColorInput] = useState('')

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
    } catch (err) {
      console.error(err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setColorInput('')
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, price: String(p.price), category: p.category,
      gender: p.gender, description: p.description, sizes: p.sizes,
      colors: p.colors, inStock: p.inStock, featured: p.featured, images: p.images,
    })
    setColorInput('')
    setShowModal(true)
  }

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return
    setUploading(true)
    const uploaded: string[] = []
    const fileArray = Array.from(files)
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      
      // Validate that the file is an image
      if (!file.type.startsWith('image/')) {
        console.error('File is not an image:', file.name, file.type)
        toast.error(`${file.name} is not a valid image file`)
        continue
      }
      
      try {
        const url = await uploadImageToSupabase(file)
        uploaded.push(url)
        setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100))
      } catch (err) {
        console.error('Upload failed for file:', file.name, err)
        toast.error(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
    
    setForm(prev => ({ ...prev, images: [...prev.images, ...uploaded] }))
    setUploading(false)
    setUploadProgress(0)
    toast.success(`${uploaded.length} image(s) uploaded!`)
  }

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const toggleSize = (size: string) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
    }))
  }

  const addColor = () => {
    const c = colorInput.trim()
    if (c && !form.colors.includes(c)) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, c] }))
    }
    setColorInput('')
  }

  const removeColor = (color: string) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))
  }

  const handleSave = async () => {
    if (!form.name || !form.price) return toast.error('Name and price are required')
    setSaving(true)
    try {
      const data = {
        name: form.name.trim(),
        price: parseFloat(form.price) || 0,
        category: form.category || 'Mens',
        gender: form.gender || 'mens',
        description: form.description ? form.description.trim() : '',
        sizes: form.sizes?.filter(x => !!x) || [],
        colors: form.colors?.filter(x => !!x) || [],
        images: form.images?.filter(x => !!x) || [],
        inStock: form.inStock !== undefined ? form.inStock : true,
        featured: form.featured !== undefined ? form.featured : false,
      }
      
      // Remove any undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      )
      

      
      if (editing) {
        await updateDoc(doc(db, 'products', editing.id), { ...cleanedData, updatedAt: serverTimestamp() })
        toast.success('Product updated!')
      } else {
        await addDoc(collection(db, 'products'), { ...cleanedData, createdAt: serverTimestamp() })
        toast.success('Product added!')
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      console.error('Failed to save product:', err)
      toast.error(`Failed to save product: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await deleteDoc(doc(db, 'products', product.id))
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-inter text-2xl text-cgc-paper">Products</h1>
          <p className="text-cgc-gray font-inter text-sm mt-1">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-xs">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-cgc-ink animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-cgc-ink border border-white/5 p-16 text-center">
          <p className="font-inter text-cgc-gray mb-4">No products yet</p>
          <button onClick={openAdd} className="btn-primary text-xs">Add Your First Product</button>
        </div>
      ) : (
        <div className="bg-cgc-ink border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="border-b border-white/5 text-cgc-gray font-inter text-xs">
                  <th className="text-left px-4 py-4">Product</th>
                  <th className="text-left px-4 py-4">Category</th>
                  <th className="text-left px-4 py-4">Price</th>
                  <th className="text-left px-4 py-4">Stock</th>
                  <th className="text-left px-4 py-4">Featured</th>
                  <th className="text-left px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-cgc-ink flex-shrink-0 overflow-hidden">
                          {p.images[0]
                            ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            : <img src="/images/logo.jpg" alt="" className="w-full h-full object-contain p-1" />}
                        </div>
                        <div>
                          <p className="font-inter text-cgc-paper text-xs">{p.name}</p>
                          <p className="text-cgc-gray text-xs mt-0.5">{p.sizes.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-cgc-gray text-xs font-inter">{p.category}</td>
                    <td className="px-4 py-4">
                      <SwingTag variant="price">${p.price}</SwingTag>
                    </td>
                    <td className="px-4 py-4">
                      {p.inStock
                        ? <SwingTag variant="new">In Stock</SwingTag>
                        : <SwingTag variant="sold-out">Sold Out</SwingTag>
                      }
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-inter ${p.featured ? 'bg-amber-900/30 text-amber-400' : 'bg-white/5 text-cgc-gray'}`}>
                        {p.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="w-8 h-8 bg-white/5 hover:bg-cgc-red/20 flex items-center justify-center text-cgc-gray hover:text-cgc-red transition-all">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(p)}
                          className="w-8 h-8 bg-white/5 hover:bg-red-900/30 flex items-center justify-center text-cgc-gray hover:text-red-400 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-cgc-ink border border-white/10 w-full max-w-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-inter text-cgc-paper text-sm">
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-cgc-gray hover:text-cgc-paper transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="font-inter text-xs text-cgc-gray block mb-3">
                  Product Images
                </label>
                <label className={`border-2 border-dashed border-white/10 hover:border-cgc-red p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={e => e.target.files && handleImageUpload(e.target.files)} />
                  {uploading ? (
                    <div className="text-center">
                      <Loader size={24} className="text-cgc-red animate-spin mx-auto mb-2" />
                      <p className="font-inter text-xs text-cgc-gray">Uploading {uploadProgress}%</p>
                      <div className="w-48 h-1 bg-white/10 mt-2 mx-auto">
                        <div className="h-full bg-cgc-red transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-cgc-gray mb-2" />
                      <p className="font-inter text-xs text-cgc-gray">Click to upload images</p>
                      <p className="text-cgc-gray/50 text-xs mt-1 font-inter">PNG, JPG, WEBP up to 10MB each</p>
                    </>
                  )}
                </label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-20 h-20">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-cgc-red flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-cgc-gray block mb-2">Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. CGC Eagle Hoodie"
                    className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter text-sm placeholder-cgc-gray/30 transition-colors" />
                </div>
                <div>
                  <label className="font-inter text-xs text-cgc-gray block mb-2">Price (CAD) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00" min="0" step="0.01"
                    className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter text-sm placeholder-cgc-gray/30 transition-colors" />
                </div>
              </div>

              {/* Category & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-cgc-gray block mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter text-sm transition-colors">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-inter text-xs text-cgc-gray block mb-2">Gender</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter text-sm transition-colors">
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-inter text-xs text-cgc-gray block mb-2">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..."
                  className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter text-sm placeholder-cgc-gray/30 transition-colors resize-none" />
              </div>

              {/* Sizes */}
              <div>
                <label className="font-inter text-xs text-cgc-gray block mb-3">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map(size => (
                    <button key={size} type="button" onClick={() => toggleSize(size)}
                      className={`font-inter text-xs px-3 py-2 border transition-all ${
                        form.sizes.includes(size)
                          ? 'bg-cgc-red border-cgc-red text-white'
                          : 'border-white/20 text-cgc-gray hover:border-cgc-red hover:text-cgc-paper'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="font-inter text-xs text-cgc-gray block mb-3">Colors</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    placeholder="e.g. Black, Red, White"
                    className="flex-1 bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-2 text-cgc-paper font-inter text-sm placeholder-cgc-gray/30 transition-colors" />
                  <button type="button" onClick={addColor} className="btn-primary text-xs px-4">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.colors.map(color => (
                    <span key={color} className="flex items-center gap-1 bg-cgc-ink border border-white/10 px-3 py-1 font-inter text-xs text-cgc-gray">
                      {color}
                      <button onClick={() => removeColor(color)} className="hover:text-cgc-red transition-colors ml-1">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm(prev => ({ ...prev, inStock: !prev.inStock }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.inStock ? 'bg-cgc-red' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.inStock ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="font-inter text-xs text-cgc-gray">In Stock</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-cgc-red' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="font-inter text-xs text-cgc-gray">Featured</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 text-xs">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="btn-primary flex-1 text-xs disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader size={14} className="animate-spin" /> Saving...</> : editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
