import { motion } from 'framer-motion'
import { FiPackage, FiHeart, FiShield, FiTrendingUp } from 'react-icons/fi'

const values = [
  {
    icon: FiPackage,
    title: 'Quality Products',
    desc: 'We carefully curate every product to ensure it meets our high standards of quality and safety.',
  },
  {
    icon: FiHeart,
    title: 'Customer First',
    desc: 'Your satisfaction drives everything we do. We prioritize your needs and feedback.',
  },
  {
    icon: FiShield,
    title: 'Trust & Safety',
    desc: 'All our products are sourced from verified manufacturers and meet safety regulations.',
  },
  {
    icon: FiTrendingUp,
    title: 'Continuous Improvement',
    desc: 'We constantly update our inventory based on the latest market trends and customer demands.',
  },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 to-dark-800 py-20">
        <div className="page-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold text-white md:text-5xl"
          >
            About VYSTA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-dark-300"
          >
            Quality you can trust. Prices you'll love. Your one-stop destination for premium
            cleaning and hygiene products.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="page-container">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">Our Story</h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                <p>
                  VYSTA was founded with a simple mission: to make premium cleaning and hygiene
                  products accessible to every household. We believe that a clean home is the
                  foundation of a happy life.
                </p>
                <p>
                  Our team works tirelessly to source the best products from trusted manufacturers,
                  ensuring that every item on our platform meets the highest standards of quality,
                  safety, and efficacy.
                </p>
                <p>
                  From eco-friendly cleaning solutions to everyday essentials, we offer a
                  carefully curated selection that makes home care simple, effective, and
                  sustainable.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-dark-50 py-16">
        <div className="page-container">
          <h2 className="section-title mb-12 text-center">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                  <val.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 font-semibold text-dark-900">{val.title}</h3>
                <p className="text-sm text-dark-500">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
