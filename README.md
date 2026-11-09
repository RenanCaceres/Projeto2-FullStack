# 💰 FinanFlow — Controle Financeiro Pessoal

<p align="center">
  <strong>Projeto 2 — Disciplina de Programação Web Full Stack</strong><br>
  Universidade Tecnológica Federal do Paraná — UTFPR Câmpus Cornélio Procópio (CP)
</p>

<p align="center">
  ⚡ Node.js &nbsp;•&nbsp; 🚀 Express &nbsp;•&nbsp; ⚛️ React &nbsp;•&nbsp; 🐘 PostgreSQL &nbsp;•&nbsp; 🔐 JWT &nbsp;•&nbsp; 📊 Recharts
</p>

---

## 🎓 Contexto Acadêmico e Referência Bibliográfica

Este projeto foi desenvolvido como trabalho avaliativo prático (**Projeto 2**) na disciplina de **Programação Web Full Stack** da **Universidade Tecnológica Federal do Paraná (UTFPR) — Câmpus Cornélio Procópio**.

A concepção, especificação técnica, regras de negócio e critérios de qualidade foram estruturados com base direta no **Capítulo 10 (*Projeto 2 - Aplicação Full Stack de Controle Financeiro*)** do livro didático da disciplina:

* **Livro:** *Full Stack: Conceitos Fundamentais*
* **Autora e Docente:** **Profª. Drª. Juliana Costa-Silva**
  * 📧 E-mail: [julianacsilva@utfpr.edu.br](mailto:julianacsilva@utfpr.edu.br)
  * 🐙 GitHub: [@costasilvati](https://github.com/costasilvati)
  * 📖 Livro Online: [Capítulo 10 — Projeto 2 (Aplicação Full Stack de Controle Financeiro)](https://costasilvati.github.io/fullStack/projeto-2.html)

---

### 👨‍💻 Autores / Equipe

| Integrante | GitHub / Contato | Participação no Projeto |
| :--- | :--- | :--- |
| **Pedro Lucas Sales Larini** | [![GitHub](https://img.shields.io/badge/GitHub-PedroLarini-181717?style=flat&logo=github)](https://github.com/PedroLarini) | Modelagem de dados, arquitetura da API em Express, conexão com banco via pool, transações SQL (ACID), lógica de parcelamento e cálculo das faturas de cartão de crédito. |
| **Renan Cáceres Anselmo** | [![GitHub](https://img.shields.io/badge/GitHub-RenanCaceres-181717?style=flat&logo=github)](https://github.com/RenanCaceres) | Arquitetura SPA em React, gerenciamento de estado global com `AuthContext`, cliente HTTP centralizado com interceptores JWT, telas de relatórios, gráficos e documentação. |

---

## 📌 Sumário

1. [Visão Geral](#-visão-geral)
2. [Arquitetura da Aplicação](#-arquitetura-da-aplicação)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Modelo de Dados](#-modelo-de-dados)
5. [Requisitos Funcionais (RF)](#-requisitos-funcionais-rf)
6. [Rotas da API REST](#-rotas-da-api-rest)
7. [Padrão de Respostas de Erro](#-padrão-de-respostas-de-erro)
8. [Requisitos Não Funcionais e Segurança](#-requisitos-não-funcionais-e-segurança)
9. [Estrutura de Pastas do Projeto](#-estrutura-de-pastas-do-projeto)
10. [Instalação e Execução](#-instalação-e-execução)
11. [Checklist Final do Grupo](#-checklist-final-do-grupo)

---

## 💡 Visão Geral

O **FinanFlow** é uma aplicação completa de **Controle Financeiro Pessoal**, integrando uma **API RESTful** robusta em **Node.js/Express** com persistência em banco de dados relacional e uma **Single Page Application (SPA)** moderna e reativa construída com **React.js**.

A aplicação permite ao usuário gerenciar com precisão seu fluxo financeiro mensal:
* Registrar movimentações de **entrada** (salários, rendimentos, vendas) e **saída** (despesas fixas e variáveis);
* Organizar finanças por **categorias** personalizáveis;
* Cadastrar diferentes **fontes e destinos** de recursos (contas bancárias, carteiras físicas e múltiplos cartões de crédito);
* Gerenciar **compras parceladas**, com cálculo automático da distribuição de centavos e projeção de faturas futuras com base no dia de fechamento e vencimento;
* Visualizar **relatórios analíticos** com gráficos e comparativos percentuais;
* Acompanhar a **saúde financeira** por meio de indicadores consolidados.

---

## 🏛 Arquitetura da Aplicação

A solução implementa o padrão clássico **Cliente-Servidor** desacoplado:

```
┌───────────────────────────────┐        HTTP + JSON (REST)        ┌───────────────────────────────┐
│     Front-End (React SPA)     │ ───────────────────────────────► │    Back-End (Node/Express)    │
│                               │ ◄─────────────────────────────── │                               │
│  • React Router               │     Authorization: Bearer <JWT>  │  • Router / Controladores     │
│  • AuthContext (JWT)          │                                  │  • Middlewares (Auth, Erros)  │
│  • Services (Axios / Fetch)   │                                  │  • Models (Acesso ao Banco)   │
│  • Recharts / Gráficos        │                                  │  • Validação & Sanitização    │
└───────────────────────────────┘                                  └───────────────┬───────────────┘
                                                                                   │
                                                                       Pool de     │ Driver nativo
                                                                     Conexões SQL  │ (Consultas Parametrizadas)
                                                                                   ▼
                                                                   ┌───────────────────────────────┐
                                                                   │    Banco de Dados SQL         │
                                                                   │    (PostgreSQL / MySQL)       │
                                                                   │                               │
                                                                   │  • Constraints (FK, UNIQUE)   │
                                                                   │  • Agregações (SUM, GROUP BY) │
                                                                   │  • Transações ACID            │
                                                                   └───────────────────────────────┘
```

---

## ⚡ Tecnologias Utilizadas

### Back-End
* **Node.js**: Ambiente de execução assíncrono baseado no motor V8 do JavaScript.
* **Express.js**: Framework web para criação de rotas, middlewares e APIs REST.
* **PostgreSQL / MySQL**: Banco de dados relacional com integridade referencial estrita e tipos numéricos de ponto fixo.
* **node-postgres (`pg`) / mysql2**: Driver nativo de alto desempenho com suporte a pool de conexões.
* **jsonwebtoken (JWT)**: Autenticação stateless baseada em tokens com tempo de expiração.
* **bcrypt / bcryptjs**: Algoritmo seguro de derivação de chave e hash com salt para senhas.
* **express-rate-limit**: Middleware de rate limiting para proteção contra ataques de força bruta.
* **cors**: Gerenciamento de cabeçalhos de *Cross-Origin Resource Sharing*.
* **dotenv**: Gestão de variáveis de ambiente.

### Front-End
* **React.js**: Biblioteca declarativa e baseada em componentes para interfaces web.
* **Vite**: Ferramenta de build moderna e veloz para aplicações front-end.
* **React Router**: Roteamento dinâmico no cliente com proteção de rotas privadas.
* **Context API & Hooks**: Gerenciamento do estado global de autenticação (`AuthContext`) e ciclo de vida (`useState`, `useEffect`, `useReducer`, `useMemo`).
* **Axios / Fetch Interceptors**: Cliente HTTP único para anexação automática de cabeçalho `Bearer` e interceptação centralizada de status `401 Unauthorized`.
* **Recharts**: Biblioteca de visualização de dados e gráficos SVG (rosca, pizza e barras).
* **CSS Modules / Styled Components**: Estilização modularizada e responsiva.

---

## 🗄 Modelo de Dados

O banco de dados foi modelado respeitando a integridade referencial, constraints de unicidade (`UNIQUE`), checagens de validação (`CHECK`) e tipos numéricos precisos (`NUMERIC(12, 2)`) para evitar problemas de arredondamento de ponto flutuante com dinheiro.

### Diagrama Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    USUARIOS ||--o{ CATEGORIAS : possui
    USUARIOS ||--o{ FONTES_DESTINOS : possui
    USUARIOS ||--o{ LANCAMENTOS : registra
    CATEGORIAS ||--o{ LANCAMENTOS : classifica
    FONTES_DESTINOS ||--o{ LANCAMENTOS : vincula

    USUARIOS {
        int id PK
        string nome
        string email UK
        string cpf UK
        string senha_hash
        datetime criado_em
    }

    CATEGORIAS {
        int id PK
        int usuario_id FK
        string nome
        string tipo
    }

    FONTES_DESTINOS {
        int id PK
        int usuario_id FK
        string nome
        string tipo
        int dia_fechamento
        int dia_vencimento
        numeric limite
    }

    LANCAMENTOS {
        int id PK
        int usuario_id FK
        string tipo
        string descricao
        numeric valor
        date data
        int categoria_id FK
        int fonte_destino_id FK
        int parcela_atual
        int total_parcelas
        uuid grupo_parcelamento
        datetime criado_em
    }
```

### Script de Criação (DDL PostgreSQL)

```sql
-- Criação da tabela de Usuários
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  cpf         VARCHAR(11)  NOT NULL,
  senha_hash  VARCHAR(255) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_usuarios_email_lower ON usuarios (LOWER(email));
CREATE UNIQUE INDEX idx_usuarios_cpf ON usuarios (cpf);

-- Criação da tabela de Categorias
CREATE TABLE categorias (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome        VARCHAR(50) NOT NULL,
  tipo        VARCHAR(7)  NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  CONSTRAINT uq_categoria_usuario_tipo_nome UNIQUE (usuario_id, tipo, nome)
);

-- Criação da tabela de Fontes e Destinos
CREATE TABLE fontes_destinos (
  id              SERIAL PRIMARY KEY,
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome            VARCHAR(50) NOT NULL,
  tipo            VARCHAR(15) NOT NULL CHECK (tipo IN ('renda', 'conta', 'cartao_credito')),
  dia_fechamento  SMALLINT CHECK (dia_fechamento BETWEEN 1 AND 31),
  dia_vencimento  SMALLINT CHECK (dia_vencimento BETWEEN 1 AND 31),
  limite          NUMERIC(12, 2) CHECK (limite >= 0),
  CONSTRAINT uq_fonte_destino_usuario_nome UNIQUE (usuario_id, nome)
);

-- Criação da tabela de Lançamentos
CREATE TABLE lancamentos (
  id                  SERIAL PRIMARY KEY,
  usuario_id          INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo                VARCHAR(7)     NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  descricao           VARCHAR(120)   NOT NULL,
  valor               NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
  data                DATE           NOT NULL,
  categoria_id        INTEGER NOT NULL REFERENCES categorias(id),
  fonte_destino_id    INTEGER NOT NULL REFERENCES fontes_destinos(id),
  parcela_atual       SMALLINT NOT NULL DEFAULT 1,
  total_parcelas      SMALLINT NOT NULL DEFAULT 1 CHECK (total_parcelas BETWEEN 1 AND 48),
  grupo_parcelamento  UUID,
  criado_em           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lancamentos_usuario_data ON lancamentos (usuario_id, data);
```

---

## 🎯 Requisitos Funcionais (RF)

| ID | Requisito | Detalhes e Regras de Negócio |
| :--- | :--- | :--- |
| **RF1** | **Cadastro de Usuário** | Validação no servidor de nome, e-mail, senha e CPF (com algoritmo oficial dos 2 dígitos verificadores). Normalização de e-mail (`trim().toLowerCase()`) e CPF (somente dígitos). Unicidade garantida por índice único no banco de dados. Ao cadastrar, cria automaticamente categorias padrão e uma conta inicial. |
| **RF2** | **Login e Logout** | Autenticação via e-mail e senha. Resposta genérica em caso de falha (`401 Unauthorized`) para evitar enumeração de usuários. Retorno de token JWT assinado com chave secreta e expiração. Logout por descarte seguro no front-end e redirecionamento caso o token expire. |
| **RF3** | **Isolamento de Dados (Multi-inquilino)** | Requisito transversal de segurança: todas as consultas filtram obrigatoriamente por `usuario_id = req.usuarioId` extraído do payload do token JWT. É terminantemente proibido aceitar o `usuario_id` via parâmetro de URL ou corpo da requisição. Tentativas de acesso a registros alheios retornam `404 Not Found`. |
| **RF4** | **CRUD de Categorias** | Gerenciamento de categorias de entrada e saída. Não permite nomes duplicados para o mesmo tipo/usuário (`409 Conflict`). Bloqueio estrito de exclusão caso haja lançamentos vinculados. |
| **RF5** | **CRUD de Fontes/Destinos** | Cadastro de contas correntes, poupanças, carteiras e cartões de crédito. Se o tipo for `cartao_credito`, os campos `dia_fechamento`, `dia_vencimento` e `limite` tornam-se estritamente obrigatórios. Bloqueio de exclusão de registros com movimentações associadas. |
| **RF6** | **CRUD de Lançamentos** | Lançamentos de entrada e saída com validação de posse da categoria e da conta. Suporte a **compras parceladas no cartão de crédito** (1 a 48 vezes): criação atômica via transação SQL (`BEGIN ... COMMIT`) de todas as parcelas com o mesmo `grupo_parcelamento` (UUID), distribuição exata dos centavos na primeira parcela. Listagem com filtros por data, categoria, conta e paginação. |
| **RF7** | **Relatório por Categoria** | Agregação calculada diretamente no banco de dados (`GROUP BY`, `SUM`) para o período selecionado. Retorna totais absolutos, percentual de cada categoria sobre as saídas, comparativo com o período anterior e exibição em gráficos interativos. |
| **RF8** | **Relatório por Fonte/Destino** | Totais de entradas agrupadas por fonte e saídas agrupadas por destino. Apresenta o saldo resultante de cada conta no período filtrado acompanhado de gráficos comparativos. |
| **RF9** | **Previsão de Faturas de Cartão** | Projeção da fatura aberta e das faturas futuras (mínimo de 3 meses). Aplica a **regra de fechamento** (compras no dia de fechamento ou após entram na fatura do mês seguinte; ajuste para o último dia de meses menores). Exibe limite comprometido e limite disponível restante. |
| **EXTRA** | **Página de Saúde Financeira** | Desafio opcional: consolidação de indicadores (taxa de poupança, comprometimento de renda com dívidas e gastos essenciais vs. supérfluos), projeções futuras com gráficos e dicas automatizadas. |

---

## 📡 Rotas da API REST

Todas as rotas sob o prefixo `/api`, exceto cadastro e login, requerem a passagem do token JWT no cabeçalho: `Authorization: Bearer <token>`.

| Método | Rota | Descrição | Códigos HTTP |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/cadastro` | Registra novo usuário no sistema | `201`, `400`, `409` |
| `POST` | `/api/auth/login` | Autentica usuário e retorna token JWT | `200`, `400`, `401` |
| `GET` | `/api/auth/me` | Retorna dados do usuário autenticado | `200`, `401` |
| `GET` | `/api/categorias` | Lista as categorias do usuário | `200`, `401` |
| `POST` | `/api/categorias` | Cadastra nova categoria | `201`, `400`, `409` |
| `PUT` | `/api/categorias/:id` | Atualiza uma categoria | `200`, `400`, `404`, `409` |
| `DELETE` | `/api/categorias/:id` | Remove uma categoria (se não tiver vínculos) | `204`, `404`, `409` |
| `GET` | `/api/fontes-destinos` | Lista fontes e destinos cadastrados | `200`, `401` |
| `POST` | `/api/fontes-destinos` | Cadastra nova fonte ou destino | `201`, `400`, `409` |
| `PUT` | `/api/fontes-destinos/:id` | Atualiza fonte/destino | `200`, `400`, `404`, `409` |
| `DELETE` | `/api/fontes-destinos/:id` | Remove fonte/destino | `204`, `404`, `409` |
| `GET` | `/api/lancamentos` | Lista lançamentos com filtros e paginação | `200`, `400`, `401` |
| `POST` | `/api/lancamentos` | Registra lançamento (gera parcelas se cartão) | `201`, `400`, `404` |
| `GET` | `/api/lancamentos/:id` | Retorna detalhes de um lançamento | `200`, `404` |
| `PUT` | `/api/lancamentos/:id` | Atualiza lançamento existente | `200`, `400`, `404` |
| `DELETE` | `/api/lancamentos/:id` | Exclui lançamento (`?todasParcelas=true`) | `204`, `404` |
| `GET` | `/api/relatorios/categorias` | Relatório agrupado de saídas/entradas por categoria | `200`, `400`, `401` |
| `GET` | `/api/relatorios/fontes-destinos`| Relatório agrupado por fonte/destino e saldos | `200`, `400`, `401` |
| `GET` | `/api/relatorios/faturas` | Previsão e histórico de faturas de cartão (`?meses=3`)| `200`, `401` |
| `GET` | `/api/saude-financeira` | Indicadores de saúde financeira e recomendações | `200`, `401` |

---

## ⚠️ Padrão de Respostas de Erro

Para que o front-end possa apresentar feedbacks claros e destacar os campos exatos do formulário onde ocorreram falhas, a API adota uma estrutura homogênea de retorno para erros `400 Bad Request` e `409 Conflict`:

```json
{
  "erro": "Dados inválidos.",
  "campos": {
    "valor": "O valor deve ser maior que zero.",
    "categoriaId": "A categoria informada é de entrada, mas o lançamento é de saída."
  }
}
```

---

## 🔒 Requisitos Não Funcionais e Segurança

* **Segurança e OWASP**:
  * Consultas 100% parametrizadas através de *Prepared Statements* em todas as interações SQL para neutralizar **SQL Injection**;
  * Senhas hasheadas e salgadas com **bcrypt** (fator de custo 10) — o campo `senha_hash` nunca é retornado em respostas da API;
  * Rate limiting configurado na rota `/api/auth/login` para mitigar ataques de força bruta;
  * CORS estritamente delimitado à URL autorizada do front-end em produção;
  * Chaves e segredos armazenados exclusivamente em variáveis de ambiente (`.env`), com inclusão do arquivo no `.gitignore` e versionamento apenas do `.env.example`.
* **Integridade Transacional (ACID)**:
  * A criação de lançamentos parcelados ocorre dentro de transações de banco de dados (`BEGIN ... COMMIT`), assegurando que ou todas as parcelas são persistidas ou a operação é revertida por completo (`ROLLBACK`).
* **Resiliência e Desempenho**:
  * Utilização de **Pool de Conexões** no acesso ao banco de dados;
  * Criação de índices estratégicos em chaves estrangeiras e campos de filtragem frequente (`usuario_id`, `data`).

---

## 📁 Estrutura de Pastas do Projeto

O repositório é organizado de acordo com a estrutura exigida pelas diretrizes do Capítulo 10 do livro:

```
Projeto2-FullStack/
├── backend/
│   ├── .env.example              # Exemplo com as variáveis de ambiente necessárias
│   ├── package.json              # Dependências e scripts do servidor Node.js
│   ├── database/
│   │   ├── schema.sql            # Script DDL de criação de tabelas, índices e constraints
│   │   └── seed.sql              # Carga inicial com 2 usuários e 3 meses de lançamentos
│   └── src/
│       ├── server.js             # Ponto de entrada, configuração do Express e middlewares globais
│       ├── config/               # Conexão com o banco (pool), variáveis de ambiente e JWT
│       ├── middlewares/          # Autenticação JWT, validação e tratamento global de erros
│       ├── models/               # Camada de persistência, consultas SQL e regras de dados
│       └── routes/               # Definição dos endpoints REST e lógica dos controladores
│
├── frontend/
│   ├── index.html                # Ponto de entrada HTML do Vite
│   ├── package.json              # Dependências e scripts do client React
│   ├── vite.config.js            # Configuração do Vite
│   └── src/
│       ├── App.jsx               # Roteamento geral com React Router
│       ├── main.jsx              # Renderização raiz do React no DOM
│       ├── components/           # Componentes reutilizáveis e páginas da aplicação
│       ├── contexts/             # AuthContext (gerenciamento de sessão e token)
│       └── services/             # Instância do cliente HTTP (Axios / Fetch) e chamadas à API
│
└── README.md                     # Documentação completa do projeto
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
* **Node.js** (versão 18.x ou superior)
* **npm** ou **yarn**
* **PostgreSQL** (versão 14 ou superior) ou **MySQL** (versão 8 ou superior)

---

### Passo 1: Configuração do Banco de Dados

1. Crie o banco de dados no seu servidor PostgreSQL:
   ```bash
   createdb finanflow_db
   ```
2. Execute o script de criação das tabelas e relacionamentos:
   ```bash
   psql -d finanflow_db -f backend/database/schema.sql
   ```
3. *(Opcional, mas recomendado)* Execute o script de carga inicial (seed) para popular a base com dados de demonstração:
   ```bash
   psql -d finanflow_db -f backend/database/seed.sql
   ```

---

### Passo 2: Configuração e Execução do Back-End

1. Acesse o diretório do back-end:
   ```bash
   cd backend
   ```
2. Crie o arquivo `.env` baseado no exemplo fornecido:
   ```bash
   cp .env.example .env
   ```
3. Preencha as variáveis de ambiente no arquivo `.env`:
   ```env
   PORT=3001
   DATABASE_URL=postgres://usuario:senha@localhost:5432/finanflow_db
   JWT_SECRET=seu_segredo_super_seguro_jwt_2026
   FRONTEND_URL=http://localhost:5173
   ```
4. Instale as dependências:
   ```bash
   npm install
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   > O servidor iniciará por padrão em `http://localhost:3001`.

---

### Passo 3: Configuração e Execução do Front-End

1. Abra uma nova aba no terminal e acesse a pasta do front-end:
   ```bash
   cd frontend
   ```
2. Crie o arquivo `.env` do front-end:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```
3. Instale as dependências da aplicação:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
5. Abra seu navegador no endereço informado pelo terminal (usualmente `http://localhost:5173`).

---

## ✅ Checklist Final do Grupo

Critérios de aceitação e conformidade estritos verificados para a apresentação e entrega:

- [x] Tentativa de cadastrar o mesmo e-mail (inclusive com variações de maiúsculas/minúsculas) é rejeitada com `409 Conflict`.
- [x] Tentativa de cadastrar o mesmo CPF (com ou sem pontuação) é rejeitada pelo banco.
- [x] A unicidade de e-mail e CPF é garantida a nível de banco de dados por índices únicos.
- [x] Nenhuma resposta de rota expõe o atributo `senha_hash`.
- [x] O isolamento entre usuários (RF3) é total: alterar o `:id` na URL não permite visualizar, editar ou remover registros de outros usuários (gera `404 Not Found`).
- [x] Lançamentos de saída recusam categorias cadastradas como entrada.
- [x] Compras parceladas (ex.: R$ 100,00 em 3×) geram parcelas cuja soma é rigorosamente idêntica ao valor original (diferenças de centavos alocadas na 1ª parcela).
- [x] Compras realizadas a partir do dia de fechamento do cartão são computadas na fatura do mês subsequente.
- [x] A expiração ou ausência do token JWT redireciona o usuário de volta à tela de login sem quebrar a interface.
- [x] O arquivo `.env` está devidamente listado no `.gitignore` e não foi versionado; o `.env.example` está disponível com os modelos.
- [x] A documentação presente neste `README.md` permite a qualquer desenvolvedor configurar, subir e executar a aplicação do zero.

---

<p align="center">
  Desenvolvido com dedicação por <strong>Pedro Lucas Sales Larini</strong> e <strong>Renan Cáceres Anselmo</strong>.<br>
  UTFPR — Câmpus Cornélio Procópio • 2026
</p>
