"use client";
import Link from "next/link";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/services/auth.service";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  async function handleLogout() { await signOutUser(); toast.success("Você saiu da conta."); setOpen(false); }
  const links = user ? [{ href: "/", label: "Início" }, { href: "/dashboard", label: "Dashboard" }] : [{ href: "/", label: "Início" }, { href: "/login", label: "Login" }, { href: "/register", label: "Cadastro" }];
  
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur transition-colors duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-700 dark:text-blue-500">TaskFlow</Link>
        
        <button type="button" className="rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors" onClick={() => setOpen(v => !v)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
        
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {links.map(link => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400">
              {link.label}
            </Link>
          ))}
          {user ? (
            <button type="button" onClick={handleLogout} className="rounded-lg bg-slate-900 dark:bg-slate-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-slate-700 dark:hover:bg-slate-700">
              Sair
            </button>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600">
              <LogIn size={18}/>Entrar
            </Link>
          )}
        </div>
      </nav>
      
      {open && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 md:hidden transition-colors duration-300">
          <div className="flex flex-col gap-2">
            {links.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                {link.label}
              </Link>
            ))}
            {user && (
              <button type="button" onClick={handleLogout} className="rounded-lg bg-slate-900 dark:bg-slate-800 px-4 py-2 font-semibold text-white transition-colors">
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}