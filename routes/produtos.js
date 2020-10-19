const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const urlAPI = 'http://localhost:3000/produtos/';

//retorna todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})};
        conn.query(
            'SELECT * FROM produtos ;',
            (error,result,field) => {
                if(error){return res.status(500).send({ error: error})};
                const reponse = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return{
                            id_produto: prod.id_produto,
                            nome_produto: prod.nome_produto,
                            preco_produto: prod.preco_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto específico',
                                url: urlAPI + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send({ response })
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

                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome_produto: result.nome_produto,
                        preco_produto: result.preco_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: urlAPI
                        }
                    }
                }

                return res.status(201).send({ response });
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
            (err,result,field) => {
                if(err){return res.status(500).send({ error: err})};

                if(result.length == 0){ 
                    return res.status(500).send({ 
                        mensagem: "Não foi encontrado produto com este ID" 
                    })
                }

                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome_produto: result[0].nome_produto,
                        preco_produto: result[0].preco_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: urlAPI
                        }
                    }
                }
                return res.status(200).send({ response })
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
                (err, result, field) => {
                    if(err){return res.status(500).send({ error: err })}

                    const response = {
                        mensagem: 'Produto atualizado com sucesso',
                        produtoAtualizado: {
                            id_produto: req.body.id_produto,
                            nome_produto: req.body.nome_produto,
                            preco_produto: req.body.preco_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os dados de um produto específico',
                                url: urlAPI + req.body.id_produto
                            }
                        }
                    }
                    return res.status(202).send({ response })
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
            (err, field, result) => {
                conn.release();
                if(err){res.status(500).send({ error: err })};

                const response = {
                    mensagem: 'Produto excluído com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: urlAPI,
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send({ response })
            }
        )
    })
});

module.exports = router;