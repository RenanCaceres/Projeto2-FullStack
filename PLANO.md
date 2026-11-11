# 📋 Plano de Desenvolvimento Ágil — Projeto 2 (FinanFlow)

> **Disciplina:** Programação Web Full Stack — **UTFPR Câmpus Cornélio Procópio (CP)**  
> **Docente:** Profª. Drª. Juliana Costa-Silva  
> **Livro Base:** *Full Stack: Conceitos Fundamentais* (Capítulo 10)  
> **Equipe:** Pedro Lucas Sales Larini & Renan Cáceres Anselmo  

---

## 🎯 1. Filosofia Ágil: Fatiamento Vertical (Vertical Slicing)

Para garantir que **ambos os integrantes saiam com exatamente o mesmo nível de aprendizado em Full Stack**, este projeto não utiliza a divisão tradicional e desequilibrada em camadas ("um faz só back-end e o outro faz só front-end"). 

Adotamos a prática ágil de **Fatiamento Vertical (*Vertical Slicing*)**, combinada com cerimônias de **Scrum/Kanban** e **Code Review cruzado**:
* Cada integrante é responsável por **fatias funcionais completas de ponta a ponta** (Banco de Dados + API Node.js/Express + Interface React.js + Testes de Integração).
* As funcionalidades foram balanceadas com rigor técnico para que Pedro e Renan construam juntos:
  * Modelagens e consultas SQL complexas;
  * Regras de negócio, validações e autenticação no Back-End;
  * Componentes, hooks, gerenciamento de estado e gráficos no Front-End.

---

## 🗂 2.1 Mapeamento Detalhado: Arquivo por Arquivo e Responsáveis

Para eliminar ambiguidades e evitar conflitos no Git, cada arquivo do projeto tem um responsável primário e uma branch definidos para sua implementação:

| Camada | Arquivo | Responsável | Sprint | Branch | O que será implementado |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **BD** | `backend/database/schema.sql` | **Pedro** | S1 | `feat/sprint1-pedro-cadastro` | Tabelas `usuarios`, constraints UNIQUE, índices e tipos NUMERIC. |
| **BD** | `backend/database/seed.sql` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Dados de carga inicial (2 usuários de teste, categorias e 3 meses de histórico). |
| **Config** | `backend/src/config/db.js` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Pool de conexões do PostgreSQL (`pg`) com suporte a SSL. |
| **Config** | `backend/src/config/jwt.js` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Funções utilitárias de assinatura e verificação do token JWT. |
| **Server** | `backend/src/server.js` | **Ambos (Pair)** | S1 | `dev` | Inicialização do Express, middlewares de CORS/JSON e registro das rotas. |
| **Middlewares** | `backend/src/middlewares/validar.js` | **Pedro** | S1 | `feat/sprint1-pedro-cadastro` | Validação de CPF (módulo 11), máscaras e sanitização de dados. |
| **Middlewares** | `backend/src/middlewares/autenticar.js` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Extração e verificação do cabeçalho `Authorization: Bearer`. |
| **Middlewares** | `backend/src/middlewares/tratarErros.js` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Captura centralizada de erros (PostgreSQL 23505 -> 409, 400, 500). |
| **Models** | `backend/src/models/Usuario.js` | **Pedro** | S1 | `feat/sprint1-pedro-cadastro` | Queries parametrizadas para criação com bcrypt e busca por e-mail. |
| **Models** | `backend/src/models/Categoria.js` | **Pedro** | S2 | `feat/sprint2-pedro-categorias` | Queries de CRUD de categorias e criação do kit padrão. |
| **Models** | `backend/src/models/FonteDestino.js` | **Renan** | S2 | `feat/sprint2-renan-fontes-destinos` | Queries de contas e validações de dados de cartão de crédito. |
| **Models** | `backend/src/models/Lancamento.js` | **Pedro & Renan** | S3 | `feat/sprint3-pedro-parcelamentos` (Pedro)<br>`feat/sprint3-renan-lancamentos-faturas` (Renan) | Transações SQL de parcelamentos (Pedro) e listagem/filtros (Renan). |
| **Models** | `backend/src/models/Relatorio.js` | **Pedro & Renan** | S4 | `feat/sprint4-pedro-relatorio-categorias` (Pedro)<br>`feat/sprint3-renan-lancamentos-faturas` (Renan - faturas)<br>`feat/sprint4-renan-relatorio-fontes-saude` (Renan - fontes/saúde) | Queries `GROUP BY` de categorias (Pedro) e regra de faturas/saúde (Renan). |
| **Routes** | `backend/src/routes/auth.routes.js` | **Pedro & Renan** | S1 | `feat/sprint1-pedro-cadastro` (Pedro)<br>`feat/sprint1-renan-auth-jwt` (Renan) | Endpoint `/cadastro` (Pedro) e endpoints `/login` e `/me` (Renan). |
| **Routes** | `backend/src/routes/categorias.routes.js` | **Pedro** | S2 | `feat/sprint2-pedro-categorias` | Endpoints REST do CRUD de categorias com bloqueio de exclusão. |
| **Routes** | `backend/src/routes/fontesDestinos.routes.js` | **Renan** | S2 | `feat/sprint2-renan-fontes-destinos` | Endpoints REST de contas bancárias e cartões de crédito. |
| **Routes** | `backend/src/routes/lancamentos.routes.js` | **Pedro & Renan** | S3 | `feat/sprint3-pedro-parcelamentos` (Pedro)<br>`feat/sprint3-renan-lancamentos-faturas` (Renan) | Rota de compra parcelada (Pedro) e rota de extrato paginado (Renan). |
| **Routes** | `backend/src/routes/relatorios.routes.js` | **Pedro & Renan** | S4 | `feat/sprint4-pedro-relatorio-categorias` (Pedro)<br>`feat/sprint3-renan-lancamentos-faturas` (Renan - `/faturas`)<br>`feat/sprint4-renan-relatorio-fontes-saude` (Renan - `/fontes-destinos`) | Rota `/relatorios/categorias` (Pedro) e `/faturas` (Renan). |
| **Routes** | `backend/src/routes/saudeFinanceira.routes.js` | **Renan** | S4 | `feat/sprint4-renan-relatorio-fontes-saude` | Endpoint do Desafio de Saúde Financeira (+10 pontos). |
| **Front Config** | `frontend/src/services/api.js` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Instância Axios com interceptors de token e logout automático no 401. |
| **Front Context** | `frontend/src/contexts/AuthContext.jsx` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Provedor global com persistência no `localStorage`. |
| **Front Guard** | `frontend/src/components/RotaProtegida.jsx` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Redirecionamento de usuários não autenticados para `/login`. |
| **Front Base** | `frontend/src/App.jsx` e `main.jsx` | **Ambos (Pair)** | S1 | `dev` | Configuração do React Router e montagem das páginas. |
| **Front Base** | `frontend/src/components/Navbar.jsx` e `Sidebar.jsx` | **Pedro** | S2 | `feat/sprint2-pedro-categorias` | Layout base, cabeçalho e menu lateral responsivo. |
| **Front Base** | `frontend/src/components/Modal.jsx` | **Renan** | S2 | `feat/sprint2-renan-fontes-destinos` | Modal reutilizável para formulários e confirmações. |
| **Front Pages** | `frontend/src/components/pages/CadastroPage.jsx` | **Pedro** | S1 | `feat/sprint1-pedro-cadastro` | Tela de cadastro com máscara de CPF e mensagens de validação. |
| **Front Pages** | `frontend/src/components/pages/LoginPage.jsx` | **Renan** | S1 | `feat/sprint1-renan-auth-jwt` | Tela de login com e-mail/senha e tratamento de 401. |
| **Front Pages** | `frontend/src/components/pages/CategoriasPage.jsx` | **Pedro** | S2 | `feat/sprint2-pedro-categorias` | Tela de gestão de categorias (Entrada/Saída) e feedback de erro. |
| **Front Pages** | `frontend/src/components/pages/FontesDestinosPage.jsx` | **Renan** | S2 | `feat/sprint2-renan-fontes-destinos` | Tela de contas e cartões com limite e datas de fechamento. |
| **Front Pages** | `frontend/src/components/pages/DashboardPage.jsx` | **Ambos (Pair)** | S2 | `dev` | Resumo mensal (receitas, despesas, saldo e atalhos rápidos). |
| **Front Pages** | `frontend/src/components/pages/LancamentosPage.jsx` | **Pedro & Renan** | S3 | `feat/sprint3-pedro-parcelamentos` (Pedro)<br>`feat/sprint3-renan-lancamentos-faturas` (Renan) | Modal de parcelamento (Pedro) e tabela com filtros/paginação (Renan). |
| **Front Pages** | `frontend/src/components/pages/FaturasPage.jsx` | **Renan** | S3 | `feat/sprint3-renan-lancamentos-faturas` | Previsão e histórico de faturas de cartão com barras de limite. |
| **Front Charts** | `frontend/src/components/GraficoCategorias.jsx` | **Pedro** | S4 | `feat/sprint4-pedro-relatorio-categorias` | Gráfico Recharts de pizza/rosca para saídas por categoria. |
| **Front Charts** | `frontend/src/components/GraficoFontes.jsx` | **Renan** | S4 | `feat/sprint4-renan-relatorio-fontes-saude` | Gráfico Recharts de barras para entradas/saídas por conta. |
| **Front Pages** | `frontend/src/components/pages/RelatoriosPage.jsx` | **Pedro** | S4 | `feat/sprint4-pedro-relatorio-categorias` | Painel analítico com filtros de data e comparativo com mês anterior. |
| **Front Pages** | `frontend/src/components/pages/SaudeFinanceiraPage.jsx` | **Renan** | S4 | `feat/sprint4-renan-relatorio-fontes-saude` | Painel do Desafio com Score, métricas e dicas personalizadas. |

> **Legenda das Branches:**
> * **Arquivos individuais (`Pedro` ou `Renan`):** implementar na respectiva branch `feat/sprint*` e abrir PR para `dev`.
> * **Arquivos compartilhados (`Pedro & Renan`):** cada integrante implementa sua parte na própria branch da sprint e integra via PR na `dev`.
> * **Arquivos em dupla (`Ambos (Pair)`):** desenvolver em *pair programming* na branch `dev` (ou atualizar `dev` após integrar as rotas/páginas das branches `feat/*`).

---

## 🏃 3. Cronograma de Sprints (Ciclos Ágeis)

```mermaid
flowchart TD
    S1["Sprint 1: Fundação & Autenticação (RF1, RF2, RF3)"]
    S2["Sprint 2: Cadastros Base & Contas (RF4, RF5)"]
    S3["Sprint 3: Lançamentos, Parcelamentos & Faturas (RF6, RF9)"]
    S4["Sprint 4: Relatórios, Indicadores, Desafio & Deploy (RF7, RF8, Cloud)"]
    
    S1 --> S2 --> S3 --> S4
```

### Sprint 1: Fundação, Modelagem e Autenticação (RF1, RF2 e RF3)
* **Objetivo:** Estabelecer o repositório, subir o banco de dados online e ter login/cadastro funcionando com JWT e rotas protegidas.
* **Tarefas Pedro:**
  * Criar o script DDL da tabela `usuarios` com constraints de unicidade (`schema.sql`);
  * Implementar validação do CPF e regras de normalização de e-mail;
  * Implementar endpoint `POST /api/auth/cadastro` e geração de hash com bcrypt;
  * Criar a página `CadastroPage.jsx` no React com validação e feedbacks do servidor.
* **Tarefas Renan:**
  * Configurar a conexão do pool PostgreSQL (`db.js`) e utilitário JWT (`jwt.js`);
  * Desenvolver o middleware `autenticar.js` para leitura do cabeçalho `Authorization: Bearer`;
  * Implementar endpoints `POST /api/auth/login` e `GET /api/auth/me`;
  * Construir o `AuthContext.jsx`, `RotaProtegida.jsx`, `api.js` (interceptors) e a `LoginPage.jsx`.

### Sprint 2: Cadastros Base e Isolamento Multi-Inquilino (RF4 e RF5)
* **Objetivo:** Permitir cadastro de categorias e fontes de recursos com isolamento estrito por `req.usuarioId`.
* **Tarefas Pedro (Categorias):**
  * Tabela `categorias` e método `Categoria.criarPadrao()` acoplado ao cadastro de usuário;
  * CRUD completo de categorias (`categorias.routes.js` e `Categoria.js`);
  * Regras de unicidade de nome por tipo e trava de integridade contra exclusão com vínculos;
  * Construir a tela `CategoriasPage.jsx` com separação de abas (Entrada / Saída).
* **Tarefas Renan (Fontes e Destinos):**
  * Tabela `fontes_destinos` e método `FonteDestino.criarPadrao()`;
  * CRUD completo de contas e cartões (`fontesDestinos.routes.js` e `FonteDestino.js`);
  * Validações de cartão de crédito (dia_fechamento, dia_vencimento e limite);
  * Construir a tela `FontesDestinosPage.jsx` com cards visuais de contas e cartões.

### Sprint 3: Lançamentos Financeiros, Parcelamento e Faturas (RF6 e RF9)
* **Objetivo:** Movimentações financeiras reais, transações atômicas de compras parceladas e projeção das faturas.
* **Tarefas Pedro (Lançamentos Parcelados & Transações):**
  * Implementação da lógica de compras parceladas com transação SQL (`BEGIN ... COMMIT / ROLLBACK`);
  * Distribuição precisa de centavos e atribuição do `grupo_parcelamento` (UUID);
  * Rota de exclusão com suporte a remoção em lote (`?todasParcelas=true`);
  * Modal de cadastro de despesa parcelada no front-end e diálogo de confirmação de exclusão.
* **Tarefas Renan (Lançamentos Gerais, Filtros & Faturas de Cartão):**
  * Consulta dinâmica de lançamentos com paginação (`LIMIT`/`OFFSET`) e filtros de data/tipo;
  * Implementação da regra matemática de fechamento e previsão de faturas de cartão (RF9);
  * Construção da tela `LancamentosPage.jsx` com filtros e badges de status;
  * Construção da tela `FaturasPage.jsx` com limite utilizado/disponível e cronograma de faturas.

### Sprint 4: Relatórios Analíticos, Desafio de Saúde Financeira e Deploy (RF7, RF8 e Cloud)
* **Objetivo:** Agregações analíticas com gráficos Recharts, desafio extra e disponibilização online.
* **Tarefas Pedro (Relatório por Categorias & Deploy Back):**
  * Implementar endpoint de agregação `GET /api/relatorios/categorias` com comparativo histórico;
  * Criar componente `<GraficoCategorias />` (pizza/donut com Recharts);
  * Construir a aba de categorias na tela `RelatoriosPage.jsx`;
  * Provisionar o banco de dados online gratuito no **Neon** e realizar o deploy do Back-End no **Render**.
* **Tarefas Renan (Relatório por Fontes, Desafio & Deploy Front):**
  * Implementar endpoints `GET /api/relatorios/fontes-destinos` e `GET /api/saude-financeira`;
  * Criar componente `<GraficoFontes />` (barras com Recharts);
  * Construir tela do desafio `SaudeFinanceiraPage.jsx` (Score, indicadores e projeção);
  * Configurar `vercel.json` e realizar o deploy contínuo do Front-End no **Vercel**.

---

## ☁️ 4. Serviços Online Recomendados (100% Gratuitos)

Para disponibilizar a aplicação online sem custos durante o período letivo e apresentação, recomendamos a seguinte infraestrutura moderna:

### 1. Banco de Dados: Neon Serverless PostgreSQL (Recomendado)
* **Link:** [https://neon.tech](https://neon.tech)
* **Por que usar:**
  * Oferece PostgreSQL 16 nativo e gerenciado na nuvem gratuitamente;
  * 0.5 GB de armazenamento permanente (mais que suficiente para centenas de milhares de lançamentos);
  * Fornece string de conexão pronta (`postgres://usuario:senha@ep-...neon.tech/finanflow_db?sslmode=require`), 100% compatível com a biblioteca `pg`;
  * Não "adormece" de forma destrutiva e conta com conexão estável.
* **Alternativa:** [Supabase](https://supabase.com) (500 MB de PostgreSQL gratuito com painel web completo).

### 2. Hospedagem do Back-End (API Node.js/Express): Render
* **Link:** [https://render.com](https://render.com)
* **Por que usar:**
  * Plano **Free Web Service** para aplicações Node.js;
  * Conecta diretamente ao repositório GitHub e faz deploy automático a cada push na branch `main`;
  * Configuração simples de variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`);
  * Suporte nativo a HTTPS gratuito (SSL automático).

### 3. Hospedagem do Front-End: Vercel (Requisito Escolhido)
* **Link:** [https://vercel.com](https://vercel.com)
* **Por que usar:**
  * Plataforma líder mundial em hospedagem de Single Page Applications (React/Vite);
  * CDN global ultrarrápida com certificado SSL automático;
  * Deploy contínuo via GitHub: basta conectar o repositório;
  * Suporte nativo a variáveis de ambiente (`VITE_API_URL`).

---

## 🚀 5. Guia de Deploy e Arquitetura em Nuvem

### ❓ "Conectar o projeto no Vercel já não roda o Back-End?"

Esta é uma dúvida muito comum:
* **Por padrão, NÃO.** O Vercel é primariamente uma plataforma para **Front-End estático e SPAs** (Vite, React, Next.js). Servidores Express tradicionais executam como processos contínuos de longa duração (`app.listen(PORT)` ouvindo requisições 24 horas por dia). O Vercel **não** roda processos contínuos de fundo nesse modelo.
* **É possível rodar o Express no Vercel?** Sim, mas apenas adaptando a API para o modelo **Serverless** (onde o Express é envelopado em funções sob demanda que "acordam" a cada requisição e "dormem" em seguida).
* **Por que o modelo Serverless no Vercel NÃO é o ideal para o Projeto 2:**
  1. **Pool de Conexões:** Funções Serverless criam e destroem conexões a cada chamada, podendo esgotar o limite de conexões do banco de dados relacional.
  2. **Rate Limiting em Memória:** O `express-rate-limit` (requisito de segurança) guarda as tentativas em memória RAM. Em funções serverless efêmeras, essa proteção em memória perde o estado entre chamadas.
  3. **Conformidade com a Disciplina:** O livro didático da Profª Juliana (Capítulos 10 e 11) ensina a arquitetura cliente-servidor tradicional com servidor Node.js/Express rodando via `app.listen()`.

### 💡 A Solução Ideal Adotada:
* **Front-End (React/Vite) no Vercel:** Hospedagem gratuita de altíssima velocidade com CDN global e HTTPS automático.
* **Back-End (Node.js/Express) no Render (ou Railway):** Hospedagem gratuita de **Web Service contínuo**, onde o servidor Express roda exatamente como ensinado na disciplina (`npm start` com `app.listen(PORT)` e pool de conexões persistente).
* **Banco de Dados no Neon:** PostgreSQL gerenciado na nuvem gratuito com conexão pronta para o Render.

---

### Passo a Passo para o Deploy no Vercel (Front-End):
1. **Subir o código para o GitHub**:
   ```bash
   git add .
   git commit -m "feat: estrutura inicial completa do FinanFlow"
   git push origin main
   ```
2. **Importar o Projeto no Vercel**:
   * Acesse [vercel.com](https://vercel.com) e faça login com a conta do GitHub.
   * Clique em **"Add New..."** > **"Project"**.
   * Localize o repositório `Projeto2-FullStack` e clique em **"Import"**.
3. **Configurar o Root Directory**:
   * No campo **"Root Directory"**, clique em *Edit* e selecione a pasta `frontend`.
   * O Vercel detectará automaticamente o framework como **Vite**.
4. **Adicionar a Variável de Ambiente**:
   * Na seção **"Environment Variables"**, adicione:
     * **Name:** `VITE_API_URL`
     * **Value:** `https://sua-api-no-render.onrender.com/api` (URL pública da API back-end gerada no Render).
5. **Realizar o Deploy**:
   * Clique no botão **"Deploy"**.
   * Em menos de 1 minuto a aplicação estará online e acessível publicamente através de uma URL `.vercel.app`.

---

## 🔄 6. Fluxo Git e Prevenção de Conflitos

Para manter a harmonia do desenvolvimento ágil sem conflitos de mesclagem (*merge conflicts*):
1. **Estrutura de Branches**:
   * `main`: branch de produção/entrega (deploy contínuo no Vercel e Render).
   * `dev`: branch de integração das sprints e desenvolvimento de arquivos em *pair programming* (`Ambos (Pair)`).
   * **Branches por Sprint e Integrante**:
     * **Sprint 1:** `feat/sprint1-pedro-cadastro` (Pedro) e `feat/sprint1-renan-auth-jwt` (Renan)
     * **Sprint 2:** `feat/sprint2-pedro-categorias` (Pedro) e `feat/sprint2-renan-fontes-destinos` (Renan)
     * **Sprint 3:** `feat/sprint3-pedro-parcelamentos` (Pedro) e `feat/sprint3-renan-lancamentos-faturas` (Renan)
     * **Sprint 4:** `feat/sprint4-pedro-relatorio-categorias` (Pedro) e `feat/sprint4-renan-relatorio-fontes-saude` (Renan)
2. **Sincronização antes de iniciar uma tarefa**:
   * `git switch dev && git pull`
   * `git switch feat/sprint1-pedro-cadastro && git merge dev` *(exemplo da S1 do Pedro; usar a branch correspondente à sprint)*
   * `git switch feat/sprint1-renan-auth-jwt && git merge dev` *(exemplo da S1 do Renan)*
3. **Revisão por Pares (Code Review) e Promoção**:
   * Ao concluir uma tarefa, o integrante abre um Pull Request da sua branch `feat/sprint*` para a branch `dev`, e o outro revisa o código e testa localmente antes do merge.
   * Ao final de cada sprint, após validar a integração na `dev`, realiza-se o Pull Request de `dev` para `main`.
   * Isso assegura que ambos conhecem detalhadamente todas as linhas do projeto para a apresentação de 10 minutos.
