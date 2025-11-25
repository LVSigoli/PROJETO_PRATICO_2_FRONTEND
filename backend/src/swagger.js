const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path"); 

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Oficina Mecânica",
      version: "1.0.0",
      description:
        "Documentação do backend para o trabalho da oficina mecânica.",
    },

    components: {
      schemas: {
        Error400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
          example: {
            error: "Dados inválidos ou ID de referência não existe.",
          },
        },
        Error404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
          example: {
            error: "Recurso não encontrado.",
          },
        },
        Error500: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
          example: {
            error: "Erro interno do servidor.",
          },
        },

        Cliente: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "O ID gerado automaticamente do cliente.",
            },
            nome: {
              type: "string",
              description: "O nome do cliente.",
            },
            email: {
              type: "string",
              description: "O email do cliente (deve ser único).",
            },
            telefone: {
              type: "string",
              description: "O telefone do cliente.",
            },
          },
          example: {
            id: 1,
            nome: "João da Silva",
            email: "joao@email.com",
            telefone: "11999998888",
          },
        },
        ClienteInput: {
          type: "object",
          properties: {
            nome: {
              type: "string",
              description: "O nome do cliente.",
            },
            email: {
              type: "string",
              description: "O email do cliente (deve ser único).",
            },
            telefone: {
              type: "string",
              description: "O telefone do cliente.",
            },
          },
          example: {
            nome: "João da Silva",
            email: "joao@email.com",
            telefone: "11999998888",
          },
        },
        Veiculo: {
          type: "object",
          properties: {
            id: { type: "integer" },
            placa: { type: "string" },
            modelo: { type: "string" },
            ano: { type: "integer" },
            cliente_id: { type: "integer" },
          },
          example: {
            id: 1,
            placa: "ABC1234",
            modelo: "Fiat Uno",
            ano: 2010,
            cliente_id: 1,
          },
        },
        VeiculoInput: {
          type: "object",
          properties: {
            placa: { type: "string" },
            modelo: { type: "string" },
            ano: { type: "integer" },
            cliente_id: {
              type: "integer",
              description: "ID do cliente dono do veículo.",
            },
          },
          example: {
            placa: "ABC1234",
            modelo: "Fiat Uno",
            ano: 2010,
            cliente_id: 1,
          },
        },
        Mecanico: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nome: { type: "string" },
            especialidade: { type: "string" },
          },
          example: {
            id: 1,
            nome: "Carlos Souza",
            especialidade: "Motor",
          },
        },
        MecanicoInput: {
          type: "object",
          properties: {
            nome: { type: "string" },
            especialidade: { type: "string" },
          },
          example: {
            nome: "Carlos Souza",
            especialidade: "Motor",
          },
        },
        Peca: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nome: { type: "string" },
            preco_unidade: { type: "number", format: "decimal" },
            estoque: { type: "integer" },
          },
          example: {
            id: 1,
            nome: "Óleo Motor 1L",
            preco_unidade: 45.5,
            estoque: 100,
          },
        },
        PecaInput: {
          type: "object",
          properties: {
            nome: { type: "string" },
            preco_unidade: { type: "number", format: "decimal" },
            estoque: { type: "integer" },
          },
          example: {
            nome: "Óleo Motor 1L",
            preco_unidade: 45.5,
            estoque: 100,
          },
        },
        ItemPecaInput: {
          type: "object",
          properties: {
            peca_id: { type: "integer" },
            quantidade: { type: "integer" },
            preco_no_momento: { type: "number", format: "decimal" },
          },
        },
        OrdemServico: {
          type: "object",
          properties: {
            id: { type: "integer" },
            data_abertura: { type: "string", format: "date-time" },
            data_fechamento: { type: "string", format: "date-time" },
            status: { type: "string" },
            descricao_problema: { type: "string" },
            veiculo_id: { type: "integer" },
            mecanico_id: { type: "integer" },
          },
        },
        OrdemServicoInput: {
          type: "object",
          properties: {
            descricao_problema: { type: "string" },
            veiculo_id: { type: "integer" },
            mecanico_id: { type: "integer" },
            status: { type: "string", example: "ABERTA" },
            pecas: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ItemPecaInput",
              },
              description: "Lista de peças usadas na O.S.",
            },
          },
          example: {
            descricao_problema: "Troca de óleo e filtro de ar",
            veiculo_id: 1,
            mecanico_id: 1,
            status: "ABERTA",
            pecas: [
              {
                peca_id: 1,
                quantidade: 4,
                preco_no_momento: 45.5,
              },
              {
                peca_id: 2,
                quantidade: 1,
                preco_no_momento: 30.0,
              },
            ],
          },
        },
      },
    },
    tags: [
      {
        name: "Clientes",
        description: "API para gerenciamento de clientes da oficina.",
      },
      {
        name: "Veiculos",
        description: "API para gerenciamento de veículos.",
      },
      {
        name: "Mecanicos",
        description: "API para gerenciamento de mecânicos.",
      },
      {
        name: "Pecas",
        description: "API para gerenciamento de peças e estoque.",
      },
      {
        name: "OrdensServico",
        description: "API para gerenciamento das Ordens de Serviço (O.S).",
      },
    ],
  },

  apis: [path.join(__dirname, "routes", "*.js")],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
