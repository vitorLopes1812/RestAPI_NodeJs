const express = require("express");
const { prependOnceListener } = require("../app");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os produtos'
    });
});

router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };

    res.status(201).send({
        mensagem: 'Produto foi criado',
        ProdutoCriado: produto
    });
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    res.status(200).send({
        mensagem: 'Detalhes do produto',
        id_produto: id
    });

});

router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Alterar produto'
    });
});

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto excluido'
    })
})

module.exports = router;