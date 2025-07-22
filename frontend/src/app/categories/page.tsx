'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-orbitron font-bold text-neon-blue mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Product Categories
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore our curated collections of handmade treasures
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
            <p className="text-gray-300">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-8">No categories found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder categories for demo */}
              {[
                { name: 'Crochet Items', slug: 'crochet', description: 'Handmade crochet accessories and clothing', productCount: 12 },
                { name: 'Pet Portraits', slug: 'pet-portraits', description: 'Custom pet portraits and artwork', productCount: 8 },
                { name: 'Home Decor', slug: 'home-decor', description: 'Unique decorative pieces for your space', productCount: 15 },
                { name: 'Jewelry', slug: 'jewelry', description: 'Handcrafted jewelry and accessories', productCount: 6 },
                { name: 'Art Prints', slug: 'art-prints', description: 'Original artwork and prints', productCount: 10 },
                { name: 'Custom Orders', slug: 'custom', description: 'Personalized items made to order', productCount: 4 },
              ].map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/categories/${category.slug}`}>
                    <Card className="group bg-black/40 backdrop-blur-lg border border-neon-blue/30 hover:border-neon-blue/60 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20 p-6 cursor-pointer h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-xl font-orbitron font-semibold text-white group-hover:text-neon-blue transition-colors mb-3">
                            {category.name}
                          </h3>
                          <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                            {category.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge 
                            variant="outline" 
                            className="border-neon-pink/50 text-neon-pink group-hover:border-neon-pink group-hover:text-neon-pink/80"
                          >
                            {category.productCount} products
                          </Badge>
                          <svg 
                            className="w-5 h-5 text-gray-500 group-hover:text-neon-blue transform group-hover:translate-x-1 transition-all duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group bg-black/40 backdrop-blur-lg border border-neon-blue/30 hover:border-neon-blue/60 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20 p-6 cursor-pointer h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-xl font-orbitron font-semibold text-white group-hover:text-neon-blue transition-colors mb-3">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                          {category.description || 'Explore our collection'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge 
                          variant="outline" 
                          className="border-neon-pink/50 text-neon-pink group-hover:border-neon-pink group-hover:text-neon-pink/80"
                        >
                          {category._count?.products || 0} products
                        </Badge>
                        <svg 
                          className="w-5 h-5 text-gray-500 group-hover:text-neon-blue transform group-hover:translate-x-1 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}