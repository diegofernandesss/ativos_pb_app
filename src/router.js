const express = require('express');

const router = express.Router();

const IctsController = require("./controllers/ictsController");
const PatenteConcedidaController = require("./controllers/patenteConcedidaController");
const PatentePendenteController = require("./controllers/patentePendenteController");
const ClassificacoesIpcController = require("./controllers/classificacaoIpcController");

const patenteMiddleware = require("./middlewares/patentesMiddleware");

// Icts
router
    .get("/icts", IctsController.getIcts)
    .get("/ict/:cnpj_ict", IctsController.getIct)

// Patentes Concedidas
router
    .get("/patentes_concedidas", 
    patenteMiddleware.validarPageLimit, 
    PatenteConcedidaController.getPatentesConcedidas)

    .get("/patente_concedida/:numero_pedido", PatenteConcedidaController.getPatenteConcedida)

    .get("/patentes_concedidas/ipc/:classificacao_ipc", 
    patenteMiddleware.validarPageLimit, 
    PatenteConcedidaController.getFiltroIpcPatentes)

    .get("/patentes_concedidas/classificacao_ipc/cod_subsecao/:id_sub_secao",
    patenteMiddleware.validarPageLimit, 
    PatenteConcedidaController.getFiltroPorCodigoIpc)

    .get("/patentes_concedidas/ict/:cnpj_ict", 
    patenteMiddleware.validarPageLimit, 
    PatenteConcedidaController.getFiltroIctPatentes)

// Patentes Pendentes
router
    .get("/patentes_pendentes", patenteMiddleware.validarPageLimit, PatentePendenteController.getPatentesPendentes)
    .get("/patente_pendente/:numero_pedido", patenteMiddleware.validarPageLimit, PatentePendenteController.getPatentePendente)
    .get("/patentes_pendentes/ict/:cnpj_ict", patenteMiddleware.validarPageLimit, PatentePendenteController.getFiltroIctPatentes)

// Classificacões ipc
router
    .get("/classificacoes_ipc", ClassificacoesIpcController.getSecoesIpc)
    .get("/classificacoes_ipc/sub_secao/:id_secao", ClassificacoesIpcController.getSubSecaoIpc)
    .get("/classificacoes_ipc/codigos_ipc/:id_sub_secao", ClassificacoesIpcController.getCodigosSecaoIpc)


module.exports = router;