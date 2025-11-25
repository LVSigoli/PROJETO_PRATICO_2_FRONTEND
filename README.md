# 🚀 Projeto Fullstack --- Backend + Frontend + Docker + PostgreSQL

Este repositório contém uma aplicação Fullstack composta por:

- **Backend** (Node.js + Express)\
- **Frontend** (React)\
- **Banco de dados** (PostgreSQL)\
- **Ambiente Docker** para subir os três serviços de forma integrada

## 📦 Estrutura de Pastas

    ├── backend/
    │   ├── src/
    │   ├── package.json
    │   ├── Dockerfile
    │   └── ...
    │
    ├── frontend/
    │   ├── src/
    │   ├── package.json
    │   ├── Dockerfile
    │   └── ...
    │
    ├── sql/
    │   └── init.sql
    │
    ├── .env.docker
    ├── docker-compose.yml
    └── README.md

## 🐳 Como funciona o Docker neste projeto

O `docker-compose.yml` levanta 3 containers:

### **1️⃣ Backend**

- Porta exposta: **3000**\
- URL: `http://localhost:3000`

### **2️⃣ Frontend**

- Porta configurável via `.env.docker`\
- Padrão: **5174**\
- URL: `http://localhost:5174`

### **3️⃣ PostgreSQL**

- Porta interna: **5432**\
- Dados persistidos via volume\
- Executa scripts de `/sql`

## ⚙️ Variáveis de Ambiente

Criar arquivo:

### `.env.docker`

```bash
PORT=5174
```

## 🧰 Como subir o projeto

```bash
docker-compose up --build
```

Modo daemon:

```bash
docker-compose up -d
```

Parar:

```bash
docker-compose down
```

Reset banco:

```bash
docker-compose down -v
```

## 📂 Acessos

Serviço URL

---

Backend http://localhost:3000
Frontend http://localhost:5174
PostgreSQL localhost:5432

## 🛠️ Desenvolvimento sem Docker

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## ✔️ Conclusão

Docker unifica backend, frontend e banco com um comando:

```bash
docker-compose up --build
```
