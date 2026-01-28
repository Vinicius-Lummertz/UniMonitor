# Guia de Configuração do Supabase - UniMonitor

Este guia vai te ajudar a configurar o Supabase passo a passo para o UniMonitor.

## 1️⃣ Criar Conta e Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **Start your project**
3. Faça login com GitHub (recomendado)
4. Clique em **New Project**
5. Preencha:
   - **Name:** UniMonitor
   - **Database Password:** Escolha uma senha forte (GUARDE!)
   - **Region:** Escolha a mais próxima (ex: South America)
6. Clique em **Create new project**
7. Aguarde 2-3 minutos até o projeto estar pronto

## 2️⃣ Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Abra o arquivo `supabase/schema.sql` do projeto
4. Copie **TODO** o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. ✅ Você verá "Success. No rows returned" - está correto!

## 3️⃣ Copiar Credenciais

1. No menu lateral, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie as seguintes informações:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4️⃣ Configurar Variáveis de Ambiente

1. No projeto UniMonitor, crie um arquivo `.env` na raiz
2. Cole as credenciais:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Salve o arquivo

## 5️⃣ Criar Primeiro Usuário

1. Volte ao Supabase **SQL Editor**
2. Execute este comando para criar você e sua namorada:

```sql
-- Usuário 1
INSERT INTO users (username, pin_hash, name, theme, first_login)
VALUES ('seu_usuario', '1234', 'Seu Nome', 'default', true);

-- Usuário 2
INSERT INTO users (username, pin_hash, name, theme, first_login)
VALUES ('namorada', '5678', 'Nome dela', 'default', true);
```

> 💡 **Dica:** Troque `1234` e `5678` pelos PINs que vocês preferirem!

## 6️⃣ Verificar Instalação

1. Vá em **Table Editor** no Supabase
2. Selecione a tabela **users**
3. Você deve ver os 2 usuários criados

## 7️⃣ Testar a Aplicação

1. Rode o projeto:
   ```bash
   npm run dev
   ```

2. Abra http://localhost:5173
3. Faça login com o usuário criado
4. ✅ Se funcionou, parabéns! 🎉

## 🔧 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` está na raiz do projeto
- Certifique-se de que as variáveis começam com `VITE_`
- Reinicie o servidor (`Ctrl+C` e `npm run dev` novamente)

### Erro: "User not found" no login
- Verifique se executou o INSERT do usuário no SQL Editor
- Confira se o username está correto (sem espaços)
- Verifique a tabela users no Table Editor

### Tabelas não aparecem no Supabase
- Execute o schema.sql novamente
- Certifique-se de executar TODO o arquivo, não apenas partes

## 📊 Configurar Storage (Opcional - para uploads)

1. No Supabase, vá em **Storage**
2. Clique em **New bucket**
3. Nome: `materials`
4. Toggle **Public bucket** → ON
5. Clique em **Create bucket**

## 🚀 Deploy para Produção (Vercel)

### Configurar no Vercel

1. Faça login na [Vercel](https://vercel.com)
2. Importe o repositório do GitHub
3. Vá em **Environment Variables**
4. Adicione:
   - `VITE_SUPABASE_URL` = sua URL
   - `VITE_SUPABASE_ANON_KEY` = sua key
5. Clique em **Deploy**

## 🔒 Segurança (Importante!)

### RLS (Row Level Security)

O schema já vem com políticas RLS configuradas. Isso garante que:
- Cada usuário vê apenas seus próprios dados
- Não há acesso cruzado entre contas

### Melhorar Autenticação (Opcional)

Para produção real, considere:

1. **Hash de PIN:**
```typescript
// Usar bcrypt para hash
import bcrypt from 'bcryptjs';
const hashedPin = await bcrypt.hash(pin, 10);
```

2. **Supabase Auth:**
- Usar o sistema de autenticação do Supabase
- Email + senha tradicional

## ✅ Checklist Final

- [ ] Projeto Supabase criado
- [ ] Schema SQL executado
- [ ] Credenciais copiadas
- [ ] Arquivo `.env` configurado
- [ ] Usuários criados no banco
- [ ] Aplicação testada localmente
- [ ] (Opcional) Storage configurado
- [ ] (Opcional) Deploy na Vercel

---

🎉 **Pronto!** Agora vocês podem usar o UniMonitor tranquilamente!

Qualquer dúvida, consulte a [documentação do Supabase](https://supabase.com/docs).
