'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { motion } from 'framer-motion';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg bg-white/5 p-2 transition-colors duration-200 hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-white" />
      ) : (
        <Moon className="h-5 w-5 text-white" />
      )}
    </button>
  );
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#020617]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Orionpay Logo"
              width={100}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#4F8CFF]/20 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#0F172A] border-b border-white/5"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3 border-t border-white/5">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-sm font-medium rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
