const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * /pecas:
 *   post:
 *     summary: Registra uma nova peça
 *     tags:
 *       - Pecas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PecaInput'
 *     responses:
 *       '201':
 *         description: Peça registrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *       '500':
 *         description: Erro ao registrar peça.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post("/", async (req, res) => {
  const { nome, preco_unidade, estoque } = req.body;
  try {
    const query =
      "INSERT INTO pecas (nome, preco_unidade, estoque) VALUES ($1, $2, $3) RETURNING *";
    const values = [nome, preco_unidade, estoque];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pecas:
 *   get:
 *     summary: Lista todas as peças
 *     tags:
 *       - Pecas
 *     responses:
 *       '200':
 *         description: Lista de peças retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peca'
 *       '500':
 *         description: Erro ao buscar peças.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pecas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pecas/{id}:
 *   get:
 *     summary: Busca uma peça por ID
 *     tags:
 *       - Pecas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da peça.
 *     responses:
 *       '200':
 *         description: Peça encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *       '404':
 *         description: Peça não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao buscar peça.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM pecas WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Peça não encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pecas/{id}:
 *   put:
 *     summary: Atualiza uma peça existente
 *     tags:
 *       - Pecas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da peça a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PecaInput'
 *     responses:
 *       '200':
 *         description: Peça atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *       '404':
 *         description: Peça não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao atualizar peça.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco_unidade, estoque } = req.body;
  try {
    const query =
      "UPDATE pecas SET nome = $1, preco_unidade = $2, estoque = $3 WHERE id = $4 RETURNING *";
    const values = [nome, preco_unidade, estoque, id];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Peça não encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /pecas/{id}:
 *   delete:
 *     summary: Deleta uma peça
 *     tags:
 *       - Pecas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da peça a ser deletada.
 *     responses:
 *       '204':
 *         description: Peça deletada com sucesso (Sem conteúdo).
 *       '400':
 *         description: Erro (por exemplo, peça está em uso em uma Ordem de Serviço).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '404':
 *         description: Peça não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao deletar peça.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM pecas WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Peça não encontrada" });
    }
    res.status(204).send();
  } catch (err) {
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Erro: Peça não pode ser deletada pois está em uso." });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
