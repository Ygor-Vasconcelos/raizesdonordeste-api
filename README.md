# API Raízes do Nordeste

<<<<<<< HEAD
API REST desenvolvida para gerenciamento de pedidos, estoque, produtos e unidades de uma rede de restaurantes, utilizando autenticação JWT e documentação Swagger.

---

# Tecnologias Utilizadas
=======
Projeto backend desenvolvido em Node.js com Express, Prisma ORM e PostgreSQL.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
<<<<<<< HEAD
- BcryptJS
- Swagger/OpenAPI
- Nodemon

---

# Ambiente Utilizado

| Tecnologia | Versão |
|---|---|
| Node.js | v20.x |
| NPM | 10.x |
| PostgreSQL 
| Prisma ORM 
---

# Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

- Node.js
- PostgreSQL
- Git
- NPM

---

# Clonando o Repositório

```bash
git clone LINK_DO_REPOSITORIO

cd raizes-do-nordeste-api
```

---

# Instalação das Dependências

```bash
npm install
```

---

# Configuração do .env

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/raizes"
JWT_SECRET="sua_chave_jwt"
PORT=3000
```

---

# Banco de Dados

## Executar migrations

```bash
npx prisma migrate dev
```

---

## Gerar Prisma Client

```bash
npx prisma generate
```

---

# Executando o Projeto

```bash
npm run dev
```

Servidor:

```bash
http://localhost:3000
```

---

# Swagger

A documentação da API estará disponível em:

```bash
http://localhost:3000/docs
```

---

# Autenticação JWT

Para acessar endpoints protegidos:

1. Faça login
2. Copie o token retornado
3. Clique em `Authorize` no Swagger
4. Informe:

SEU_TOKEN
---

# Funcionalidades

## Autenticação

- Cadastro de usuários
- Login com JWT
- Hash de senha com Bcrypt

---

## Produtos

- Cadastro de produtos
- Listagem de produtos
- Validação de dados

---

## Unidades

- Cadastro de unidades
- Controle por cidade
- Listagem de unidades

---

## Estoque

- Controle de estoque por unidade
- Atualização automática após pedidos
- Validação de estoque insuficiente

---

## Pedidos

- Criação de pedidos
- Pedido com múltiplos itens
- Atualização de status
- Filtro por canal de pedido
- Controle multicanal

### Canais disponíveis

- APP
- TOTEM
- BALCAO
- PICKUP
- WEB

---

## Pagamento Mockado

- Simulação de pagamento aprovado ou recusado
- Atualização automática do status do pedido

---

# Controle de Permissões

## ADMIN

Pode:

- cadastrar produtos
- cadastrar unidades
- alterar status de pedidos

---

## CLIENTE

Pode:

- realizar pedidos
- visualizar produtos
- visualizar unidades

---

# Estrutura do Projeto

```bash
src/
 ├── controllers/
 ├── docs/
 ├── middlewares/
 ├── prisma/
 ├── routes/
 ├── server.js
```

---

# Principais Endpoints

## Auth

```http
POST /auth/register
POST /auth/login
```

---

## Produtos

```http
GET /produtos
POST /produtos
```

---

## Unidades

```http
GET /unidades
POST /unidades
```

---

## Estoque

```http
GET /estoque
POST /estoque
```

---

## Pedidos

```http
GET /pedidos
POST /pedidos
PATCH /pedidos/{id}/status
```

---

# Exemplos

## Login

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

---

## Criar Pedido

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

# Validações Implementadas

- nome obrigatório
- cidade obrigatória
- preço maior que zero
- quantidade maior que zero
- pedido deve possuir itens
- validação de estoque
- token obrigatório
- controle de permissões por perfil

---

# Tratamento de Erros

A API utiliza respostas padronizadas utilizando códigos HTTP apropriados:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

# Integrantes

- Ygor Vasconcelos
=======
- Swagger
- bcrypt

---

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Controle de permissões
- Cadastro de produtos
- Controle de estoque
- Cadastro de unidades
- Criação de pedidos
- Simulação de pagamento
- Logs de auditoria
- Swagger Documentation

---

## Instalação

Clone o projeto:

```bash
git clone https://github.com/Ygor-Vasconcelos/raizes-do-nordeste-api

## Projeto multidisciplinar
>>>>>>> 9b9b29aeee1f5fe07e3706e00e709745e038def7
