const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * /veiculos:
 *   post:
 *     summary: Registra um novo veículo
 *     tags:
 *       - Veiculos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VeiculoInput'
 *     responses:
 *       '201':
 *         description: Veículo registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veiculo'
 *       '400':
 *         description: "Dados inválidos (exemplo: cliente_id não existe)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '500':
 *         description: Erro ao registrar veículo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post("/", async (req, res) => {
  const { placa, modelo, ano, cliente_id } = req.body;

  if (!placa || !cliente_id) {
    return res
      .status(400)
      .json({ error: "Placa e cliente_id são obrigatórios." });
  }

  try {
    const query =
      "INSERT INTO veiculos (placa, modelo, ano, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [placa, modelo, ano, cliente_id];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Erro: O cliente_id fornecido não existe." });
    }
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /veiculos:
 *   get:
 *     summary: Lista todos os veículos
 *     tags:
 *       - Veiculos
 *     responses:
 *       '200':
 *         description: Lista de veículos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Veiculo'
 *       '500':
 *         description: Erro ao buscar veículos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM veiculos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /veiculos/{id}:
 *   get:
 *     summary: Busca um veículo por ID
 *     tags:
 *       - Veiculos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo.
 *     responses:
 *       '200':
 *         description: Veículo encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veiculo'
 *       '404':
 *         description: Veículo não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao buscar veículo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM veiculos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /veiculos/{id}:
 *   put:
 *     summary: Atualiza um veículo existente
 *     tags:
 *       - Veiculos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VeiculoInput'
 *     responses:
 *       '200':
 *         description: Veículo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veiculo'
 *       '400':
 *         description: "Dados inválidos (exemplo: cliente_id não existe)."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '404':
 *         description: Veículo não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao atualizar veículo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { placa, modelo, ano, cliente_id } = req.body;
  try {
    const query =
      "UPDATE veiculos SET placa = $1, modelo = $2, ano = $3, cliente_id = $4 WHERE id = $5 RETURNING *";
    const values = [placa, modelo, ano, cliente_id, id];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Erro: O cliente_id fornecido não existe." });
    }
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /veiculos/{id}:
 *   delete:
 *     summary: Deleta um veículo
 *     tags:
 *       - Veiculos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo a ser deletado.
 *     responses:
 *       '204':
 *         description: Veículo deletado com sucesso (Sem conteúdo).
 *       '404':
 *         description: Veículo não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao deletar veículo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM veiculos WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
