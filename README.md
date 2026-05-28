# API Raízes do Nordeste

API REST desenvolvida para gerenciamento de pedidos, estoque, produtos e unidades de uma rede de restaurantes multicanal, utilizando autenticação JWT, Prisma ORM e documentação Swagger.

---

# Tecnologias Utilizadas

Projeto backend desenvolvido em Node.js com Express, Prisma ORM e PostgreSQL.

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

# Ambiente Utilizado

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
git clone https://github.com/Ygor-Vasconcelos/raizesdonordeste-api

cd raizesdonordeste-api
```

---

# Instalação das Dependências

```bash
npm install
```

---

# Configuração do .env

Utilize o arquivo `.env.example` como base para criar o arquivo `.env`.

Exemplo:

```bash
cp .env.example .env
```

Depois preencha as variáveis corretamente:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/raizes_nordeste"

JWT_SECRET="sua_chave_jwt"

PORT=3000
```

# Banco de Dados

## Executar migrations

```bash
npx prisma migrate dev
```

## Gerar Prisma Client

```bash
npx prisma generate
```

---

# Executando o Projeto

```bash
npm run dev
```

Servidor local:

```txt
http://localhost:3000
```

---

# Swagger

A documentação da API estará disponível em:

```txt
http://localhost:3000/docs
```

---

# Autenticação JWT

Para acessar endpoints protegidos:

1. Faça login
2. Copie o token retornado
3. Clique em `Authorize` no Swagger
4. Informe:

```txt
    SEU_TOKEN
```

# Funcionalidades

## Autenticação

- Cadastro de usuários
- Login com JWT
- Hash de senha com Bcrypt

## Produtos

- Cadastro de produtos
- Listagem de produtos
- Validação de dados

## Unidades

- Cadastro de unidades
- Controle por cidade
- Listagem de unidades

## Estoque

- Controle de estoque por unidade
- Atualização automática após pedidos
- Validação de estoque insuficiente

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

## Pagamento Mockado

- Simulação de pagamento aprovado ou recusado
- Atualização automática do status do pedido

---

# Programa de Fidelidade

O sistema possui estrutura preparada para fidelização de clientes através de acúmulo de pontos por pedidos realizados, permitindo futuras expansões para resgate de benefícios e descontos.

# Controle de Permissões

## ADMIN

Pode:

- cadastrar produtos
- cadastrar unidades
- alterar status de pedidos

## CLIENTE

Pode:

- realizar pedidos
- visualizar produtos
- visualizar unidades

---

# Segurança e LGPD

A aplicação implementa mecanismos básicos de segurança e proteção de dados conforme princípios da LGPD.

## Segurança Implementada

- autenticação JWT
- hash de senha com Bcrypt
- proteção de rotas privadas
- controle de permissões por perfil
- validação de token
- não exposição de senhas em responses

## Finalidade dos Dados Coletados

Os dados dos usuários são utilizados para:

- autenticação no sistema
- processamento de pedidos
- controle operacional
- rastreabilidade das operações
- gestão de pedidos multicanal

---

# Estrutura do Projeto

```txt
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

```txt
POST /auth/register
POST /auth/login
```

## Produtos

```txt
GET /produtos
POST /produtos
```

## Unidades

```txt
GET /unidades
POST /unidades
```

## Estoque

```txt
GET /estoque
POST /estoque
```

## Pedidos

```txt
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

# Funcionalidades Implementadas

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

# Fluxo Principal do MVP

Fluxo implementado:

```txt
Pedido → Validação de Estoque → Pagamento Mock → Atualização de Status
```
