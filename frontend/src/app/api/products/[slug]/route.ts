import { NextRequest, NextResponse } from 'next/server'

const mockProducts = [
  {
    id: '1',
    name: 'Handmade Crochet Scarf',
    description: 'This beautiful handmade crochet scarf is crafted with premium yarn in a stunning gradient pattern. Perfect for keeping warm during chilly days while adding a touch of artisanal style to your outfit. Each scarf is uniquely made with love and attention to detail.\n\nFeatures:\n• Made with 100% premium acrylic yarn\n• Soft and comfortable texture\n• Machine washable\n• Measures approximately 60" x 8"\n• Available in multiple colors\n• Handmade with love',
    price: 45.99,
    images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    slug: 'crochet-scarf',
    inventory: 5,
    isActive: true,
    category: { name: 'Crochet Items', slug: 'crochet' }
  },
  {
    id: '2',
    name: 'Custom Pet Portrait',
    description: 'Capture the essence of your beloved pet with our custom hand-drawn portraits. Our talented artists create stunning, lifelike portraits that celebrate the unique personality of your furry friend.\n\nWhat you get:\n• High-quality digital portrait\n• Multiple size options available\n• Professional-grade printing\n• Rush orders available\n• 100% satisfaction guarantee\n• Perfect gift for pet lovers',
    price: 89.99,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    slug: 'pet-portrait',
    inventory: 3,
    isActive: true,
    category: { name: 'Pet Portraits', slug: 'pet-portraits' }
  },
  {
    id: '3',
    name: 'Macrame Wall Hanging',
    description: 'Add bohemian charm to your space with this stunning macrame wall hanging. Handcrafted using natural cotton rope, this piece brings texture and warmth to any room.\n\nDetails:\n• Made with 100% cotton rope\n• Natural wood dowel\n• Dimensions: 24" wide x 36" long\n• Ready to hang\n• Bohemian/modern design\n• Perfect for any room',
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
    description: 'Soft and gentle blanket perfect for babies, made with hypoallergenic yarn.',
    price: 75.99,
    images: ['/placeholder.jpg'],
    slug: 'baby-blanket',
    inventory: 4,
    isActive: true,
    category: { name: 'Crochet Items', slug: 'crochet' }
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = mockProducts.find(p => p.slug === params.slug)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}