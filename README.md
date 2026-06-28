# Brewery Fermentation Control

Aplicação web para registro e acompanhamento de dados fermentativos de cerveja
(temperatura, pH e extrato), classificando automaticamente cada registro como
**Dentro do Padrão**, **Atenção** ou **Fora do Padrão**.

## Como rodar o projeto

### Pré-requisitos

- .NET 10 SDK
- Node.js 20+
- Docker (para o PostgreSQL)

### Banco de dados

\`\`\`bash
docker run --name brewery-db -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=brewery \
 -p 5432:5432 -d postgres
\`\`\`

### Backend

\`\`\`bash
cd backend/BreweryControl.Api
dotnet ef database update # aplica as migrations
dotnet run
\`\`\`
A API sobe em http://localhost:5042 (confira a porta no output).

> Em ambiente de desenvolvimento, o banco é populado automaticamente na
> primeira execução com cervejas, tanques e registros de demonstração
> (cobrindo as três categorias de classificação). O seed não duplica em
> execuções seguintes.

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Abre em http://localhost:5173. O backend precisa estar rodando.

## Testes

\`\`\`bash
cd backend
dotnet test
\`\`\`
Os testes cobrem a regra de classificação fermentativa (dentro do padrão,
atenção, fora do padrão) e seus casos de limite. O escopo foi mantido focado
na lógica de negócio central — ver DECISIONS.md para o racional.

## Estrutura do projeto

\`\`\`
backend/
├── BreweryControl.Api/ # API ASP.NET Core
│ ├── Controllers/ # camada HTTP
│ ├── Services/ # lógica de negócio + classificação
│ │ └── Inputs/ # input types da camada de serviço
│ ├── Models/ # entidades EF
│ ├── Dtos/ # contratos da API (request/response)
│ ├── Data/ # DbContext + migrations + seed
│ └── Middleware/ # tratamento global de exceções
└── BreweryControl.Tests/ # testes unitários (xUnit)

frontend/
└── src/
├── api/ # camada de API tipada (fetch + types)
├── components/ # componentes reutilizáveis e formulários
└── pages/ # telas (dashboard, cervejas, tanques, etc.)
\`\`\`

## Tecnologias

**Backend**

- .NET 10 / ASP.NET Core (controllers)
- Entity Framework Core 10 + PostgreSQL (Npgsql)
- xUnit
- OpenAPI nativo (Microsoft.AspNetCore.OpenApi)

**Frontend**

- React + TypeScript + Vite
- TanStack Query (estado de servidor)
- Tailwind CSS v4

## Respostas

### 1. Como modelei a solução

Três entidades principais: **Beer** (com seus parâmetros fermentativos
aceitáveis), **Tank** e **FermentationRecord** (que referencia Beer e Tank).
No backend, optei por arquitetura em camadas dentro de um único projeto
(Controller → Service → DbContext), com separação clara entre DTOs (camada HTTP)
e input types (camada de serviço). O frontend espelha essa separação: uma camada
de API tipada e isolada, com o TanStack Query cuidando do estado de servidor.
Ver diagrama em /docs.

### 2. Premissas adotadas

- Parâmetros da cerveja como colunas na tabela Beer (relação 1:1).
- Lote como campo string, não entidade própria.
- Critério de classificação com tolerância de 5% (ver DECISIONS.md).
- Validação de ranges (min ≤ max) e timestamps em UTC.
- O Figma define um design system (cores, fonte, ícones), não telas prontas — o
  layout das telas foi definido por mim aplicando os tokens da marca.

### 3. O que faria diferente / melhorias

- Modelar Lote como entidade própria (início/fim de acompanhamento, relação
  formal com tanque).
- Autenticação/autorização.
- Histórico/versionamento dos parâmetros da cerveja.
- Cobertura de testes além da regra de classificação.
- Edição/exclusão e validação de formulário no frontend (priorizei ter todas as
  telas funcionando dentro do prazo).

### 4. Ferramentas de IA utilizadas

Utilizei o Claude (Anthropic) como apoio ao longo de todo o desenvolvimento.

**Onde ajudou.** Por ser meu primeiro projeto em ASP.NET, usei a IA
principalmente como ferramenta de aprendizado e aceleração: entender a estrutura
de um projeto .NET (solution, csproj, camadas), o funcionamento do EF Core
(DbContext, migrations, change tracking) e o padrão controller → service →
DbContext. Também usei para acelerar trechos repetitivos (DTOs, mapeamentos,
CRUDs análogos entre entidades) e, no frontend, para configurar o TanStack Query,
que eu ainda não conhecia.

**Direcionamento de arquitetura.** Usei a IA ativamente para discutir as decisões
de arquitetura, buscando o equilíbrio entre código organizado e over-engineering.
Em vários momentos questionei sugestões para manter o escopo proporcional ao
desafio: optei por um único projeto com camadas em vez de uma Clean Architecture
multi-projeto, e por testar só a regra de classificação em vez de montar mocks e
banco em memória. As decisões de escopo foram minhas; a IA ajudou a explorar os
trade-offs.

**O que precisei corrigir.** Nem tudo veio pronto — revisei e corrigi várias
sugestões:

- Uma versão inicial deixava o DTO (camada HTTP) vazar para dentro do service;
  percebi a inconsistência com a separação de camadas e introduzi input types
  próprios da camada de serviço.
- Uma sugestão de dashboard acessava o DbContext direto no controller; recusei e
  movi a lógica para um `DashboardService`, mantendo o padrão das demais telas.
- Um conflito de versões entre EF Core e Npgsql (a IA sugeriu uma versão
  inexistente para o Npgsql) precisou ser resolvido alinhando os pacotes
  manualmente.
- Um `<App />` duplicado no `main.tsx` causava tela branca intermitente —
  diagnostiquei e removi.

No geral, tratei a IA como um par para discutir decisões e acelerar o que eu já
entendia, validando e ajustando o que ela gerou em vez de aceitar cegamente.
