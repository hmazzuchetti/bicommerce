# BiCommerce Development Setup Script for Windows PowerShell

Write-Host "🚀 Starting BiCommerce Development Environment" -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL database
Write-Host "📊 Starting PostgreSQL database..." -ForegroundColor Cyan
docker-compose up -d postgres

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Setup backend database
Write-Host "🔧 Setting up backend database..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update the .env file with your configuration before continuing." -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Cyan
npm run db:generate

# Run database migrations
Write-Host "🗃️ Running database migrations..." -ForegroundColor Cyan
npm run db:migrate

# Seed the database
Write-Host "🌱 Seeding the database..." -ForegroundColor Cyan
npm run db:seed

Set-Location ..

# Start development servers
Write-Host "🎯 Starting development servers..." -ForegroundColor Green
npm run dev
