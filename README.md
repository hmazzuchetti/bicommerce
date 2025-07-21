# BiCommerce - Creative Ecommerce Platform

A low-budget, creative ecommerce platform for handmade products with a futuristic design.

## Features

- 🎨 Creative, futuristic UI with parallax effects
- 💳 Stripe payments with Brazilian Pix support
- 🔐 OAuth authentication (Google, Facebook)
- 📱 Mobile-first responsive design
- 🛒 Shopping cart and product management
- 📊 Google Analytics integration
- 🖼️ Image upload system
- 🔧 Admin dashboard

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Fly.io

## Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run database
docker-compose up -d postgres

# Run tests
npm test
```

## Project Structure

```
bicommerce/
├── frontend/          # Next.js frontend
├── backend/           # Express API server
├── docs/             # Documentation
├── scripts/          # Development scripts
└── docker-compose.yml # Local development setup
```