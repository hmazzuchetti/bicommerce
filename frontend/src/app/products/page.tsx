'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, LayoutList, ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  inventory: number;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'crochet', label: 'Crochet' },
    { value: 'pet-portraits', label: 'Pet Portraits' },
    { value: 'handmade-crafts', label: 'Handmade Crafts' },
  ];

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name: A to Z' },
    { value: 'name:desc', label: 'Name: Z to A' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(priceRange[0] > 0 && { minPrice: priceRange[0].toString() }),
        ...(priceRange[1] < 100 && { maxPrice: priceRange[1].toString() }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products?${params}`);
      const data: ProductsResponse = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder, priceRange]);

  const handleSortChange = (value: string) => {
    const [field, order] = value.split(':');
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      slug: product.slug,
    });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          {product.category && (
            <Badge className="absolute top-2 left-2 bg-neon-cyan text-background">
              {product.category.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <Link href={`/products/${product.slug}`} className="group/link">
            <h3 className="font-semibold text-lg mb-2 group-hover/link:text-neon-cyan transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-neon-cyan">
                ${product.price.toFixed(2)}
              </span>
              {product.inventory < 5 && (
                <Badge variant="destructive" className="text-xs">
                  Only {product.inventory} left
                </Badge>
              )}
            </div>
            <Button
              onClick={() => handleAddToCart(product)}
              className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <Link href={`/products/${product.slug}`} className="group/link">
                  <h3 className="font-semibold text-lg group-hover/link:text-neon-cyan transition-colors">
                    {product.name}
                  </h3>
                </Link>
                {product.category && (
                  <Badge className="bg-neon-cyan text-background ml-2">
                    {product.category.name}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-neon-cyan">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.inventory < 5 && (
                    <Badge variant="destructive" className="text-xs">
                      Only {product.inventory} left
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of handmade treasures and custom creations
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-border"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-background/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={`${sortBy}:${sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full lg:w-48 bg-background/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border border-border rounded-lg bg-background/50">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {pagination && (
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
              </p>
            )}
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card/50 rounded-lg h-80"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="text-sm"
            >
              Previous
            </Button>
            
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === pagination.page;
              const isNearCurrentPage = Math.abs(page - pagination.page) <= 2;
              const isFirstOrLast = page === 1 || page === pagination.totalPages;
              
              if (!isNearCurrentPage && !isFirstOrLast) {
                if (page === 2 || page === pagination.totalPages - 1) {
                  return <span key={page} className="text-muted-foreground">...</span>;
                }
                return null;
              }
              
              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={isCurrentPage ? 'bg-neon-cyan text-background' : ''}
                  size="sm"
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="text-sm"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}