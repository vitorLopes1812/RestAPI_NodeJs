const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error })}
        //verificar se o email ja está cadastrado
        conn.query(
            'SELECT * FROM usuarios WHERE email = ?', 
            [req.body.email],
            (error, result) => {
                conn.release();
                if(error){return res.status(500).send({ error: error })}
                if(result.length > 0){
                    return res.status(409).send({
                        mensagem: 'Usuário já cadastrado'
                    })
                }else{
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if(errBcrypt){ return res.status(500).send({ error: errBcrypt})}
                        conn.query(
                            'INSERT INTO usuarios (email, senha) VALUES (?,?)',
                            [
                                req.body.email,
                                hash
                            ],
                            (err, results) => {
                                conn.release();
                                if(err){return res.status(500).send({ error: error })}
                                const response = {
                                    mensagem: 'Usuário criado com sucesso',
                                    usuarioCriado: {
                                        id_usuario: results.insertId,
                                        email: req.body.email
                                    }
                                }
            
                                return res.status(201).send({ response });
                            }
                        )
                    })
                }
            }
        )
    })
})

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [req.body.email],
            (err, results, field) => { //esse results recebe o que vem da query (usar nomes diferentes 'results', 'result', 'resultado')
                conn.release();
                if(err){return res.status(500).send({ error: err})}
                if(results.length < 1){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' })
                }
                bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                    if(err){
                        return res.status(401).send({mensagem: 'Falha na autenticação' })
                    }
                    if(result){
                        const token = jwt.sign({
                            id_usuario: results[0].id_usuario,
                            email: results[0].email
                        }, 
                        process.env.JWT_KEY, {
                            expiresIn: '1h'
                        });

                        return res.status(200).send({ 
                            mensagem: 'Autenticado com sucesso',
                            token: token
                        });
                    }
                    return res.status(401).send({ mensagem: 'Falha na autenticação '})
                })
            }
        )
    })
})

module.exports = router;