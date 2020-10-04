const express = require("express");
const app = express();
const morgan = require("morgan");

const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");

app.use(morgan('dev'));

app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);

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