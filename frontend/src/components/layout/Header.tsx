"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X, Scale, Search, Home } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { compareList } = useCompare();

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/search?jalur=snbp", label: "SNBP", icon: Search },
    { href: "/search?jalur=snbt", label: "SNBT", icon: Search },
    {
      href: "/compare",
      label: "Komparasi",
      icon: Scale,
      badge: compareList.length > 0 ? compareList.length : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-md font-bold group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-none">
                B-SNPMB<span className="text-zinc-400"> EXPLORER</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
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
                      ? "bg-white text-black border-white shadow-sm"
                      : "text-zinc-300 hover:text-white border-transparent hover:border-zinc-800 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-xs font-mono font-bold rounded-full ${
                        isActive ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors focus:outline-none active:scale-95"
              aria-label="Buka Menu Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
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
                    ? "bg-white text-black border-white shadow-md"
                    : "text-zinc-300 hover:bg-zinc-900 border-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full ${
                      isActive ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
