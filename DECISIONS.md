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
