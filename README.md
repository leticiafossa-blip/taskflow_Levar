# TaskFlow — Entrega Parcial 1

Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web.

Esta entrega parcial contempla o **sistema de login completo** do projeto TaskFlow, utilizando **Next.js**, **TypeScript**, **Tailwind CSS** e **Firebase Authentication**.

## Funcionalidades da Entrega Parcial 1

- Landing page inicial;
- Menu responsivo;
- Footer institucional;
- Call to action;
- Mockup de demonstração do sistema;
- Cadastro de usuário com nome, e-mail, senha e confirmação de senha;
- Validação com React Hook Form e Zod;
- Login com e-mail e senha;
- Login com Google;
- Login com GitHub;
- Envio de e-mail de verificação;
- Rota protegida `/dashboard`;
- Exibição dos dados do usuário autenticado;
- Logout;
- Exclusão da conta do usuário autenticado;
- Feedback visual com Sonner.

## Tecnologias utilizadas

- Next.js com App Router;
- React;
- TypeScript;
- Tailwind CSS;
- Firebase Authentication;
- Firebase Firestore preparado para próximas etapas;
- React Hook Form;
- Zod;
- Sonner;
- Lucide React;
- Next Themes.

## Configuração do Firebase

Crie um projeto no Firebase e ative os provedores de autenticação:

- Email/senha;
- Google;
- GitHub.

Depois crie um arquivo `.env.local` na raiz do projeto com as variáveis do Firebase. Use o arquivo `.env.local.example` como modelo.

## Como executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Rotas principais

```txt
/            Landing page
/login       Login
/register    Cadastro
/dashboard   Área protegida
```

## Observação sobre exclusão de conta

A exclusão da conta utiliza o método `deleteUser` do Firebase Authentication. Por segurança, o Firebase pode exigir login recente para excluir uma conta. Caso isso aconteça, o sistema exibirá uma mensagem orientando o usuário a sair e entrar novamente antes de tentar excluir.
