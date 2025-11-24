API Oficina Mecânica 🚗🔧
Este projeto é um backend RESTful para um sistema de gerenciamento de Oficina Mecânica. A aplicação utiliza Node.js, Express e PostgreSQL, é totalmente containerizada com Docker e possui documentação completa gerada via Swagger.

Sobre o Projeto
O objetivo deste projeto foi implementar uma API com rotas CRUD completas que atende aos seguintes requisitos:

Relacionamento N:N (Muitos-para-Muitos): Implementado entre OrdensServico e Pecas (através da tabela itens_peca).

Relacionamento 1:N (Um-para-Muitos): Implementado entre Clientes e Veiculos.

Documentação Completa: 100% dos endpoints estão documentados no Swagger, incluindo schemas de request e response (sucesso e erro).

Entidades da API
A API expõe rotas CRUD (GET, POST, PUT, DELETE) para as seguintes entidades:

Clientes: Gerenciamento de dados dos clientes.

Veiculos: Gerenciamento dos veículos, onde cada veículo pertence a um cliente (1:N).

Mecanicos: Gerenciamento dos mecânicos da oficina.

Pecas: Gerenciamento de peças e estoque.

OrdensServico: Gerenciamento das Ordens de Serviço, que conecta todas as entidades e implementa a lógica N:N com Peças.

Estrutura do Projeto
A estrutura de ficheiros foi adaptada do template original para suportar as entidades da oficina:

api-oficina-mecanica/
├── src
│ ├── index.js # Ponto de entrada, carrega as rotas e o Swagger
│ ├── db.js # Configuração da conexão com o PostgreSQL (inclui pool e transações)
│ ├── swagger.js # Configuração central do swagger-jsdoc (definição de Schemas e Tags)
│ └── routes
│ ├── clientes.js # Rotas CRUD para /clientes
│ ├── veiculos.js # Rotas CRUD para /veiculos
│ ├── mecanicos.js # Rotas CRUD para /mecanicos
│ ├── pecas.js # Rotas CRUD para /pecas
│ └── ordensServico.js # Rotas CRUD para /ordens-servico (Implementa N:N)
├── sql
│ └── init.sql # Script de criação das tabelas da oficina (executado automaticamente pelo Docker)
├── Dockerfile # Instruções para construir a imagem Docker do Node.js
├── docker-compose.yml # Configuração dos serviços 'node' (API) e 'database' (PostgreSQL)
├── .gitignore # Arquivos a serem ignorados pelo Git
├── package.json # Configuração do npm e dependências
└── README.md # Esta documentação
Pré-requisitos
Docker

Docker Compose

Instalação e Execução
Clone o repositório (substitua pela URL do seu repositório, se aplicável):

git clone https://github.com/Trojahn/express_template_docker.git
cd express_template_docker
Inicie a aplicação com Docker Compose:

docker compose up --build
Na primeira vez que executar, o Docker irá:

Construir a imagem da API (node).

Baixar a imagem do postgres.

Criar o banco de dados (bancodados).

Executar o script sql/init.sql para criar todas as tabelas e inserir os dados de exemplo.

Para resetar o banco de dados (apagar todos os dados e recomeçar do zero), execute:

docker compose down -v
docker compose up --build
(A flag -v remove os volumes, forçando o init.sql a ser executado novamente).

Uso e Testes
A API e sua documentação estarão disponíveis localmente:

URL Base da API: http://localhost:3000

Documentação Swagger (UI): http://localhost:3000/api

A forma recomendada de testar é através da interface do Swagger, que permite executar todas as rotas CRUD diretamente pelo navegador, ou utilizando ferramentas como o Postman.
