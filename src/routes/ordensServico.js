const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * /ordens-servico:
 *   post:
 *     summary: Cria uma nova Ordem de Serviço e associa suas peças (N:N)
 *     tags:
 *       - OrdensServico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrdemServicoInput'
 *     responses:
 *       '201':
 *         description: Ordem de Serviço criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdemServico'
 *       '400':
 *         description: "Dados inválidos (ex.: IDs de referência não existem)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '500':
 *         description: Erro ao criar a Ordem de Serviço.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post("/", async (req, res) => {
  const { veiculo_id, mecanico_id, descricao_problema, status, pecas } =
    req.body;

  try {
    const result = await db.transaction(async (conexao) => {
      const osQuery =
        "INSERT INTO ordens_servico (veiculo_id, mecanico_id, descricao_problema, status) VALUES ($1, $2, $3, $4) RETURNING *";
      const osValues = [veiculo_id, mecanico_id, descricao_problema, status];
      const osResult = await conexao.query(osQuery, osValues);
      const novaOrdem = osResult.rows[0];
      const ordemId = novaOrdem.id;

      if (pecas && pecas.length > 0) {
        for (const peca of pecas) {
          const itemQuery =
            "INSERT INTO itens_peca (ordem_servico_id, peca_id, quantidade, preco_no_momento) VALUES ($1, $2, $3, $4)";
          const itemValues = [
            ordemId,
            peca.peca_id,
            peca.quantidade,
            peca.preco_no_momento,
          ];
          await conexao.query(itemQuery, itemValues);
        }
      }

      return novaOrdem;
    });

    res.status(201).json(result);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({
        error: "Erro: veiculo_id, mecanico_id ou alguma peca_id não existe.",
      });
    }
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /ordens-servico:
 *   get:
 *     summary: Lista todas as Ordens de Serviço
 *     tags:
 *       - OrdensServico
 *     responses:
 *       '200':
 *         description: Lista de O.S. retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrdemServico'
 *       '500':
 *         description: Erro ao buscar O.S.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM ordens_servico ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /ordens-servico/{id}:
 *   get:
 *     summary: Busca uma O.S. por ID (com suas peças)
 *     tags:
 *       - OrdensServico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da O.S.
 *     responses:
 *       '200':
 *         description: O.S. encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdemServicoDetalhada'
 *       '404':
 *         description: O.S. não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao buscar O.S.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const osResult = await db.query(
      "SELECT * FROM ordens_servico WHERE id = $1",
      [id]
    );
    if (osResult.rows.length === 0) {
      return res.status(404).json({ error: "Ordem de Serviço não encontrada" });
    }
    const ordem = osResult.rows[0];

    const itensQuery = `
      SELECT ip.peca_id, p.nome, ip.quantidade, ip.preco_no_momento
      FROM itens_peca ip
      JOIN pecas p ON ip.peca_id = p.id
      WHERE ip.ordem_servico_id = $1
    `;
    const itensResult = await db.query(itensQuery, [id]);

    ordem.pecas = itensResult.rows;

    res.json(ordem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /ordens-servico/{id}:
 *   put:
 *     summary: Atualiza uma O.S. (Status, Mecânico, etc.)
 *     tags:
 *       - OrdensServico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da O.S. a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               mecanico_id:
 *                 type: integer
 *               data_fechamento:
 *                 type: string
 *                 format: date-time
 *               descricao_problema:
 *                 type: string
 *           example:
 *             status: "FECHADA"
 *             mecanico_id: 2
 *             data_fechamento: "2025-11-10T14:30:00Z"
 *     responses:
 *       '200':
 *         description: O.S. atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdemServico'
 *       '400':
 *         description: "Erro (ex.: mecanico_id não existe)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '404':
 *         description: O.S. não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao atualizar O.S.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status, mecanico_id, data_fechamento, descricao_problema } = req.body;

  try {
    const os = await db.query("SELECT * FROM ordens_servico WHERE id = $1", [
      id,
    ]);
    if (os.rows.length === 0) {
      return res.status(404).json({ error: "Ordem de Serviço não encontrada" });
    }
    const osAtual = os.rows[0];

    const query = `
      UPDATE ordens_servico SET 
        status = $1, 
        mecanico_id = $2, 
        data_fechamento = $3,
        descricao_problema = $4
      WHERE id = $5 RETURNING *
    `;
    const values = [
      status || osAtual.status,
      mecanico_id || osAtual.mecanico_id,
      data_fechamento || osAtual.data_fechamento,
      descricao_problema || osAtual.descricao_problema,
      id,
    ];

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Erro: O mecanico_id fornecido não existe." });
    }
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /ordens-servico/{id}:
 *   delete:
 *     summary: Deleta uma O.S.
 *     tags:
 *       - OrdensServico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da O.S. a ser deletada.
 *     responses:
 *       '204':
 *         description: O.S. deletada com sucesso (Sem conteúdo).
 *       '404':
 *         description: O.S. não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao deletar O.S.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM ordens_servico WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ordem de Serviço não encontrada" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
