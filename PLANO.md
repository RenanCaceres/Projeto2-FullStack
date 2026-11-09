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

## ⚖️ 2. Matriz de Divisão de Responsabilidades (50% / 50%)

| Módulo / Épico | Pedro Lucas Sales Larini | Renan Cáceres Anselmo |
| :--- | :--- | :--- |
| **Épico 1: Autenticação & Usuários** | **Fluxo de Cadastro (Full Stack):**<br>• Modelagem da tabela `usuarios`<br>• Hash seguro com `bcrypt`<br>• Validação matemática de CPF (módulo 11) no back<br>• Rota `POST /api/auth/cadastro`<br>• Tela de Cadastro no React com máscaras e erros por campo | **Fluxo de Sessão & JWT (Full Stack):**<br>• Configuração do Pool e JWT (`src/config/`)<br>• Middleware `autenticar.js` (Bearer token)<br>• Rota `POST /api/auth/login` e `GET /api/auth/me`<br>• Criação do `AuthContext` e `useAuth`<br>• Tela de Login e componente `RotaProtegida` |
| **Épico 2: Cadastros Base** | **Módulo de Categorias (Full Stack):**<br>• Tabela `categorias` e constraint UNIQUE<br>• Model e rotas `GET`, `POST`, `PUT`, `DELETE /api/categorias`<br>• Bloqueio de exclusão de categorias com vínculos<br>• Tela de Gestão de Categorias em React (Entrada/Saída) | **Módulo de Fontes/Destinos (Full Stack):**<br>• Tabela `fontes_destinos` e validações de cartão<br>• Model e rotas CRUD de contas e cartões<br>• Validação dos campos de limite e fechamento<br>• Tela de Gestão de Contas e Cartões em React |
| **Épico 3: Lançamentos & Faturas** | **Módulo de Parcelamentos (Full Stack):**<br>• Lógica transacional (`BEGIN...COMMIT`) com pool<br>• Distribuição exata dos centavos de compras parceladas<br>• Agrupamento por UUID (`grupo_parcelamento`)<br>• Modal de cadastro de compra parcelada no React<br>• Exclusão individual vs em lote de parcelas | **Módulo de Lançamentos & Faturas (Full Stack):**<br>• CRUD de lançamentos simples com filtros e paginação<br>• Agregações para totais de receitas, despesas e saldos<br>• Lógica da regra de fechamento/vencimento de faturas (RF9)<br>• Tela de Extrato de Lançamentos com paginação<br>• Tela de Faturas de Cartão com limites no React |
| **Épico 4: Relatórios & Cloud** | **Relatório por Categorias & Back Cloud:**<br>• Endpoint `GET /api/relatorios/categorias`<br>• Queries SQL agregadas com `GROUP BY` e comparativo de período anterior<br>• Componente `<GraficoCategorias />` (Recharts Donut)<br>• Tela de Relatórios de Categorias<br>• Provisionamento do Banco Neon e Deploy da API | **Relatório Fontes, Desafio & Vercel:**<br>• Endpoint `GET /api/relatorios/fontes-destinos`<br>• Endpoint `GET /api/saude-financeira` (Desafio Extra)<br>• Componente `<GraficoFontes />` (Recharts Barras)<br>• Tela do Desafio de Saúde Financeira<br>• Configuração do `vercel.json` e Deploy Front no Vercel |

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

## 🚀 5. Guia de Deploy no Vercel (Passo a Passo)

Como o front-end é uma SPA com rotas no cliente (`react-router-dom`), o arquivo [frontend/vercel.json](file:///home/renan/Documentos/GitHub/Projeto2-FullStack/frontend/vercel.json) já foi criado com as regras de *rewrite* para evitar erros 404 ao recarregar a página.

### Passo a Passo para o Deploy:
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
1. **Branches por História de Usuário**:
   * `git switch main && git pull`
   * `git switch -c feat/pedro-cadastro-usuarios`
   * `git switch -c feat/renan-auth-jwt`
2. **Revisão por Pares (Code Review)**:
   * Antes de mesclar na branch `main`, o integrante abre um Pull Request e o outro revisa o código, testando a funcionalidade localmente.
   * Isso assegura que ambos conhecem detalhadamente todas as linhas do projeto para a apresentação de 10 minutos.
