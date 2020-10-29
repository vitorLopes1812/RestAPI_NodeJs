const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({ error: error })}
        //verificar se o email ja está cadastrado
        conn.query('SELECT * FROM usuarios WHERE email = ?', 
            [req.body.email],
            (error, result) => {
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


module.exports = router;