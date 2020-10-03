const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).send({
        mensagem: 'Get vindo da rota de pedidos'
    });
});

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    res.status(200).send({
        mensagem: 'Get de um pedido específico',
        id: id
    });
});


router.patch("/", (req, res, next) => {
    res.status(201).send({
        mensagem: 'Patch na rota de pedido'
    });
});

module.exports = router;