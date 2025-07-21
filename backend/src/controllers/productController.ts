import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  description: Joi.string().allow('').max(2000),
  price: Joi.number().positive().precision(2).required(),
  inventory: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
  categoryId: Joi.string().optional(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  metadata: Joi.object().optional(),
});

const updateProductSchema = productSchema.keys({
  name: Joi.string().min(1).max(255),
  price: Joi.number().positive().precision(2),
});

// Get all products with filtering and pagination
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive = 'true'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {
      isActive: isActive === 'true',
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);

    // Convert Decimal prices to numbers for JSON serialization
    const productsWithNumericPrices = products.map(product => ({
      ...product,
      price: Number(product.price),
    }));

    res.json({
      products: productsWithNumericPrices,
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If product is inactive, only show to admins
    if (!product.isActive && req.user?.role !== 'ADMIN') {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Convert Decimal price to number for JSON serialization
    const productWithNumericPrice = {
      ...product,
      price: Number(product.price),
    };

    res.json(productWithNumericPrice);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product (admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Generate slug from name
    const slug = value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return res.status(400).json({ error: 'A product with this name already exists' });
    }

    const product = await prisma.product.create({
      data: {
        ...value,
        slug,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Convert Decimal price to number for JSON serialization
    const productWithNumericPrice = {
      ...product,
      price: Number(product.price),
    };

    res.status(201).json(productWithNumericPrice);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = updateProductSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update slug if name changed
    let slug = existingProduct.slug;
    if (value.name && value.name !== existingProduct.name) {
      slug = value.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return res.status(400).json({ error: 'A product with this name already exists' });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...value,
        slug,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Convert Decimal price to number for JSON serialization
    const productWithNumericPrice = {
      ...product,
      price: Number(product.price),
    };

    res.json(productWithNumericPrice);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Soft delete - just mark as inactive
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};