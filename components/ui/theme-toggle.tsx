"use client";

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Analytics } from '@/lib/utils/analytics';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleChange = (t: string) => {
    setTheme(t);
    Analytics.themeChanged(t);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Toggle theme"
          className="h-9 w-9 px-0"
        >
          <Sun
            className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            aria-hidden="true"
          />
          <Moon
            className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => handleChange('light')}
          className="gap-2 cursor-pointer"
          aria-current={theme === 'light' ? 'true' : undefined}
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange('dark')}
          className="gap-2 cursor-pointer"
          aria-current={theme === 'dark' ? 'true' : undefined}
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange('system')}
          className="gap-2 cursor-pointer"
          aria-current={theme === 'system' ? 'true' : undefined}
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
