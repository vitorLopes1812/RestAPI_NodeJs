const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const PedidosController = require("../controllers/pedidos-controller")

router.get("/", PedidosController.getPedidos);

router.post("/", login.obrigatorio, PedidosController.postPedido);

router.get("/:id_pedido", login.obrigatorio, PedidosController.getPedidoEspecifico);

router.delete("/:id_pedido", login.obrigatorio, PedidosController.deletePedido);

module.exports = router;