'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Star, 
  Wallet, 
  CreditCard, 
  History, 
  FileText, 
  Users, 
  Mic, 
  Shield, 
  TrendingUp, 
  PieChart, 
  Lock, 
  Repeat, 
  DollarSign,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  LineChart,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';
import StellarWalletLoader from '@/src/components/stellar/StellarWalletLoader';

// Chain logos as simple SVGs
const ChainIcons = {
  Stellar: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#050816">
      <circle cx="12" cy="12" r="10" fill="#38BDF8"/>
      <path d="M12 6L14 12L12 18L10 12Z" fill="white"/>
    </svg>
  ),
  Ethereum: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M12 2L5 11L12 15L19 11L12 2Z" fill="#627EEA"/>
      <path d="M5 13L12 17L19 13L12 22L5 13Z" fill="#627EEA"/>
    </svg>
  ),
  Polygon: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <polygon points="12,2 22,7.5 22,16.5 12,22 2,16.5 2,7.5" fill="#8247E5"/>
    </svg>
  ),
  Solana: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M4 14L20 6L18 10L6 18L4 14Z" fill="#14F195"/>
      <path d="M6 10L22 2L20 6L4 14L6 10Z" fill="#9945FF"/>
    </svg>
  ),
};

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, delay = 0 }: { icon: any; title: string; description: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-[#0F172A]/70 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-[#4F8CFF]/50 transition-all duration-500 group hover:shadow-xl hover:shadow-[#4F8CFF]/10"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Main Home Component
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const { theme, setTheme, customColors, updateCustomColors, resetCustomColors } = useTheme();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const stats = [
    { label: "Multi-chain Networks", value: 15, suffix: "+" },
    { label: "Transactions", value: 2500000, suffix: "+" },
    { label: "AI Accuracy", value: 99.9, suffix: "%" },
    { label: "Supported Modules", value: 12, suffix: "" },
  ];

  const chains = [
    { name: "Stellar", icon: ChainIcons.Stellar, color: "#38BDF8" },
    { name: "Ethereum", icon: ChainIcons.Ethereum, color: "#627EEA" },
    { name: "Polygon", icon: ChainIcons.Polygon, color: "#8247E5" },
    { name: "Solana", icon: ChainIcons.Solana, color: "#14F195" },
  ];

  const features = [
    {
      icon: CreditCard,
      title: "Send Payments",
      description: "Initiate cross-chain payments with one click. Support for all major tokens and stablecoins.",
    },
    {
      icon: Wallet,
      title: "Wallet Management",
      description: "Unified dashboard to manage all your crypto wallets in one secure location.",
    },
    {
      icon: FileText,
      title: "Transaction History",
      description: "Comprehensive transaction logs with real-time status updates and explorer links.",
    },
    {
      icon: Users,
      title: "Automated Payroll",
      description: "Schedule bulk payments and payroll disbursements to your entire team.",
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: 'Just say "Send 50 USDC to John" and watch the magic happen with AI voice processing.',
    },
    {
      icon: Shield,
      title: "AI Fraud Detection",
      description: "Advanced machine learning models detect and prevent fraudulent transactions before they occur.",
    },
    {
      icon: TrendingUp,
      title: "Smart Routing",
      description: "AI automatically finds the cheapest and fastest route for your cross-chain transfers.",
    },
    {
      icon: PieChart,
      title: "Price Analysis",
      description: "Real-time market analysis and predictions to help you time your transactions perfectly.",
    },
  ];

  const modules = [
    { name: "Escrow", icon: Lock, description: "Secure multi-signature escrow services" },
    { name: "Payroll", icon: DollarSign, description: "Automated team payroll distribution" },
    { name: "Subscriptions", icon: Repeat, description: "Recurring billing and subscription management" },
    { name: "Split Payments", icon: Activity, description: "Split transactions between multiple parties" },
  ];

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50 text-gray-900' : 
      theme === 'dark' ? 'bg-[#050816] text-white' : 
      'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    }`}>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        theme === 'light' || theme === 'multi-color' ? 'bg-white/80 border-gray-200' : 'bg-[#050816]/80 border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-[#4F8CFF] animate-pulse" />
                <Star className="absolute inset-1 m-auto w-4 h-4 text-[#38BDF8] fill-current" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] bg-clip-text text-transparent">
                OrionPay
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`transition-colors text-sm ${
                theme === 'light' || theme === 'multi-color' ? 'text-gray-700/70 hover:text-gray-900' : 'text-white/70 hover:text-white'
              }`}>Features</a>
              <a href="#how-it-works" className={`transition-colors text-sm ${
                theme === 'light' || theme === 'multi-color' ? 'text-gray-700/70 hover:text-gray-900' : 'text-white/70 hover:text-white'
              }`}>How it Works</a>
              <a href="#ai" className={`transition-colors text-sm ${
                theme === 'light' || theme === 'multi-color' ? 'text-gray-700/70 hover:text-gray-900' : 'text-white/70 hover:text-white'
              }`}>AI Engine</a>
              <a href="#docs" className={`transition-colors text-sm ${
                theme === 'light' || theme === 'multi-color' ? 'text-gray-700/70 hover:text-gray-900' : 'text-white/70 hover:text-white'
              }`}>Documentation</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle Button */}
              <div className="relative">
                <button 
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light' || theme === 'multi-color' 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700/70 hover:text-gray-900' 
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : theme === 'dark' ? <Moon className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
                </button>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl overflow-hidden z-50 border ${
                      theme === 'light' || theme === 'multi-color'
                        ? 'bg-white border-gray-200'
                        : 'bg-[#0F172A] border-white/10'
                    }`}
                  >
                    <button
                      onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === 'light' ? 'text-[#4F8CFF]' : 
                        'text-gray-700/70 hover:text-gray-900 hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light Mode
                    </button>
                    <button
                      onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === 'dark' ? 'text-[#4F8CFF]' : 
                        'text-gray-700/70 hover:text-gray-900 hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark Mode
                    </button>
                    <button
                      onClick={() => { setTheme('multi-color'); setThemeDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === 'multi-color' ? 'text-[#4F8CFF]' : 
                        'text-gray-700/70 hover:text-gray-900 hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5'
                      }`}
                    >
                      <Palette className="w-4 h-4" /> Multi-Color
                    </button>
                    {theme === 'multi-color' && (
                      <button
                        onClick={() => { setCustomizerOpen(!customizerOpen); setThemeDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm border-t border-gray-200 dark:border-white/10 transition-colors text-[#4F8CFF] hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <Palette className="w-4 h-4" /> Customize Colors
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* Custom Color Picker Panel */}
              {customizerOpen && theme === 'multi-color' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="fixed top-20 right-4 w-80 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 z-50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customize Colors</h3>
                    <button 
                      onClick={() => setCustomizerOpen(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/70"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={customColors.primary}
                          onChange={(e) => updateCustomColors({ primary: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input 
                          type="text" 
                          value={customColors.primary}
                          onChange={(e) => updateCustomColors({ primary: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Secondary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={customColors.secondary}
                          onChange={(e) => updateCustomColors({ secondary: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input 
                          type="text" 
                          value={customColors.secondary}
                          onChange={(e) => updateCustomColors({ secondary: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Accent Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={customColors.accent}
                          onChange={(e) => updateCustomColors({ accent: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input 
                          type="text" 
                          value={customColors.accent}
                          onChange={(e) => updateCustomColors({ accent: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Background Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={customColors.background}
                          onChange={(e) => updateCustomColors({ background: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input 
                          type="text" 
                          value={customColors.background}
                          onChange={(e) => updateCustomColors({ background: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Text Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Text Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={customColors.text}
                          onChange={(e) => updateCustomColors({ text: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <input 
                          type="text" 
                          value={customColors.text}
                          onChange={(e) => updateCustomColors({ text: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Reset Button */}
                    <button
                      onClick={resetCustomColors}
                      className="w-full mt-4 py-3 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-white transition-colors"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </motion.div>
              )}
              {/* Connect Wallet Button */}
              <button className={`transition-colors text-sm px-4 py-2 rounded-lg flex items-center gap-2 ${
                theme === 'light' || theme === 'multi-color'
                  ? 'text-gray-700/70 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}>
                <Wallet className="w-4 h-4" /> Connect Wallet
              </button>
              <button className={`transition-colors text-sm px-4 py-2 ${
                theme === 'light' || theme === 'multi-color'
                  ? 'text-gray-700/70 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}>
                Sign In
              </button>
              <button className="bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-white">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-[#0F172A] border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-white/70 hover:text-white">Features</a>
              <a href="#how-it-works" className="block text-white/70 hover:text-white">How it Works</a>
              <a href="#ai" className="block text-white/70 hover:text-white">AI Engine</a>
              <a href="#docs" className="block text-white/70 hover:text-white">Documentation</a>
              <button className="w-full bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-5 py-3 rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F172A] border border-[#4F8CFF]/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-sm text-white/80">Introducing OrionPay AI — Now in Public Beta</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="block">AI-Powered Multi-Chain</span>
            <span className="bg-gradient-to-r from-[#4F8CFF] via-[#8B5CF6] to-[#38BDF8] bg-clip-text text-transparent">
              Payments Built for the Future
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            One dashboard to send payments, automate payroll, detect fraud with AI, analyze crypto prices, execute voice payments, and manage blockchain modules across multiple chains.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto group bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-[#4F8CFF]/20 transition-all flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              View Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Hero Animated Illustration */}
          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative mt-20 max-w-4xl mx-auto"
          >
            <div className="relative w-full aspect-video rounded-3xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Animated Orbit Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="absolute w-3/4 h-3/4 rounded-full border border-[#4F8CFF]/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-1/2 h-1/2 rounded-full border border-[#8B5CF6]/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Center Logo */}
                <div className="relative w-20 h-20">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#8B5CF6] flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Star className="w-8 h-8 text-white fill-white" />
                  </motion.div>
                  {/* Orbiting particles */}
                  <motion.div
                    className="absolute w-3 h-3 rounded-full bg-[#38BDF8]"
                    style={{ left: '50%', top: '-20px', translateX: '-50%' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-[#8B5CF6]"
                    style={{ left: 'calc(50% + 20px)', top: '50%', translateY: '-50%' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Floating UI elements */}
                <motion.div
                  className="absolute top-10 left-10 px-3 py-2 bg-black/40 rounded-lg backdrop-blur-sm text-xs text-white/80"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  💳 Payment Card
                </motion.div>
                <motion.div
                  className="absolute top-20 right-16 px-3 py-2 bg-black/40 rounded-lg backdrop-blur-sm text-xs text-white/80"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  🔗 Wallet Connected
                </motion.div>
                <motion.div
                  className="absolute bottom-16 left-20 px-3 py-2 bg-black/40 rounded-lg backdrop-blur-sm text-xs text-white/80"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  ⛓️ Blockchain Node
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trusted Chains Section */}
      <section id="chains" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by Leading Blockchains</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Seamlessly integrate with the most reliable and widely adopted blockchain networks.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {chains.map((chain, index) => (
              <motion.div
                key={chain.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-[#0F172A]/70 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col items-center gap-4"
                style={{
                  boxShadow: '0 0 0 transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px ${chain.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 transparent';
                }}
              >
                <chain.icon />
                <span className="text-lg font-semibold text-white">{chain.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0F172A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Manage Payments</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Powerful tools and features designed to simplify your multi-chain payment workflow.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Marketplace Modules */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20"
          >
            <h3 className="text-2xl font-bold text-center mb-10">Extension Marketplace</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {modules.map((module, index) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-gradient-to-br from-[#050816] to-[#0F172A] rounded-xl p-5 border border-white/10 hover:border-[#4F8CFF]/40 transition-all duration-300"
                >
                  <module.icon className="w-6 h-6 text-[#38BDF8] mb-3" />
                  <h4 className="font-semibold text-white mb-1">{module.name}</h4>
                  <p className="text-xs text-white/50">{module.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#0F172A]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex lg:flex-col gap-4 lg:gap-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                  <div className="flex-shrink-0 px-4 py-3 bg-[#4F8CFF]/20 rounded-xl text-[#4F8CFF] font-medium">Dashboard</div>
                  <div className="flex-shrink-0 px-4 py-3 text-white/60 hover:text-white transition-colors">Transactions</div>
                  <div className="flex-shrink-0 px-4 py-3 text-white/60 hover:text-white transition-colors">Wallets</div>
                  <div className="flex-shrink-0 px-4 py-3 text-white/60 hover:text-white transition-colors">AI Reports</div>
                </div>

                {/* Main Dashboard Content */}
                <div className="flex-1 space-y-6">
                  {/* Balance Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-sm mb-1">Total Balance</p>
                      <p className="text-2xl font-bold">$124,532.80</p>
                      <p className="text-green-400 text-sm mt-1">+12.5% this month</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-sm mb-1">Pending</p>
                      <p className="text-2xl font-bold">$8,420.00</p>
                      <p className="text-yellow-400 text-sm mt-1">3 transactions</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-sm mb-1">Active Chains</p>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-blue-400 text-sm mt-1">All operational</p>
                    </div>
                  </div>

                  {/* Chart & Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="font-semibold mb-4">Transaction Volume</h4>
                      <div className="h-40 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-[#4F8CFF] to-[#8B5CF6] rounded-t-lg"
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="font-semibold mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        {[
                          { name: "John Doe", amount: "-$50.00 USDC", time: "2 min ago" },
                          { name: "Team Payroll", amount: "-$12,400", time: "1 hour ago" },
                          { name: "Refund", amount: "+$250.00 USDT", time: "3 hours ago" },
                        ].map((tx, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-sm">{tx.name}</p>
                              <p className="text-xs text-white/50">{tx.time}</p>
                            </div>
                            <span className={tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}>{tx.amount}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Alert */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#4F8CFF]/20 border border-[#4F8CFF]/30 rounded-xl p-4 flex items-center gap-4"
                  >
                    <Shield className="w-8 h-8 text-[#38BDF8]" />
                    <div>
                      <p className="font-semibold">AI Fraud Alert Passed</p>
                      <p className="text-sm text-white/60">Last transaction verified by Orion AI with 99.8% confidence</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#0F172A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How OrionPay Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Three simple steps to start sending AI-powered cross-chain payments.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Link your favorite Web3 wallet in seconds. MetaMask, WalletConnect, and more supported.",
                icon: Wallet,
              },
              {
                step: "02",
                title: "Choose Payment",
                description: "Enter amount, select recipient, and choose which blockchain to use for your transaction.",
                icon: CreditCard,
              },
              {
                step: "03",
                title: "AI Optimizes & Sends",
                description: "Our AI finds the optimal route, checks for fraud, and executes your transaction automatically.",
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-[#050816] rounded-2xl p-8 border border-white/5 h-full">
                  <span className="text-6xl font-bold text-white/5">{item.step}</span>
                  <item.icon className="w-10 h-10 text-[#4F8CFF] mt-4 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#4F8CFF] z-10">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm text-[#8B5CF6]">Powered by Orion AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Advanced AI That Works For You</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Our machine learning models analyze every transaction to keep you secure and save you money.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fraud Detection", desc: "99.9% accurate threat detection", icon: Shield },
              { title: "Smart Routing", desc: "Find the cheapest path automatically", icon: TrendingUp },
              { title: "Price Prediction", desc: "ML-powered market forecasts", icon: LineChart },
              { title: "Voice Transactions", desc: "Natural language payments", icon: Mic },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0F172A]/70 backdrop-blur-sm rounded-2xl p-6 border border-[#8B5CF6]/20"
              >
                <item.icon className="w-8 h-8 text-[#8B5CF6] mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Animated AI Network */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 relative h-64 flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-[#4F8CFF]"
                  style={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 120,
                    y: Math.sin((i / 8) * Math.PI * 2) * 120,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#8B5CF6] flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 bg-[#0F172A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stellar Wallet Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Try Our Stellar Wallet
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              Experience the power of Stellar&apos;s blockchain with our integrated wallet. Create an account, receive testnet XLM, and send payments in seconds.
            </p>
            {typeof window !== 'undefined' && <StellarWalletLoader />}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#0F172A] to-[#050816] rounded-3xl p-12 sm:p-16 border border-white/10 overflow-hidden text-center"
          >
            {/* Animated background orbits */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-96 h-96 -top-48 -right-48 rounded-full border border-[#4F8CFF]/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-80 h-80 -bottom-40 -left-40 rounded-full border border-[#8B5CF6]/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to power the future of payments?</h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">Join thousands of companies already using OrionPay to manage their multi-chain payments with AI-powered intelligence.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto group bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-[#4F8CFF]/20 transition-all flex items-center justify-center gap-2">
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/5 transition-all">
                  Read Documentation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-[#4F8CFF]" />
                <Star className="absolute inset-1 m-auto w-4 h-4 text-[#38BDF8] fill-current" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] bg-clip-text text-transparent">OrionPay</span>
            </div>

            <div className="flex items-center gap-8">
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Documentation</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms</a>
            </div>


          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} OrionPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
