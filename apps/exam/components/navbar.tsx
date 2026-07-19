"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, Home } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/leaderboard", label: "লিডারবোর্ড", icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-lg font-bold gradient-text truncate">বেসিক এডুকেশন কেয়ার</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${isActive(href)
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden min-[380px]:block">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
