const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

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

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO produtos (nome_produto, preco_produto) VALUES (?,?)',
            [req.body.nome_produto, req.body.preco_produto],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_produto: result.insertId,
                    nome: result.nome_produto,
                    preco: result.preco_produto
                });
            }
        )
    })


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