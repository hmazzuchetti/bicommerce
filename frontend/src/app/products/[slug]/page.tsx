'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import ImageWithFallback from '@/components/ui/image-with-fallback'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  slug: string
  inventory: number
  isActive: boolean
  category?: {
    name: string
    slug: string
  }
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  images: string[]
  slug: string
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          
          // Fetch related products
          if (data.category?.slug) {
            const relatedResponse = await fetch(
              `/api/products?category=${data.category.slug}&exclude=${data.id}&limit=4`
            )
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              setRelatedProducts(relatedData)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        // Fallback demo data
        setProduct({
          id: '1',
          name: 'Handmade Crochet Scarf',
          description: 'This beautiful handmade crochet scarf is crafted with premium yarn in a stunning gradient pattern. Perfect for keeping warm during chilly days while adding a touch of artisanal style to your outfit. Each scarf is uniquely made with love and attention to detail.\n\nFeatures:\n• Made with 100% premium acrylic yarn\n• Soft and comfortable texture\n• Machine washable\n• Measures approximately 60" x 8"\n• Available in multiple colors\n• Handmade with love',
          price: 45.99,
          images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
          slug: 'crochet-scarf',
          inventory: 5,
          isActive: true,
          category: { name: 'Crochet Items', slug: 'crochet' }
        })
        
        setRelatedProducts([
          { id: '2', name: 'Crochet Hat', price: 32.99, images: ['/placeholder.jpg'], slug: 'crochet-hat' },
          { id: '3', name: 'Crochet Mittens', price: 28.99, images: ['/placeholder.jpg'], slug: 'crochet-mittens' },
          { id: '4', name: 'Crochet Blanket', price: 89.99, images: ['/placeholder.jpg'], slug: 'crochet-blanket' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        quantity: quantity
      })
    }
  }

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-300">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-300 mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <motion.nav 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-neon-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-neon-blue transition-colors">Products</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-neon-blue transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </motion.nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square bg-black/40 backdrop-blur-lg border border-neon-blue/30 rounded-lg overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ImageWithFallback
                    src={product.images[currentImageIndex] || '/placeholder.jpg'}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                      currentImageIndex === index 
                        ? 'border-neon-blue' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <ImageWithFallback
                      src={image || '/placeholder.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              {product.category && (
                <Badge variant="outline" className="border-neon-pink/50 text-neon-pink mb-3">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-neon-pink">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">(4.9)</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">Quantity:</span>
                <div className="flex items-center space-x-2 bg-black/40 border border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 text-white">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="p-2"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <span className="text-sm text-gray-400">
                  {product.inventory} in stock
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80"
                  disabled={product.inventory === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 ${isFavorite ? 'text-red-500 border-red-500' : 'border-gray-600'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" className="p-3 border-gray-600">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card className="bg-black/40 backdrop-blur-lg border border-neon-blue/30 p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">SKU:</span>
                  <span className="text-white ml-2">{product.id.slice(-8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Stock:</span>
                  <span className="text-white ml-2">{product.inventory} items</span>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">{product.category?.name || 'Uncategorized'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 ${product.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-neon-blue mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`}>
                  <Card className="group bg-black/40 backdrop-blur-lg border border-neon-blue/30 hover:border-neon-blue/60 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20 overflow-hidden">
                    <div className="aspect-square">
                      <ImageWithFallback
                        src={relatedProduct.images[0] || '/placeholder.jpg'}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-neon-blue transition-colors mb-2">
                        {relatedProduct.name}
                      </h3>
                      <span className="text-xl font-bold text-neon-pink">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}