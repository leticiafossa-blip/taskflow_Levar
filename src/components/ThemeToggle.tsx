"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita o erro de hidratação garantindo que o componente só renderize no cliente
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />; // Espaço vazio enquanto carrega

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
      aria-label="Alternar tema escuro/claro"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}