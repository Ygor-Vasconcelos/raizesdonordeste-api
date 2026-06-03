# API Raízes do Nordeste

API REST desenvolvida para gerenciamento de pedidos, estoque, produtos e unidades de uma rede de restaurantes multicanal.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- BcryptJS
- Swagger/OpenAPI
- Nodemon

---

## Requisitos

- Node.js v20+
- PostgreSQL
- Git
- NPM

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

- Databases
- Create
- Database
- Nome: raizes_nordeste
- Owner: postgres

---

## Configuração do .env

Criar arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/raizes_nordeste"

JWT_SECRET="sua_chave_jwt"

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

Servidor:

```txt
http://localhost:3000/docs/
```

---

## Swagger

Documentação disponível em:

```txt
http://localhost:3000/docs
```

---

## Coleção Postman

A coleção utilizada para validação dos endpoints encontra-se na pasta:

```txt
postman/postman_collection.json
```

---

## Fluxo Principal Implementado

```txt
Pedido
 ↓
Validação de Estoque
 ↓
Pagamento Mock
 ↓
Atualização de Status
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

- Gerenciar produtos
- Gerenciar unidades
- Atualizar status de pedidos

### CLIENTE

- Realizar pedidos
- Consultar produtos
- Consultar unidades

---

## Segurança

- Autenticação JWT
- Hash de senha com Bcrypt
- Controle de permissões por perfil
- Proteção de rotas privadas

---

## Estrutura do Projeto

```txt
Pedido → Validação de Estoque → Pagamento Mock → Atualização de Status
```

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
