import { Link } from 'react-router-dom'
import { FiPackage, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-dark-200 bg-dark-900 text-dark-300">
      <div className="page-container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <FiPackage className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VYSTA</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for premium cleaning and hygiene products.
              Quality you can trust. Prices you'll love.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm transition-colors hover:text-white">
                Home
              </Link>
              <Link to="/products" className="block text-sm transition-colors hover:text-white">
                Products
              </Link>
              <Link to="/about" className="block text-sm transition-colors hover:text-white">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm transition-colors hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h4>
            <div className="space-y-2">
              <Link to="/products?category=Cleaning+Supplies" className="block text-sm transition-colors hover:text-white">
                Cleaning Supplies
              </Link>
              <Link to="/products?category=Home+Essentials" className="block text-sm transition-colors hover:text-white">
                Home Essentials
              </Link>
              <Link to="/products?category=Personal+Care" className="block text-sm transition-colors hover:text-white">
                Personal Care
              </Link>
              <Link to="/products?category=Eco-Friendly" className="block text-sm transition-colors hover:text-white">
                Eco-Friendly
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span>123 Business Street, City, India</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMail className="h-4 w-4 shrink-0 text-primary-400" />
                <span>support@vysta.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiPhone className="h-4 w-4 shrink-0 text-primary-400" />
                <span>+91 12345 67890</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-dark-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VYSTA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
