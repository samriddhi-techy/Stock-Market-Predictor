"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  BarChart3, Star, User, History, MessageSquare,
  LogOut, Settings, TrendingUp, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  user?: { name: string; email: string; avatar?: string };
}

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/watchlist', label: 'Watchlist', icon: Star },
  { href: '/trade-history', label: 'History', icon: History },
  { href: '/chatbot', label: 'AI Assistant', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar({ isAuthenticated, onLogin, onSignup, onLogout, user }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="StockAI home">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              StockAI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" role="menubar" aria-label="Navigation links">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                aria-current={isActive(href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                  isActive(href)
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`User menu for ${user?.name ?? 'user'}`}
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" aria-hidden="true" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onLogin} aria-label="Login to your account">
                  Login
                </Button>
                <Button size="sm" onClick={onSignup} aria-label="Create a new account">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden transition-all duration-200 ease-in-out overflow-hidden',
          isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isMobileOpen}
      >
        <div className="px-4 py-3 space-y-1 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setIsMobileOpen(false); onLogin(); }}>
                Login
              </Button>
              <Button size="sm" className="flex-1" onClick={() => { setIsMobileOpen(false); onSignup(); }}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}