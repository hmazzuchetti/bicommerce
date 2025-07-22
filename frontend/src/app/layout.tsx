import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiCommerce - Creative Handmade Products",
  description: "Discover unique handmade crochet items, custom pet portraits, and creative crafts. Futuristic shopping experience for creative souls.",
  keywords: ["handmade", "crochet", "pet portraits", "custom art", "creative", "ecommerce"],
  authors: [{ name: "BiCommerce Team" }],
  openGraph: {
    title: "BiCommerce - Creative Handmade Products",
    description: "Discover unique handmade crochet items, custom pet portraits, and creative crafts.",
    type: "website",
    siteName: "BiCommerce",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiCommerce - Creative Handmade Products",
    description: "Discover unique handmade crochet items, custom pet portraits, and creative crafts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased matrix-bg`}
      >
        <AuthSessionProvider>
          <CartProvider>
            <Navigation />
            {children}
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}