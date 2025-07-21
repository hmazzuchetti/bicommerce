import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'crochet' },
      update: {},
      create: {
        name: 'Crochet',
        description: 'Handmade crochet items including blankets, toys, and accessories',
        slug: 'crochet',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pet-portraits' },
      update: {},
      create: {
        name: 'Pet Portraits',
        description: 'Custom pet portraits in various styles and mediums',
        slug: 'pet-portraits',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'handmade-crafts' },
      update: {},
      create: {
        name: 'Handmade Crafts',
        description: 'Various handmade crafts and artistic creations',
        slug: 'handmade-crafts',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create sample products
  const products = await Promise.all([
    // Crochet Items
    prisma.product.upsert({
      where: { slug: 'rainbow-baby-blanket' },
      update: {},
      create: {
        name: 'Rainbow Baby Blanket',
        description: 'Soft and cozy rainbow-colored baby blanket made with premium yarn. Perfect for keeping your little one warm and stylish.',
        price: 45.99,
        inventory: 10,
        slug: 'rainbow-baby-blanket',
        categoryId: categories[0].id, // Crochet
        images: [
          'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500',
          'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800'
        ],
        metadata: {
          materials: ['Cotton yarn', 'Acrylic yarn'],
          care_instructions: 'Machine wash cold, tumble dry low',
          size: '30x35 inches',
          handmade: true
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'amigurumi-octopus' },
      update: {},
      create: {
        name: 'Amigurumi Octopus',
        description: 'Adorable crocheted octopus toy, perfect for kids or as a decorative piece. Made with soft, child-safe materials.',
        price: 25.50,
        inventory: 15,
        slug: 'amigurumi-octopus',
        categoryId: categories[0].id, // Crochet
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
        ],
        metadata: {
          materials: ['Cotton yarn'],
          safety: 'Child-safe materials, suitable for ages 3+',
          size: '6 inches tall',
          colors_available: ['Pink', 'Blue', 'Purple', 'Orange']
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'cozy-winter-scarf' },
      update: {},
      create: {
        name: 'Cozy Winter Scarf',
        description: 'Luxurious hand-crocheted scarf in rich burgundy color. Perfect for cold winter days and stylish enough for any occasion.',
        price: 32.00,
        inventory: 8,
        slug: 'cozy-winter-scarf',
        categoryId: categories[0].id, // Crochet
        images: [
          'https://images.unsplash.com/photo-1544966503-7525c4d82e2e?w=500',
          'https://images.unsplash.com/photo-1544966503-7525c4d82e2e?w=800'
        ],
        metadata: {
          materials: ['Merino wool'],
          size: '70 inches long, 8 inches wide',
          colors_available: ['Burgundy', 'Navy', 'Forest Green', 'Charcoal']
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'granny-square-pillow' },
      update: {},
      create: {
        name: 'Granny Square Pillow Cover',
        description: 'Vintage-inspired granny square pillow cover that adds bohemian charm to any living space. Removable and washable.',
        price: 28.75,
        inventory: 12,
        slug: 'granny-square-pillow',
        categoryId: categories[0].id, // Crochet
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
        ],
        metadata: {
          materials: ['Cotton yarn'],
          size: '18x18 inches',
          pattern: 'Classic granny square',
          care_instructions: 'Machine wash gentle, air dry'
        }
      },
    }),

    // Pet Portraits
    prisma.product.upsert({
      where: { slug: 'custom-dog-portrait' },
      update: {},
      create: {
        name: 'Custom Dog Portrait',
        description: 'Beautiful custom portrait of your beloved dog, hand-drawn with attention to detail. Perfect for dog lovers!',
        price: 75.00,
        inventory: 5,
        slug: 'custom-dog-portrait',
        categoryId: categories[1].id, // Pet Portraits
        images: [
          'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=500',
          'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800'
        ],
        metadata: {
          medium: 'Digital art',
          delivery_format: 'High-resolution digital file',
          turnaround_time: '7-10 business days',
          custom_options: ['Size options', 'Background choices', 'Multiple pets']
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'cat-portrait-watercolor' },
      update: {},
      create: {
        name: 'Cat Portrait - Watercolor Style',
        description: 'Elegant watercolor-style portrait of your cat. A timeless piece of art that captures your feline friend beautifully.',
        price: 65.00,
        inventory: 8,
        slug: 'cat-portrait-watercolor',
        categoryId: categories[1].id, // Pet Portraits
        images: [
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500',
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'
        ],
        metadata: {
          medium: 'Digital watercolor',
          delivery_format: 'High-resolution digital file + optional print',
          turnaround_time: '5-7 business days',
          style: 'Watercolor'
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'pet-family-portrait' },
      update: {},
      create: {
        name: 'Pet Family Portrait (Multiple Pets)',
        description: 'Custom family portrait featuring multiple pets. Celebrate your furry family with this heartwarming artwork.',
        price: 95.00,
        inventory: 3,
        slug: 'pet-family-portrait',
        categoryId: categories[1].id, // Pet Portraits
        images: [
          'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
          'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'
        ],
        metadata: {
          medium: 'Digital art',
          delivery_format: 'High-resolution digital file + print option',
          turnaround_time: '10-14 business days',
          max_pets: '5 pets',
          custom_options: ['Background scenes', 'Size options', 'Frame styles']
        }
      },
    }),

    // Handmade Crafts
    prisma.product.upsert({
      where: { slug: 'macrame-wall-hanging' },
      update: {},
      create: {
        name: 'Macrame Wall Hanging',
        description: 'Bohemian-style macrame wall hanging to add texture and warmth to any room. Handcrafted with natural cotton cord.',
        price: 35.00,
        inventory: 12,
        slug: 'macrame-wall-hanging',
        categoryId: categories[2].id, // Handmade Crafts
        images: [
          'https://images.unsplash.com/photo-1586997516110-ca26f6b7c25a?w=500',
          'https://images.unsplash.com/photo-1586997516110-ca26f6b7c25a?w=800'
        ],
        metadata: {
          materials: ['Natural cotton cord', 'Wooden dowel'],
          size: '20x30 inches',
          style: 'Bohemian',
          mounting: 'Ready to hang'
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'ceramic-mug-set' },
      update: {},
      create: {
        name: 'Handcrafted Ceramic Mug Set',
        description: 'Set of 2 unique ceramic mugs with hand-painted designs. Each mug is one-of-a-kind with slight variations that make them special.',
        price: 42.00,
        inventory: 6,
        slug: 'ceramic-mug-set',
        categoryId: categories[2].id, // Handmade Crafts
        images: [
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500',
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800'
        ],
        metadata: {
          materials: ['Ceramic', 'Glazes'],
          set_contents: '2 mugs (12oz each)',
          care_instructions: 'Dishwasher safe, microwave safe',
          style: 'Rustic modern'
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wooden-jewelry-box' },
      update: {},
      create: {
        name: 'Handcrafted Wooden Jewelry Box',
        description: 'Beautiful wooden jewelry box with intricate carvings and multiple compartments. Perfect for organizing precious accessories.',
        price: 85.00,
        inventory: 4,
        slug: 'wooden-jewelry-box',
        categoryId: categories[2].id, // Handmade Crafts
        images: [
          'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=500',
          'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800'
        ],
        metadata: {
          materials: ['Oak wood', 'Velvet lining'],
          dimensions: '8x6x4 inches',
          compartments: '3 main sections + ring slots',
          finish: 'Natural wood stain'
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'embroidery-hoop-art' },
      update: {},
      create: {
        name: 'Custom Embroidery Hoop Art',
        description: 'Personalized embroidery hoop art with your choice of design. Modern embroidery that makes a perfect wall decoration or gift.',
        price: 38.50,
        inventory: 9,
        slug: 'embroidery-hoop-art',
        categoryId: categories[2].id, // Handmade Crafts
        images: [
          'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=500',
          'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800'
        ],
        metadata: {
          materials: ['Cotton fabric', 'Embroidery floss', 'Wooden hoop'],
          hoop_size: '8 inch diameter',
          custom_options: ['Text customization', 'Color choices', 'Design themes'],
          turnaround_time: '7-10 business days'
        }
      },
    }),
    prisma.product.upsert({
      where: { slug: 'knitted-baby-booties' },
      update: {},
      create: {
        name: 'Soft Knitted Baby Booties',
        description: 'Adorable hand-knitted baby booties in soft pastel colors. Perfect for newborns and makes a wonderful baby shower gift.',
        price: 22.00,
        inventory: 20,
        slug: 'knitted-baby-booties',
        categoryId: categories[0].id, // Crochet (knitting is similar)
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
        ],
        metadata: {
          materials: ['Baby yarn (hypoallergenic)'],
          sizes: ['0-3 months', '3-6 months', '6-12 months'],
          colors_available: ['Pink', 'Blue', 'Yellow', 'White', 'Mint Green'],
          care_instructions: 'Hand wash only, air dry'
        }
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bicommerce.com' },
    update: {},
    create: {
      email: 'admin@bicommerce.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created');

  // Create sample user
  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Sample User',
      role: 'USER',
    },
  });

  console.log('✅ Sample user created');

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      userId: sampleUser.id,
      total: 71.49,
      status: 'DELIVERED',
      paymentStatus: 'SUCCEEDED',
      shippingAddress: {
        name: 'Sample User',
        address: '123 Main St',
        city: 'Sample City',
        state: 'SC',
        zipCode: '12345',
        country: 'US'
      },
      orderItems: {
        create: [
          {
            productId: products[0].id, // Rainbow Baby Blanket
            quantity: 1,
            price: 45.99,
          },
          {
            productId: products[2].id, // Amigurumi Octopus
            quantity: 1,
            price: 25.50,
          },
        ],
      },
    },
  });

  console.log('✅ Sample order created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - 2 users (1 admin, 1 regular)`);
  console.log(`   - 1 sample order`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });