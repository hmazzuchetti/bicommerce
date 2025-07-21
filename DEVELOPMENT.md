# BiCommerce Development Guide

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Start Development Environment**
   ```bash
   ./scripts/dev.sh
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

## Manual Setup

### 1. Database Setup

Start PostgreSQL:
```bash
docker-compose up -d postgres
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` files in both `frontend` and `backend` directories based on `.env.example` files.

### Backend Environment Variables

```env
DATABASE_URL="postgresql://bicommerce_user:bicommerce_password@localhost:5432/bicommerce?schema=public"
NEXTAUTH_SECRET="your-secret-here"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run install:all` - Install all dependencies

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Features Implemented

✅ **Core Infrastructure**
- Next.js frontend with Tailwind CSS and Shadcn UI
- Express.js backend with TypeScript
- PostgreSQL database with Prisma ORM
- Docker setup for local development

✅ **API Endpoints**
- Products CRUD with filtering and pagination
- User management and authentication
- Order management
- Stripe payment integration with webhooks

✅ **UI/UX**
- Futuristic design with parallax effects
- Responsive mobile-first design
- Dark theme with neon accents
- Smooth animations with Framer Motion

✅ **Integrations**
- Stripe payments (including Brazilian Pix)
- Google Analytics
- Image upload system (Cloudinary)
- OAuth authentication (ready for Google/Facebook)

## Database Schema

The database includes the following models:
- **Users**: Authentication and user management
- **Products**: Product catalog with categories
- **Orders**: Order management with items
- **Categories**: Product categorization
- **Accounts/Sessions**: NextAuth.js authentication

## API Documentation

### Products API
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders API
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Stripe API
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/products` - Sync product to Stripe

## Deployment

The application is configured for deployment on:
- **Frontend**: Vercel or similar
- **Backend**: Fly.io
- **Database**: Fly.io PostgreSQL

See `fly.toml` (when created) for Fly.io deployment configuration.

## Testing

Run tests:
```bash
npm test
```

For end-to-end testing with Playwright:
```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Database Connection Issues
- Ensure Docker is running
- Check that PostgreSQL container is healthy: `docker-compose ps`
- Verify DATABASE_URL in .env

### Port Conflicts
- Frontend runs on port 3000
- Backend runs on port 3001
- PostgreSQL runs on port 5432

### Stripe Integration
- Use test keys for development
- Configure webhook endpoint in Stripe dashboard
- Ensure webhook secret is correctly set

## Support

For issues and questions:
- Check the troubleshooting section
- Review the logs in Docker containers
- Ensure all environment variables are properly configured