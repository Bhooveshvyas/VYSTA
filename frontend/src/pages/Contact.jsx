import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axios from '../api/axios'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      await axios.post('/contact', formData)
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="section-title mb-2">Contact Us</h1>
        <p className="mb-12 text-dark-500">We'd love to hear from you. Get in touch with our team.</p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card-hover p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-50 p-3">
                <FiMail className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Email</h3>
                <p className="text-sm text-dark-500">qalqii@gmail.com</p>
                <p className="text-sm text-dark-500">We reply within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="card-hover p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-50 p-3">
                <FiPhone className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Phone</h3>
                <p className="text-sm text-dark-500">+91 6268272966</p>
                <p className="text-sm text-dark-500">Mon-Sat, 9AM-6PM</p>
              </div>
            </div>
          </div>

          <div className="card-hover p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary-50 p-3">
                <FiMapPin className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Address</h3>
                <p className="text-sm text-dark-500">
                  Station Road Shajapur,<br />
                  Madhya Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="card-hover space-y-4 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+91 12345 67890"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input-field"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Tell us more..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <FiSend className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </div>
  )
}
