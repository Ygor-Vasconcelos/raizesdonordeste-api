# API Raízes do Nordeste

API REST desenvolvida para gerenciamento de pedidos, estoque, produtos, unidades e programa de fidelidade de uma rede de restaurantes multicanal.

---

## Tecnologias Utilizadas

* Node.js v20.20.0
* Express 5.2.1
* PostgreSQL 18.4
* Prisma ORM 6.19.3
* JWT 9.0.3
* BcryptJS 3.0.3
* Swagger/OpenAPI 5.0.1
* Nodemon 3.1.14

---

## Requisitos

* Node.js v20+
* PostgreSQL 18.4
* Git 2.54.0
* NPM 10.8.2

---

## Clonar Repositório

```bash
git clone https://github.com/Ygor-Vasconcelos/raizesdonordeste-api.git

cd raizesdonordeste-api
```

---

## Instalar Dependências

```bash
npm install
```

---

## Configuração do Banco de Dados

Criar um banco PostgreSQL chamado:

```txt
raizes_nordeste
```

Exemplo utilizando pgAdmin:

1. Databases
2. Create
3. Database
4. Database Name: raizes_nordeste
5. Owner: postgres

---

## Configuração do .env

Criar um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/raizes_nordeste"

JWT_SECRET="sua_chave_jwt"

PORT=3000
```

Exemplo:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/raizes_nordeste"

JWT_SECRET="raizes_nordeste_secret"

PORT=3000
```

---

## Executar Migrations

```bash
npx prisma migrate dev --name init
```

---

## Gerar Prisma Client

```bash
npx prisma generate
```

---

## Executar Projeto

```bash
npm run dev
```

Servidor disponível em:

```txt
http://localhost:3000/docs
```

---

## Swagger

Documentação disponível em:

```txt
http://localhost:3000/docs
```

---

## Coleção Postman

A coleção utilizada para validação dos endpoints encontra-se em:

```txt
postman_collection.json
```

---

## Usuário Administrador

Para fins acadêmicos e de avaliação do projeto, o sistema atribui automaticamente o perfil `ADMIN` ao usuário cadastrado com o e-mail:

```txt
admin@email.com
```

Exemplo:

```json
{
  "nome": "Administrador",
  "email": "admin@email.com",
  "senha": "123456"
}
```

Todos os demais usuários recebem automaticamente o perfil `CLIENTE`.

---

## Fluxo Principal Implementado

```txt
Pedido
 ↓
Validação de Estoque
 ↓
Aplicação de Desconto Fidelidade (quando disponível)
 ↓
Pagamento Mock
 ↓
Atualização de Status
 ↓
Acúmulo de Pontos
```

---

## Programa de Fidelidade

O sistema possui um programa de fidelidade integrado ao processo de pedidos.

### Funcionamento

* Todo usuário cadastrado recebe automaticamente um registro de fidelidade.
* Cada pedido realizado gera 10 pontos.
* Ao atingir 30 pontos, um desconto é liberado para o próximo pedido.
* O desconto corresponde a 30% sobre o valor total do pedido.
* Após utilizar o desconto:

  * os pontos são zerados;
  * o desconto é removido;
  * inicia-se um novo ciclo de pontuação.

### Exemplo

```txt
Pedido 1 → +10 pontos
Pedido 2 → +10 pontos
Pedido 3 → +10 pontos

Total = 30 pontos
↓
Desconto liberado

Próximo pedido
↓
30% de desconto aplicado
↓
Pontos resetados para 0
```

---

## Principais Endpoints

### Auth

```txt
POST /auth/register
POST /auth/login
```

### Produtos

```txt
GET /produtos
POST /produtos
```

### Unidades

```txt
GET /unidades
POST /unidades
```

### Estoque

```txt
GET /estoque
POST /estoque
```

### Pedidos

```txt
GET /pedidos
POST /pedidos
PATCH /pedidos/{id}/status
```

### Fidelidade

```txt
GET /fidelidade/{usuarioId}
```

---

## Exemplo de Login

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

---

## Exemplo de Pedido

```json
{
  "unidadeId": 1,
  "canalPedido": "APP",
  "metodoPagamento": "PIX",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2
    }
  ]
}
```

---

## Controle de Acesso

### ADMIN

Pode:

* Realizar login
* Consultar produtos
* Consultar unidades
* Consultar pedidos
* Criar pedidos
* Consultar fidelidade
* Cadastrar produtos
* Cadastrar unidades
* Gerenciar estoque
* Atualizar status dos pedidos

### CLIENTE

Pode:

* Cadastrar-se
* Realizar login
* Consultar produtos
* Consultar unidades
* Criar pedidos
* Consultar pedidos
* Consultar fidelidade

Restrições:

* Não pode atualizar status dos pedidos
* Não pode gerenciar estoque
* Não pode cadastrar produtos
* Não pode cadastrar unidades

---

## Regras de Negócio

* RN01: O sistema deve validar a existência de estoque antes da criação do pedido.
* RN02: O sistema deve impedir pedidos com estoque insuficiente.
* RN03: Apenas usuários ADMIN podem atualizar o status dos pedidos.
* RN04: Apenas usuários ADMIN podem gerenciar estoque.
* RN05: Apenas usuários ADMIN podem cadastrar produtos.
* RN06: Apenas usuários ADMIN podem cadastrar unidades.
* RN07: O sistema deve gerar token JWT após autenticação válida.
* RN08: O sistema deve registrar clientes no programa de fidelidade com saldo inicial igual a zero.
* RN09: O sistema deve adicionar 10 pontos ao cliente a cada pedido realizado.
* RN10: O sistema deve liberar automaticamente um desconto quando o cliente atingir 30 pontos.
* RN11: O desconto concedido deve corresponder a 30% do valor total do pedido.
* RN12: O desconto deve ser aplicado apenas uma vez.
* RN13: Após utilizar o desconto, os pontos devem ser zerados.
* RN14: O sistema deve reiniciar automaticamente o ciclo de fidelidade após o uso do benefício.
* RN15: O pagamento do pedido deve ser processado por um gateway mock para fins acadêmicos.
* RN16: Pedidos com pagamento recusado devem ser automaticamente cancelados.

---

## Segurança

* Autenticação JWT
* Hash de senha com Bcrypt
* Controle de permissões por perfil (ADMIN e CLIENTE)
* Proteção de rotas privadas
* Validação de token em endpoints protegidos

---

## Tratamento de Erros

A API utiliza respostas padronizadas utilizando códigos HTTP apropriados:

* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 409 Conflict
* 500 Internal Server Error

Exemplo:

```json
{
  "error": "SEM_PERMISSAO",
  "message": "Você não possui permissão"
}
```

---

## Estrutura do Projeto

```txt
prisma/
└── schema.prisma

src/
├── controllers/
├── docs/
├── middlewares/
├── prisma/
├── routes/
├── server.js
```
