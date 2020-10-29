const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");
const rotaUsuarios = require("./routes/usuarios");

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false})); //aceita apenas dados simples
app.use(bodyParser.json()); //json de entrada no body

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).send({});
    }
    next();
})

app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);
app.use("/usuarios", rotaUsuarios);

//Tratamento de erro para rotas
app.use((req, res, next) => {
    const erro = new Error("Não encontrado");
    erro.status = 404;
    next(erro);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.send({
        erro: {
            mensagem: err.message
        }
    });
});

module.exports = app;