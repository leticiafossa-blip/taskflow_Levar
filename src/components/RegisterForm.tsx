"use client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerUser } from "@/services/auth.service";

const registerSchema = z.object({ 
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."), 
  email: z.string().min(1, "Informe o e-mail.").email("Informe um e-mail válido."), 
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial."), 
  confirmPassword: z.string().min(1, "Confirme sua senha.") 
}).refine(data => data.password === data.confirmPassword, { 
  message: "As senhas não conferem.", 
  path: ["confirmPassword"] 
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() { 
  const router = useRouter(); 
  const [loading, setLoading] = useState(false); 
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) }); 
  
  async function onSubmit(data: RegisterFormData) { 
    try { 
      setLoading(true); 
      await registerUser({ name: data.name, email: data.email, password: data.password }); 
      toast.success("Conta criada! Enviamos um e-mail de verificação."); 
      router.push("/dashboard"); 
    } catch (error) { 
      console.error(error); 
      toast.error("Não foi possível criar a conta."); 
    } finally { 
      setLoading(false); 
    } 
  }

  const inputClass = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-600 dark:text-white";
  const labelClass = "mb-1 block font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-xl transition-colors">
      <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Criar conta</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Cadastre-se para acessar o TaskFlow e acompanhar suas tarefas.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">Nome</label>
          <input id="name" className={inputClass} placeholder="Seu nome" {...register("name")}/>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className={labelClass} htmlFor="email">E-mail</label>
          <input id="email" type="email" className={inputClass} placeholder="seuemail@exemplo.com" {...register("email")}/>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className={labelClass} htmlFor="password">Senha forte</label>
          <input id="password" type="password" className={inputClass} placeholder="Mínimo 8 caracteres" {...register("password")}/>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>
        
        <div>
          <label className={labelClass} htmlFor="confirmPassword">Confirmar senha</label>
          <input id="confirmPassword" type="password" className={inputClass} placeholder="Repita sua senha" {...register("confirmPassword")}/>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
          {loading && <Loader2 className="animate-spin" size={18}/>} {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Já possui conta? <Link href="/login" className="font-semibold text-blue-700 dark:text-blue-400 hover:underline">Entrar</Link>
      </p>
    </div>
  ); 
}