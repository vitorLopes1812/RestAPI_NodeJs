const express = require("express");
const router = express.Router();

const PedidosController = require("../controllers/pedidos-controller")

router.get("/", PedidosController.getPedidos);

router.post("/", PedidosController.postPedido);

router.get("/:id_pedido", PedidosController.getPedidoEspecifico);

router.delete("/:id_pedido", PedidosController.deletePedido);

module.exports = router;