# 🐦 Mini Twitter

Uma aplicação web inspirada no Twitter, construída com **React 19**, **TypeScript** e **Vite**, com **testes unitários** e **testes E2E**, proposto como teste técnico para vaga de Desenvolvedor Front-end na B2bit.

A aplicação permite que usuários criem contas, publiquem posts, curtam publicações e naveguem por um feed com scroll infinito.

## 📸 Visão Geral

O Mini Twitter consome uma API REST externa. As principais funcionalidades incluem:

- **Autenticação** — Cadastro, login e logout de usuários com JWT
- **Timeline de posts** — Feed público com scroll infinito
- **Criar post** — Usuários autenticados podem publicar novos posts
- **Editar e excluir posts** — Gerenciamento dos próprios posts via modais
- **Curtir posts** — Interação com publicações de outros usuários
- **Busca** — Pesquisa de posts com debounce em tempo real
- **Tema claro/escuro** — Alternância de tema na interface

## 🛠️ Tecnologias

| Categoria            | Tecnologia                                                                        |
| -------------------- | --------------------------------------------------------------------------------- |
| **Framework**        | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)    |
| **Bundler**          | [Vite 7](https://vite.dev/)                                                       |
| **Estilização**      | [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| **Roteamento**       | [React Router DOM v7](https://reactrouter.com/)                                   |
| **Estado servidor**  | [TanStack React Query v5](https://tanstack.com/query)                             |
| **Estado global**    | [Zustand](https://zustand.docs.pmnd.rs/)                                          |
| **HTTP Client**      | [Axios](https://axios-http.com/)                                                  |
| **Validação**        | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)         |
| **Notificações**     | [Sonner](https://sonner.emilkowal.dev/)                                           |
| **Ícones**           | [Lucide React](https://lucide.dev/)                                               |
| **Testes unitários** | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)   |
| **Testes E2E**       | [Playwright](https://playwright.dev/)                                             |

## 💻 Testar a usabilidade (método rápido)

Caso não queira seguir com os passos de clonar o repositório e instalar as dependências, apenas testar a usabilidade do sistema E estiver com a api rodando na porta 3000, você pode acessar a aplicação [clicando aqui](https://mini-twitter-kappa.vercel.app/).

> Caso você abra o projeto e não tenha nenhum post, rode o seed novamente da api para aparecer os dados, é um bug comum.

Caso queira fazer o clone do projeto, é só seguir os passos descritos nas sessões abaixo.

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) **v18 ou superior**
- [npm](https://www.npmjs.com/) (já vem com o Node.js)
- A **API back-end** rodando localmente (por padrão em `http://localhost:3000`)

## 🚀 Primeiras Configurações

> Caso não queira seguir com os passos de clonar o repositório e instalar as dependências, você pode acessar a aplicação [clicando aqui](https://mini-twitter-seven-chi.vercel.app/). E caso opte por essa opção, lembre de estar com sua api rodando localmente.

### 1. Clonar o repositório

```bash
git clone https://github.com/brunoo85/mini-twitter.git
cd mini-twitter
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie (ou edite) o arquivo `.env` na raiz do projeto com a URL da API:

```env
VITE_BASE_URL=http://localhost:3000
```

> Se a variável `VITE_BASE_URL` não for definida, a aplicação usará `http://localhost:3000` como padrão.

### 4. Rodar a aplicação em modo de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em **http://localhost:5173** (porta padrão do Vite).

## 🧪 Testes

### Testes unitários (Vitest)

```bash
# Executar uma vez
npm run test

# Executar em modo watch
npm run test:watch

# Executar com cobertura de código
npm run test:coverage
```

### Testes E2E (Playwright)

```bash
# Executar testes E2E (headless)
npm run e2e

# Executar testes E2E com navegador visível
npm run e2e:headed
```

> Para rodar os testes E2E, é necessário que tanto a **API back-end** quanto o **front-end** estejam em execução.

---

## 📜 Scripts Disponíveis

| Comando                 | Descrição                                    |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Inicia o servidor de desenvolvimento         |
| `npm run build`         | Gera o build de produção                     |
| `npm run preview`       | Visualiza o build de produção localmente     |
| `npm run lint`          | Executa o ESLint no projeto                  |
| `npm run test`          | Executa os testes unitários                  |
| `npm run test:watch`    | Executa os testes em modo watch              |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |
| `npm run e2e`           | Executa os testes E2E (headless)             |
| `npm run e2e:headed`    | Executa os testes E2E com navegador visível  |

---

## 🗂️ Rotas da Aplicação

| Rota     | Página                      | Acesso  |
| -------- | --------------------------- | ------- |
| `/`      | Timeline de posts           | Público |
| `/login` | Login e Cadastro de usuário | Público |

---

## 🔑 Autenticação

A autenticação é baseada em **JWT (JSON Web Token)**:

1. O usuário faz login ou cadastro pela página `/login`
2. O token JWT é armazenado no `localStorage` (`token-user`)
3. Todas as requisições autenticadas enviam o token via header `Authorization: Bearer <token>`
4. Em caso de resposta `401 Unauthorized`, o token é removido e o usuário é redirecionado para a timeline

## 📄 Licença

Este projeto é de uso pessoal/educacional. Sinta-se à vontade para clonar e modificar.
