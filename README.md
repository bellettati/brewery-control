## Como rodar o projeto

### Pré-requisitos

- .NET 10 SDK
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

## Respostas

### 1. Como modelei a solução

Três entidades principais: **Beer** (com seus parâmetros fermentativos
aceitáveis), **Tank** e **FermentationRecord** (que referencia Beer e Tank).
Optei por arquitetura em camadas dentro de um único projeto
(Controller → Service → DbContext), com separação clara entre DTOs (camada HTTP)
e input types (camada de serviço). Ver diagrama em /docs.

### 2. Premissas adotadas

- Parâmetros da cerveja como colunas na tabela Beer (relação 1:1).
- Lote como campo string, não entidade própria.
- Critério de classificação com tolerância de 5% (ver DECISIONS.md).
- Validação de ranges (min ≤ max) e timestamps em UTC.

### 3. O que faria diferente / melhorias

- Modelar Lote como entidade própria (início/fim de acompanhamento, relação
  formal com tanque).
- Autenticação/autorização.
- Histórico/versionamento dos parâmetros da cerveja.
- Cobertura de testes além da regra de classificação.

### 4. Ferramentas de IA utilizadas

[preencher: quais ferramentas, onde ajudaram, o que precisou corrigir]
