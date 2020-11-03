const express = require("express");
const router = express.Router();
const multer = require('multer');
const login = require("../middleware/login");

const ProdutosController = require("../controllers/produtos-controller");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); //configura local de armazenamento
    },
    filename: function (req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname ); //pega a data em que foi inserido o arquivo + o nome real do arquivo 
    }
}); 

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    } else {
        cb(null,false);
    }
}

const upload = multer({ 
    storage: storage ,
    limits: {
        fileSize: 1024 * 1024 * 5, //5 Mb limite do arquivo
        fileFilter: fileFilter
    }
});

//retorna todos os produtos
router.get('/', ProdutosController.getProdutos);

//Adiciona um novo produto ao banco de dados
router.post('/', login.obrigatorio, upload.single('produto_imagem') ,ProdutosController.postProdutos);

//seleciona um produto específico do banco de dados a partir de seu id
router.get('/:id_produto', ProdutosController.getProdutoEspecifico);

//atualiza os dados de um produto
router.patch('/', login.obrigatorio, ProdutosController.patchProduto);

//remove um produto do banco de dados
router.delete('/:id_produto', login.obrigatorio, ProdutosController.deleteProduto);

module.exports = router;