const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @swagger
 * /mecanicos:
 *   post:
 *     summary: Registra um novo mecânico
 *     tags:
 *       - Mecanicos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MecanicoInput'
 *     responses:
 *       '201':
 *         description: Mecânico registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mecanico'
 *       '500':
 *         description: Erro ao registrar mecânico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post("/", async (req, res) => {
  const { nome, especialidade } = req.body;
  try {
    const query =
      "INSERT INTO mecanicos (nome, especialidade) VALUES ($1, $2) RETURNING *";
    const values = [nome, especialidade];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /mecanicos:
 *   get:
 *     summary: Lista todos os mecânicos
 *     tags:
 *       - Mecanicos
 *     responses:
 *       '200':
 *         description: Lista de mecânicos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mecanico'
 *       '500':
 *         description: Erro ao buscar mecânicos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mecanicos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /mecanicos/{id}:
 *   get:
 *     summary: Busca um mecânico por ID
 *     tags:
 *       - Mecanicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do mecânico.
 *     responses:
 *       '200':
 *         description: Mecânico encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mecanico'
 *       '404':
 *         description: Mecânico não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao buscar mecânico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM mecanicos WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mecânico não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /mecanicos/{id}:
 *   put:
 *     summary: Atualiza um mecânico existente
 *     tags:
 *       - Mecanicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do mecânico a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MecanicoInput'
 *     responses:
 *       '200':
 *         description: Mecânico atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mecanico'
 *       '404':
 *         description: Mecânico não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao atualizar mecânico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, especialidade } = req.body;
  try {
    const query =
      "UPDATE mecanicos SET nome = $1, especialidade = $2 WHERE id = $3 RETURNING *";
    const values = [nome, especialidade, id];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mecânico não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /mecanicos/{id}:
 *   delete:
 *     summary: Deleta um mecânico
 *     tags:
 *       - Mecanicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do mecânico a ser deletado.
 *     responses:
 *       '204':
 *         description: Mecânico deletado com sucesso (Sem conteúdo).
 *       '404':
 *         description: Mecânico não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '500':
 *         description: Erro ao deletar mecânico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM mecanicos WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mecânico não encontrado" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
