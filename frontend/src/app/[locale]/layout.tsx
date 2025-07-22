import { Inter, Orbitron } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { CartProvider } from '@/contexts/CartContext'
import Navigation from '@/components/Navigation'
import '../globals.css'
import '../theme.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

const locales = ['en', 'pt']

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages({ locale })
  const metadata = messages?.metadata || {}

  return {
    title: metadata.title || 'BiCommerce - Creative Handmade Products',
    description: metadata.description || 'Discover unique handmade crochet items, custom pet portraits, and creative crafts.',
    keywords: metadata.keywords || ['handmade', 'crochet', 'pet portraits', 'custom art', 'creative', 'ecommerce'],
    authors: [{ name: metadata.author || 'BiCommerce Team' }],
    openGraph: {
      title: metadata.title || 'BiCommerce - Creative Handmade Products',
      description: metadata.description || 'Discover unique handmade crochet items, custom pet portraits, and creative crafts.',
      type: 'website',
      siteName: metadata.siteName || 'BiCommerce'
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title || 'BiCommerce - Creative Handmade Products',
      description: metadata.description || 'Discover unique handmade crochet items, custom pet portraits, and creative crafts.'
    }
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-inter bg-dark-900 text-white min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Navigation />
            <main>{children}</main>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}