import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import Modal from '../../components/Modal'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import toast from 'react-hot-toast'
import { formatCurrency, getImageUrl } from '../../utils'
import DragDropImage from '../../components/DragDropImage'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null })
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: null,
  })

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '', stock: '', image: null })
    setEditing(null)
  }

  const openCreate = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: null,
    })
    setEditing(product)
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) {
      toast.error('Please fill required fields')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('stock', form.stock || 0)
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await updateProduct(editing.id, fd)
        toast.success('Product updated')
      } else {
        await createProduct(fd)
        toast.success('Product created')
      }
      setModalOpen(false)
      resetForm()
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.product) return
    setSubmitting(true)
    try {
      await deleteProduct(deleteDialog.product.id)
      toast.success('Product deleted')
      setDeleteDialog({ open: false, product: null })
      fetchProducts()
    } catch (err) {
      toast.error('Failed to delete product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchProducts} />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark-900">Products</h1>
        <button onClick={openCreate} className="btn-primary">
          <FiPlus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState icon={FiPackage} title="No products" message="Create your first product to get started." action={
          <button onClick={openCreate} className="btn-primary">Add Product</button>
        } />
      ) : (
        <div className="card-hover overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-50 text-dark-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-dark-100">
                          <img src={getImageUrl(p.imageUrl)} alt="" className="h-full w-full object-cover" />
                        </div>
                        <span className="font-medium text-dark-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-600">{p.category}</td>
                    <td className="px-6 py-4 font-medium text-dark-900">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${p.stock <= 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-600">{p.ratings || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-dark-400 hover:bg-blue-50 hover:text-blue-600">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteDialog({ open: true, product: p })} className="rounded-lg p-1.5 text-dark-400 hover:bg-red-50 hover:text-red-600">
                          <FiTrash2 className="h-4 w-4" />
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editing ? 'Edit Product' : 'Create Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Price *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="">Select category</option>
                {['Cleaning Supplies', 'Home Essentials', 'Personal Care', 'Kitchen', 'Laundry', 'Disinfectants', 'Paper Products', 'Eco-Friendly'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Image</label>
              <DragDropImage
                value={form.image}
                onChange={(file) => setForm({ ...form, image: file })}
                existingImage={editing?.imageUrl}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); resetForm() }} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, product: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        loading={submitting}
      />
    </div>
  )
}
