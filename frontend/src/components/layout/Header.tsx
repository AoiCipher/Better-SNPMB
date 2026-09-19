"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X, Scale, Search, Home, FileText, Sun, Moon } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { compareList } = useCompare();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/search", label: "Cek Data", icon: Search },
    {
      href: "/compare",
      label: "Komparasi",
      icon: Scale,
      badge: compareList.length > 0 ? compareList.length : undefined,
    },
    { href: "/docs", label: "API Docs", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/75 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-zinc-800/80 shadow-xs dark:shadow-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md font-bold group-hover:scale-105 transition-all">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight block leading-none">
                B-SNPMB<span className="text-slate-500 dark:text-zinc-400"> EXPLORER</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono tracking-widest uppercase">
                BETTER SNPMB DATA EXPLORER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href.startsWith("/search") && pathname === "/search");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-sm"
                      : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border-transparent hover:border-slate-200 dark:hover:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-xs font-mono font-bold rounded-full ${
                        isActive
                          ? "bg-white text-slate-900 dark:bg-black dark:text-white"
                          : "bg-slate-900 text-white dark:bg-white dark:text-black"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="ml-1 p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-all flex items-center justify-center focus:outline-none"
              title={isDark ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="https://github.com/AoiCipher/Better-SNPMB"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-all flex items-center gap-2"
              title="Open Source di GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </nav>

          {/* Mobile Hamburger Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 transition-colors focus:outline-none active:scale-95"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 transition-colors focus:outline-none active:scale-95"
              aria-label="Buka Menu Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href.startsWith("/search") && pathname === "/search");

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3.5 rounded-xl text-base font-semibold transition-all flex items-center justify-between border ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-md"
                    : "text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 border-slate-200/60 dark:border-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full ${
                      isActive
                        ? "bg-white text-slate-900 dark:bg-black dark:text-white"
                        : "bg-slate-900 text-white dark:bg-white dark:text-black"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <a
            href="https://github.com/AoiCipher/Better-SNPMB"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-3.5 rounded-xl text-base font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 transition-all flex items-center gap-3 mt-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub Repository</span>
          </a>
        </div>
      )}
    </header>
  );
}
