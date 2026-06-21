export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Adicionei 'items-center' no flex principal abaixo */}
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-9 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between items-center">
        
        <p className="text-center sm:text-left">
          © 2026 TaskFlow. Projeto acadêmico de Desenvolvimento Web.
        </p>
        
        <p className="text-center sm:text-right font-medium">
          Next.js • Firebase Auth • Tailwind CSS
        </p>
        
      </div>
    </footer>
  );
}