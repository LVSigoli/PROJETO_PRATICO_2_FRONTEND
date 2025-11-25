
CREATE TABLE
    IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        telefone VARCHAR(20)
    );


CREATE TABLE
    IF NOT EXISTS veiculos (
        id SERIAL PRIMARY KEY,
        placa VARCHAR(10) NOT NULL UNIQUE,
        modelo VARCHAR(50),
        ano INTEGER,
      
        cliente_id INTEGER NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
    );


CREATE TABLE
    IF NOT EXISTS mecanicos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        especialidade VARCHAR(100)
    );

CREATE TABLE
    IF NOT EXISTS pecas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        preco_unidade DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        estoque INTEGER NOT NULL DEFAULT 0
    );


CREATE TABLE
    IF NOT EXISTS ordens_servico (
        id SERIAL PRIMARY KEY,
        data_abertura TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            data_fechamento TIMESTAMP
        WITH
            TIME ZONE,
            status VARCHAR(50) NOT NULL DEFAULT 'ABERTA',
            descricao_problema TEXT,
            veiculo_id INTEGER NOT NULL,
            FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE,
            mecanico_id INTEGER,
            FOREIGN KEY (mecanico_id) REFERENCES mecanicos (id) ON DELETE
        SET NULL
    );


CREATE TABLE
    IF NOT EXISTS itens_peca (
        ordem_servico_id INTEGER NOT NULL,
        FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico (id) ON DELETE CASCADE,
        peca_id INTEGER NOT NULL,
        FOREIGN KEY (peca_id) REFERENCES pecas (id) ON DELETE RESTRICT,
        quantidade INTEGER NOT NULL DEFAULT 1,
        preco_no_momento DECIMAL(10, 2) NOT NULL,
        PRIMARY KEY (ordem_servico_id, peca_id)
    );


-- Dados para test
INSERT INTO
    clientes (nome, email, telefone)
VALUES (
        'Ana Silva',
        'ana.silva@email.com',
        '11987654321'
    ), (
        'Bruno Costa',
        'bruno.costa@email.com',
        '21912345678'
    );

INSERT INTO
    veiculos (placa, modelo, ano, cliente_id)
VALUES ('ABC1234', 'Fiat Uno', 2010, 1), (
        'XYZ7890',
        'Honda Civic',
        2022,
        2
    );

INSERT INTO
    mecanicos (nome, especialidade)
VALUES ('Carlos Souza', 'Motor'), ('Fernanda Lima', 'Elétrica');

INSERT INTO
    pecas (nome, preco_unidade, estoque)
VALUES ('Óleo Motor 1L', 45.50, 100), ('Filtro de Ar', 30.00, 50), (
        'Pastilha de Freio (Par)',
        120.00,
        30
    );