'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div ref={ref} className="min-h-screen bg-background text-foreground overflow-hidden">{/* Navigation is now global in layout.tsx */}

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
        />
        
        <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20" />
        
        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <Sparkles className="mx-auto text-neon-cyan mb-4 animate-pulse" size={48} />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">
              <span className="text-neon-cyan">Creative</span>{' '}
              <span className="text-neon-pink">Commerce</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink animate-glow">
                Reimagined
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto"
          >
            Discover unique handmade treasures in our futuristic marketplace. 
            From cozy crochet blankets to stunning pet portraits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/products"
              className="group px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-background rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
            >
              Explore Products
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/custom-orders"
              className="px-8 py-4 border border-neon-pink text-neon-pink rounded-lg font-semibold hover:bg-neon-pink hover:text-background transition-all duration-300 flex items-center gap-2"
            >
              <Zap size={20} />
              Custom Orders
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple opacity-20 blur-xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">
              Why Choose BiCommerce?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of handmade commerce with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Handcrafted Quality",
                description: "Every item is lovingly created by skilled artisans with attention to detail",
                icon: "✨",
              },
              {
                title: "Custom Creations",
                description: "Commission unique pieces tailored specifically to your vision",
                icon: "🎨",
              },
              {
                title: "Secure Checkout",
                description: "Lightning-fast payments with Stripe integration and Brazilian Pix support",
                icon: "⚡",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-cyan">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-neon-cyan">
                BiCommerce
              </h3>
              <p className="text-muted-foreground">
                The future of creative commerce, where artisans and customers connect in a digital wonderland.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/products" className="hover:text-neon-cyan transition-colors">All Products</Link></li>
                <li><Link href="/categories/crochet" className="hover:text-neon-cyan transition-colors">Crochet</Link></li>
                <li><Link href="/categories/pet-portraits" className="hover:text-neon-cyan transition-colors">Pet Portraits</Link></li>
                <li><Link href="/categories/handmade-crafts" className="hover:text-neon-cyan transition-colors">Handmade Crafts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/contact" className="hover:text-neon-cyan transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-neon-cyan transition-colors">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-neon-cyan transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-neon-cyan transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Pinterest</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BiCommerce. All rights reserved. Made with ❤️ for creative souls.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
