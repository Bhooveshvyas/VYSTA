import { useState, useRef, useCallback } from 'react'
import { FiUploadCloud, FiX, FiFile } from 'react-icons/fi'
import { getImageUrl } from '../utils'

export default function DragDropImage({ value, onChange, existingImage }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    onChange(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleClick = () => inputRef.current?.click()

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const clearImage = (e) => {
    e.stopPropagation()
    onChange(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayUrl = preview || (existingImage ? getImageUrl(existingImage) : null)

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
        dragging
          ? 'border-primary-500 bg-primary-50'
          : displayUrl
            ? 'border-dark-200 bg-dark-50'
            : 'border-dark-300 hover:border-dark-400 hover:bg-dark-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative w-full">
          <img
            src={displayUrl}
            alt="Preview"
            className="mx-auto max-h-48 rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
          <p className="mt-2 text-center text-xs text-dark-500">Click or drag to replace</p>
        </div>
      ) : (
        <>
          <div className="mb-2 rounded-full bg-dark-100 p-3">
            <FiUploadCloud className="h-6 w-6 text-dark-400" />
          </div>
          <p className="text-sm font-medium text-dark-700">
            Drop an image here or click to browse
          </p>
          <p className="mt-1 text-xs text-dark-400">PNG, JPG, WebP up to 5MB</p>
        </>
      )}
    </div>
  )
}
