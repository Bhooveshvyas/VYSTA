import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import { PRODUCT_CATEGORIES } from '../constants'
import { ProductGridSkeleton } from '../components/SkeletonLoader'
import { formatCurrency } from '../utils'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        const sorted = [...products].sort((a, b) => b.ratings - a.ratings)
        setFeatured(products.slice(0, 4))
        setBestSellers(sorted.slice(0, 4))
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const features = [
    { icon: FiTruck, title: 'Free Delivery', desc: 'Free shipping on orders above ₹499' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout with Razorpay' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
    { icon: FiStar, title: 'Premium Quality', desc: 'Curated products from trusted brands' },
  ]

  const categories = PRODUCT_CATEGORIES.filter((c) => c !== 'All').slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="page-container relative z-10 py-20 md:py-32">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-block rounded-full bg-primary-500/20 px-4 py-1.5 text-sm font-medium text-primary-200"
            >
              Premium Cleaning & Hygiene Products
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              Quality You Can Trust.{' '}
              <span className="text-primary-300">Prices You'll Love.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-lg text-primary-100/80"
            >
              Your one-stop destination for premium cleaning supplies and daily essentials.
              Fast delivery across India.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-800 transition-all hover:bg-primary-50">
                Shop Now
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-lg border border-primary-400/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700/50">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-dark-200 bg-white py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="mb-1 font-semibold text-dark-900">{feature.title}</h4>
                <p className="text-xs text-dark-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="page-container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/products" className="btn-ghost text-sm font-semibold text-primary-600">
              View All <FiArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-dark-50 py-16">
        <div className="page-container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="btn-ghost text-sm font-semibold text-primary-600">
              View All <FiArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="page-container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/products" className="btn-ghost text-sm font-semibold text-primary-600">
              View All <FiArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="page-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Stock Up?
            </h2>
            <p className="mb-8 text-lg text-primary-100">
              Get free delivery on your first order. Shop with confidence.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-50"
            >
              Start Shopping
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
