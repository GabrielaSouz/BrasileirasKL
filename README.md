# 🇧🇷 Serviços para Brasileiras em Kuala Lumpur

Plataforma web criada para que brasileiras que moram em **Kuala Lumpur** possam **indicar, encontrar e compartilhar serviços** de forma simples e organizada.

O projeto tem como objetivo fortalecer a comunidade, facilitando o acesso a serviços confiáveis como beleza, alimentação, aulas particulares, manutenção, entre outros.

---

## 🚀 Tecnologias utilizadas

- **React**
- **Next.js**
- **Tailwind CSS**
- **Supabase** (autenticação e banco de dados)
- **Resend** (envio de e-mails)
- **Lucide Icons**

---

## ✨ Funcionalidades

- Cadastro e login de usuários
- Cadastro de categoria
- Cadastro de serviço
- Indicação de serviços pela comunidade
- Listagem de serviços por categoria
- Área administrativa para gerenciamento
- Interface responsiva e moderna

---

## 🖥️ Preview do projeto

![Preview do projeto](./public/preview.jpg)

> 💡 A imagem acima mostra a interface principal da aplicação.

---

## 📦 Como rodar o projeto localmente

```bash
# Clone o repositório
git clone https://github.com/GabrielaSouz/Service-tips.git

# Entre na pasta
cd Service-tips

# Instale as dependências
npm install

# Rode o projeto
npm run dev

##Tabelas
- categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
- services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  phone VARCHAR(50),
  link TEXT,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

##NextAuth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

##Variaveis de ambiente
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui
DATABASE_URL=postgresql://...

Rodar no terminal: 
npx auth secret