const express = require("express");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(
  "/api",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Documentação API Oficina",
  })
);

const clientesRoutes = require("./routes/clientes");
app.use("/clientes", clientesRoutes);

const veiculosRoutes = require("./routes/veiculos");
app.use("/veiculos", veiculosRoutes);

const mecanicosRoutes = require("./routes/mecanicos");
app.use("/mecanicos", mecanicosRoutes);

const pecasRoutes = require("./routes/pecas");
app.use("/pecas", pecasRoutes);

const ordensServicoRoutes = require("./routes/ordensServico");
app.use("/ordens-servico", ordensServicoRoutes);

app.listen(port, () => {
  console.log(`Servidor executando em http://localhost:${port}`);
  console.log(`Swagger UI disponível em http://localhost:${port}/api`);
});
