# 🚀 TaskFlow - Gestor de Tarefas

O **TaskFlow** é uma aplicação completa de gerenciamento de tarefas desenvolvida para ajudar os usuários a organizarem suas rotinas diárias. Construída com um ecossistema moderno, a aplicação conta com Dashboard de métricas, Quadro Kanban e Calendário de prazos, além de garantir suporte a acessibilidade (VLibras) e Dark Mode nativo.

## 🛠️ Stack Tecnológico

* **Framework:** Next.js (App Router) + React
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Componentes Visuais:** Aceternity UI, Tremor, Framer Motion
* **Funcionalidades:** Dnd Kit (Kanban), FullCalendar, React Hook Form + Zod, Sonner (Notificações)
* **Backend & DB:** Firebase Authentication e Cloud Firestore

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18.x ou superior)
* [Git](https://git-scm.com/)
* Uma conta no [Firebase](https://firebase.google.com/) para configurar seu banco de dados.

## 📦 Guia de Instalação e Execução

Siga o passo a passo abaixo para rodar o projeto localmente:

**1. Clone o repositório:**
bash
git clone [https://github.com/leticiafossa-blip/taskflow_Levar.git](https://github.com/leticiafossa-blip/taskflow_Levar.git)
cd taskflow_Levar

2. Instale as dependências:
Bash
npm install

3. Configure as Variáveis de Ambiente: Crie um arquivo chamado .env.local na raiz do projeto e adicione as suas chaves do Firebase:
Snippet de código
NEXT_PUBLIC_FIREBASE_API_KEY="SUA_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="SEU_APP_ID"

(Importante: Você também precisa habilitar os provedores de Email/Senha, Google e GitHub no painel de Authentication do seu projeto Firebase, além de criar uma base de dados no Firestore em modo teste/produção).
4. Execute a aplicação em ambiente de desenvolvimento:
Bash
npm run dev

5. Acesse o sistema: Abra o seu navegador e acesse http://localhost:3000
👥 Desenvolvedores
Mateus Juil Vargas
Letícia Barcellos
