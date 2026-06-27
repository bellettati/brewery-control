# Log de Decisões

## Modelagem inicial

Antes de começar a codar, optei por modelar as entidades e suas relações.
Entender as regras de negócio e como os dados se conectam primeiro me dá
clareza sobre o que precisa ser construído e evita retrabalho depois.

![Modelo de dados](docs/data-model.png)

## Entidades e relações

- **Beer** — a cerveja cadastrada (nome e estilo). Carrega também seus
  parâmetros fermentativos aceitáveis (temperatura, pH e extrato — mínimo e
  máximo). Optei por manter esses parâmetros como colunas na própria tabela,
  já que são 1:1 com a cerveja e sempre presentes.

- **Tank** — o tanque físico de fermentação (nome e capacidade em litros).
  É reutilizável: ao longo do tempo recebe vários lotes, de cervejas
  diferentes.

- **FermentationRecord** — cada apontamento fermentativo. Referencia uma
  **Beer** e um **Tank**, e guarda o número do lote, as leituras (temperatura,
  pH, extrato), data/hora, observações e o **status** da classificação.

## Relações

- Uma **Beer** pode ter vários **FermentationRecords** (1:N).
- Um **Tank** pode ter vários **FermentationRecords** (1:N).
- Cada **FermentationRecord** pertence a uma Beer e a um Tank.
- O **lote** é um campo (string) no registro, não uma entidade própria —
  o desafio só o usa para agrupar o histórico.

## Classificação

Ao salvar um registro, o sistema compara as leituras com os parâmetros da
cerveja e classifica em **Dentro do Padrão**, **Atenção** ou **Fora do Padrão**.
O resultado é gravado no campo `Status` do registro, o que permite os
contadores do dashboard.

## Camada de serviço

- **Input types separados dos DTOs** (`CreateBeerInput`, `UpdateBeerInput`):
  os DTOs ficam restritos à camada HTTP (controller); o service recebe um
  tipo próprio. Mantém o service independente do HTTP. Regra adotada: usar
  input types para entidades com muitos campos (Beer); Tank, por ter só 2
  campos, segue com primitivos.

- **Validação de ranges** (min ≤ max para temp, pH e extrato): centralizada
  num método `Validate(beer)` compartilhado entre create e update, validando
  os valores finais da entidade (funciona para updates parciais).

- **Pendência conhecida:** a validação lança `ArgumentException`, que hoje
  vira 500. Precisa ser mapeada para 400 (Bad Request) — via try/catch no
  controller ou middleware global de exceções.

## FermentationRecord e relações

- **Relações via FK + navigation property**: `FermentationRecord` guarda
  `BeerId`/`TankId` (chaves estrangeiras) e expõe `Beer`/`Tank` (navigation
  properties). EF resolve a relação por convenção.

- **Lote como campo string** (`BatchNumber`), não entidade própria — o desafio
  só usa o lote para agrupar o histórico. Modelo de Lote separado fica como
  melhoria futura.

- **Timestamps em UTC**: o Npgsql exige `DateTime` em UTC. Uso
  `DateTime.SpecifyKind(..., Utc)` ao salvar.

## Classificação

- **Critério**: cada parâmetro (temperatura, pH, extrato) é avaliado contra a
  faixa min/máx da cerveja. Dentro da faixa = Dentro do Padrão; fora da faixa
  mas dentro de uma tolerância = Atenção; além da tolerância = Fora do Padrão.

- **Tolerância = 5% da largura da faixa** (`(max - min) * 0.05`). Escolha
  documentada e ajustável. Alternativa considerada: margem absoluta fixa por
  parâmetro (faixas de pH são estreitas, então a % fica pequena).

- **Status geral = o pior dos três parâmetros**: um único parâmetro Fora do
  Padrão classifica o registro inteiro como Fora do Padrão.

- **Reclassificação no update**: ao editar um registro, o Status é recalculado,
  já que os valores podem ter mudado.

## Tratamento de erros

- **Middleware global de exceções** (`IExceptionHandler`) mapeia
  `ArgumentException` → 400, usando o formato padrão `ProblemDetails` (RFC 7807).
  Mantém os controllers limpos.

## Dashboard

- **Service dedicado** (`DashboardService`) em vez de acessar o DbContext direto
  no controller, mantendo a separação de camadas.
- **Query única agrupada** (`GroupBy` por Status) em vez de N contagens
  separadas — um round-trip ao banco.

## Testes

- **Escopo deliberado**: testes unitários apenas na regra de classificação
  (`ClassificationService`), que é lógica pura (sem dependências) e o núcleo
  do desafio. Cobrem cada categoria e os limites (exatamente no limite, dentro
  da tolerância, fora dela, e a regra do "pior parâmetro").
- **Sem mocks**: a regra de classificação não tem dependências a isolar.
  Testar services com DbContext exigiria banco em memória ou mock do EF —
  muito setup para pouco retorno neste escopo, então foi deixado de fora
  conscientemente.
- **Framework**: xUnit (padrão do ecossistema .NET).

## Versionamento de pacotes

- Pacotes do EF Core alinhados na versão 10.0.2 (ancorada pelo
  Npgsql.EntityFrameworkCore.PostgreSQL, que não possui 10.0.9), evitando
  conflitos de versão entre o projeto da API e o de testes.

## Seed de dados

- **Seeder no startup** (apenas em Development), com guard de idempotência
  (`if (await db.Beers.AnyAsync()) return;`) para não duplicar a cada restart.
- **Registros criados via FermentationService**, não inseridos direto no banco,
  para que a regra de classificação rode de verdade e os Status sejam reais.
- Dados baseados em perfis fermentativos realistas (IPA, Pilsner, Hefeweizen),
  com registros propositalmente cobrindo as três categorias de classificação.
