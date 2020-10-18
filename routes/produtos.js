const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//retorna todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})};
        conn.query(
            'SELECT * FROM produtos ;',
            (error,resultado,field) => {
                if(error){return res.status(500).send({ error: error})};
                return res.status(200).send({ response: resultado })
            }
        )
    });
});

//Adiciona um novo produto ao banco de dados
router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };

    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome_produto, preco_produto) VALUES (?,?)',
            [req.body.nome_produto, req.body.preco_produto],
            (err, result, field) => {
                conn.release();

                if(err){ return res.status(500).send({ error: err, response: null}) }

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

//seleciona um produto específico do banco de dados a partir de seu id
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})};
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (err,resultado,field) => {
                if(err){return res.status(500).send({ error: err})};
                return res.status(200).send({ response: resultado})
            }
        )
    })
});

//atualiza os dados de um produto
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error })}
        conn.query(
            `UPDATE produtos SET
                nome_produto = ?,
                preco_produto = ?
                WHERE id_produto = ? `,
                [
                    req.body.nome_produto,
                    req.body.preco_produto,
                    req.body.id_produto
                ],
                (err, resultado, field) => {
                    if(err){return res.status(500).send({ error: err })}
                    return res.status(201).send({
                        mensagem: "Produto alterado com sucesso"
                    })
                }
        )
    })
});

//remove um produto do banco de dados
router.delete('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})};
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (err, field, resultado) => {
                conn.release();
                if(err){res.status(500).send({ error: err })};
                return res.status(200).send({
                    mensagem: "O produto foi excluido com sucesso"
                })
            }
        )
    })
});

module.exports = router;