import { NextRequest, NextResponse } from 'next/server'

const mockCategories = [
  {
    id: '1',
    name: 'Crochet Items',
    slug: 'crochet',
    description: 'Handmade crochet accessories and clothing',
    _count: { products: 12 }
  },
  {
    id: '2',
    name: 'Pet Portraits',
    slug: 'pet-portraits',
    description: 'Custom pet portraits and artwork',
    _count: { products: 8 }
  },
  {
    id: '3',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Unique decorative pieces for your space',
    _count: { products: 15 }
  },
  {
    id: '4',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Handcrafted jewelry and accessories',
    _count: { products: 6 }
  },
  {
    id: '5',
    name: 'Art Prints',
    slug: 'art-prints',
    description: 'Original artwork and prints',
    _count: { products: 10 }
  },
  {
    id: '6',
    name: 'Custom Orders',
    slug: 'custom',
    description: 'Personalized items made to order',
    _count: { products: 4 }
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockCategories)
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}