"use client";
import Link from "next/link";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/services/auth.service";
import { toast } from "sonner";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  async function handleLogout() { await signOutUser(); toast.success("Você saiu da conta."); setOpen(false); }
  const links = user ? [{ href: "/", label: "Início" }, { href: "/dashboard", label: "Dashboard" }] : [{ href: "/", label: "Início" }, { href: "/login", label: "Login" }, { href: "/register", label: "Cadastro" }];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-700">TaskFlow</Link>
        <button type="button" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" onClick={() => setOpen(v => !v)} aria-label="Abrir menu">{open ? <X /> : <Menu />}</button>
        <div className="hidden items-center gap-4 md:flex">
          {links.map(link => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">{link.label}</Link>)}
          {user ? <button type="button" onClick={handleLogout} className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700">Sair</button> : <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"><LogIn size={18}/>Entrar</Link>}
        </div>
      </nav>
      {open && <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden"><div className="flex flex-col gap-2">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">{link.label}</Link>)}{user && <button type="button" onClick={handleLogout} className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">Sair</button>}</div></div>}
    </header>
  );
}
