import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiX } from 'react-icons/fi'
import { getProducts } from '../services/productService'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import Pagination from '../components/Pagination'
import { SORT_OPTIONS, DEFAULT_PAGE_SIZE } from '../constants'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [allProducts, setAllProducts] = useState([])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setAllProducts(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (selectedCategory) params.category = selectedCategory
    if (sort !== 'newest') params.sort = sort
    setSearchParams(params, { replace: true })
  }, [search, selectedCategory, sort, setSearchParams])

  useEffect(() => {
    let filtered = [...allProducts]

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating_desc':
        filtered.sort((a, b) => b.ratings - a.ratings)
        break
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setProducts(filtered)
    setCurrentPage(1)
  }, [allProducts, search, selectedCategory, sort])

  const totalPages = Math.ceil(products.length / DEFAULT_PAGE_SIZE)
  const paginatedProducts = products.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE
  )

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    setSidebarOpen(false)
  }

  return (
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-2">Products</h1>
        <p className="mb-6 text-dark-500">Browse our complete collection of premium products.</p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-dark-300 px-4 py-2.5 text-sm font-medium text-dark-600 transition-colors hover:bg-dark-50 lg:hidden"
          >
            <FiFilter className="h-4 w-4" />
            Filters
            {selectedCategory && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                1
              </span>
            )}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-auto"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="flex-1">
          {selectedCategory && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-dark-500">
                Category: <strong className="text-dark-700">{selectedCategory}</strong>
              </span>
              <button
                onClick={() => setSelectedCategory('')}
                className="rounded-full p-0.5 text-dark-400 hover:text-dark-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}

          <ProductGrid
            products={paginatedProducts}
            loading={loading}
            error={error}
            onRetry={fetchProducts}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <FilterSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  )
}
