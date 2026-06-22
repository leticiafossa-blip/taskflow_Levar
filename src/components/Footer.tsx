// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-10 mt-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} TaskFlow. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Termos de Uso
          </Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}