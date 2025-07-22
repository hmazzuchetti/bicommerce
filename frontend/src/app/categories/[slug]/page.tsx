'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Grid, List, Filter } from 'lucide-react'
import ImageWithFallback from '@/components/ui/image-with-fallback'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  slug: string
  category?: {
    name: string
    slug: string
  }
}

export default function CategoryPage() {
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [categoryName, setCategoryName] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?category=${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          if (data.length > 0) {
            const prices = data.map((p: Product) => p.price)
            const max = Math.max(...prices)
            setMaxPrice(max)
            setPriceRange([0, max])
            setCategoryName(data[0].category?.name || params.slug as string)
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback demo data
        const demoProducts: Product[] = [
          {
            id: '1',
            name: 'Handmade Crochet Scarf',
            description: 'Warm and cozy winter scarf made with premium yarn',
            price: 45.99,
            images: ['/placeholder.jpg'],
            slug: 'crochet-scarf',
            category: { name: 'Crochet Items', slug: 'crochet' }
          },
          {
            id: '2', 
            name: 'Custom Pet Portrait',
            description: 'Beautiful hand-drawn portrait of your beloved pet',
            price: 89.99,
            images: ['/placeholder.jpg'],
            slug: 'pet-portrait',
            category: { name: 'Pet Portraits', slug: 'pet-portraits' }
          },
          {
            id: '3',
            name: 'Macrame Wall Hanging',
            description: 'Bohemian-style wall decoration for your home',
            price: 67.99,
            images: ['/placeholder.jpg'],
            slug: 'macrame-wall-hanging',
            category: { name: 'Home Decor', slug: 'home-decor' }
          }
        ]
        setProducts(demoProducts)
        setCategoryName(params.slug as string)
        setPriceRange([0, 100])
        setMaxPrice(100)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params.slug])

  const filteredProducts = products
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity: 1
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-300">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-orbitron font-bold text-neon-blue mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {categoryName}
          </motion.h1>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {filteredProducts.length} products found
          </motion.p>
        </div>

        {/* Filters and Controls */}
        <motion.div 
          className="bg-black/40 backdrop-blur-lg border border-neon-blue/30 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Price Range</label>
                <div className="w-48">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={maxPrice}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-black/30 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-gray-600">
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-asc">Price Low-High</SelectItem>
                    <SelectItem value="price-desc">Price High-Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products found matching your criteria</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-6"
          }>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`group bg-black/40 backdrop-blur-lg border border-neon-blue/30 hover:border-neon-blue/60 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20 overflow-hidden ${
                  viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
                }`}>
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}>
                    <ImageWithFallback
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className={`p-4 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-white group-hover:text-neon-blue transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {product.description && (
                      <p className="text-gray-400 text-sm mb-4 flex-1">
                        {viewMode === 'list' ? product.description : product.description.substring(0, 100) + '...'}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-neon-pink">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}