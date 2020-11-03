const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool;
const urlAPI = 'http://localhost:3000/pedidos/';

exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM pedidos',
            (err, result, field) => {
                conn.release();
                if(err){return res.status(500).send({ erro: err})}
                const response = {
                    mensagem: 'Todos os pedidos foram retornados com sucesso',
                    response: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido específico',
                                url: urlAPI + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send({ response });
            }
        );
    });
};

exports.postPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error })}
        
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [
                req.body.id_produto
            ],
            (err, field, result) => {
                conn.release();
                if(err){ return res.status(500).send({ error: err })}
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    })
                }
            }
        )

        conn.query(
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
            [
                req.body.id_produto,
                req.body.quantidade
            ],
            (err,field,result) => {
                conn.release();
                if(err){ return res.status(500).send({ error: err })}
                
                const response = {
                    mensagem: 'Pedido inserido com sucesso',
                    pedidoCriado: {
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: urlAPI
                        }
                    }
                }

                return res.status(201).send({ response });
            }

        )
    })
};

exports.getPedidoEspecifico =  (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})};
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [
                req.params.id_pedido
            ],
            (err,result,field) => {
                conn.release();
                if(err){return res.status(500).send({ error: err})};
                if(result.length == 0){
                    conn.release(); 
                    return res.status(500).send({ 
                        mensagem: "Não foi encontrado pedido com este ID" 
                    })
                }

                const response = {
                    produto: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: urlAPI
                        }
                    }
                }
                return res.status(200).send({ response })
            }
        )
    })
};

exports.deletePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error})}

        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [
                req.params.id_pedido
            ],
            (err, field, result) => {
                conn.release();
                if(err){ return res.status(500).send({ erro: err })}

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'GET',
                        descricao: 'Insere um pedido',
                        url: urlAPI,
                        body: {
                            id_produto: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send({ response });
            }
        )
    })
}