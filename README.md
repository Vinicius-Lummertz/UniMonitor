# UniMonitor 🎓

UniMonitor é uma aplicação web moderna para gerenciamento de vida acadêmica, focada em organização de matérias, atividades (provas, trabalhos), notas e calendário.

Construído com **React**, **TypeScript**, **Tailwind CSS**, **Zustand** e **Supabase**.

## 🚀 Funcionalidades

-   **Dashboard:** Visão geral da semana e próximas atividades.
-   **Matérias:** Cadastro de disciplinas com professor, cor personalizada e detalhes.
-   **Calendário:** Visualização mensal e em lista (Agenda) otimizada para mobile.
-   **Atividades:** Gestão completa de provas e trabalhos com controle de prioridade, conclusão, pesos e notas.
-   **Onboarding:** Tutorial interativo para novos usuários.
-   **Localização:** Totalmente em Português (Brasil).

## 🛠️ Tecnologias

-   [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Zustand](https://github.com/pmndrs/zustand) (Gerenciamento de Estado)
-   [Supabase](https://supabase.com/) (Backend & Auth)
-   [React Big Calendar](https://github.com/jquense/react-big-calendar)
-   [Framer Motion](https://www.framer.com/motion/)
-   [Lucide React](https://lucide.dev/) (Ícones)

## 📦 Como Rodar

1.  Clone o repositório:
    ```bash
    git clone https://github.com/Vinicius-Lummertz/UniMonitor.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz com as chaves do seu projeto Supabase:
    ```env
    VITE_SUPABASE_URL=sua_url_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima
    ```
4.  Rode o projeto:
    ```bash
    npm run dev
    ```

## 📱 Mobile Friendly

O layout foi desenhado pensando na experiência mobile, com navegação fluida e componentes responsivos.

---

Desenvolvido por Vinicius Lummertz.
