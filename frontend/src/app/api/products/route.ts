import { NextRequest, NextResponse } from 'next/server'

const mockProducts = [
  {
    id: '1',
    name: 'Handmade Crochet Scarf',
    description: 'Warm and cozy winter scarf made with premium yarn',
    price: 45.99,
    images: ['/placeholder.jpg'],
    slug: 'crochet-scarf',
    inventory: 5,
    isActive: true,
    category: { name: 'Crochet Items', slug: 'crochet' }
  },
  {
    id: '2',
    name: 'Custom Pet Portrait',
    description: 'Beautiful hand-drawn portrait of your beloved pet',
    price: 89.99,
    images: ['/placeholder.jpg'],
    slug: 'pet-portrait',
    inventory: 3,
    isActive: true,
    category: { name: 'Pet Portraits', slug: 'pet-portraits' }
  },
  {
    id: '3',
    name: 'Macrame Wall Hanging',
    description: 'Bohemian-style wall decoration for your home',
    price: 67.99,
    images: ['/placeholder.jpg'],
    slug: 'macrame-wall-hanging',
    inventory: 8,
    isActive: true,
    category: { name: 'Home Decor', slug: 'home-decor' }
  },
  {
    id: '4',
    name: 'Crocheted Baby Blanket',
    description: 'Soft and gentle blanket perfect for babies',
    price: 75.99,
    images: ['/placeholder.jpg'],
    slug: 'baby-blanket',
    inventory: 4,
    isActive: true,
    category: { name: 'Crochet Items', slug: 'crochet' }
  },
  {
    id: '5',
    name: 'Handmade Silver Ring',
    description: 'Elegant silver ring with unique design',
    price: 95.99,
    images: ['/placeholder.jpg'],
    slug: 'silver-ring',
    inventory: 2,
    isActive: true,
    category: { name: 'Jewelry', slug: 'jewelry' }
  },
  {
    id: '6',
    name: 'Canvas Art Print',
    description: 'High-quality print of original artwork',
    price: 55.99,
    images: ['/placeholder.jpg'],
    slug: 'canvas-print',
    inventory: 10,
    isActive: true,
    category: { name: 'Art Prints', slug: 'art-prints' }
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const exclude = searchParams.get('exclude')
    const limit = searchParams.get('limit')

    let filteredProducts = mockProducts

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.slug === category
      )
    }

    // Exclude specific product
    if (exclude) {
      filteredProducts = filteredProducts.filter(product => 
        product.id !== exclude
      )
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit, 10)
      filteredProducts = filteredProducts.slice(0, limitNum)
    }

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}