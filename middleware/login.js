// Verifica se o usuário possui um token válido, sabendo que cada token tem tempo de expiração de 1 hora.

const jwt = require("jsonwebtoken");

exports.obrigatorio = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1] //passar token pelo header -> Authorization / Bearer {token}
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.usuario = decode;
        next();
    } catch(error){
        return res.status(401).send({
            mensagem: "Falha na autenticação"
        })
    }
}

exports.opcional = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.usuario = decode;
        next();
    } catch(error){
        next();
    }
}