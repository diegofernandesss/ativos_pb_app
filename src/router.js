const express = require('express');

const router = express.Router();

const IctsController = require("./controllers/ictsController");
const PatenteConcedidaController = require("./controllers/patenteConcedidaController");
const PatentePendenteController = require("./controllers/patentePendenteController");
const ClassificacoesIpcController = require("./controllers/classificacaoIpcController");
const RegistroSoftwareController = require("./controllers/registroSoftwareController");

const middlewares = require("./middlewares/middlewares");

// Icts
router
    .get("/icts", IctsController.getIcts)
    .get("/ict/:cnpj_ict", IctsController.getIct)

// Patentes Concedidas
router
    .get("/patentes_concedidas", 
    middlewares.validarPageLimit, 
    PatenteConcedidaController.getPatentesConcedidas)

    .get("/patente_concedida/:numero_pedido", PatenteConcedidaController.getPatenteConcedida)

    .get("/patentes_concedidas/ipc/:classificacao_ipc", 
    middlewares.validarPageLimit, 
    PatenteConcedidaController.getFiltroIpcPatentes)

    .get("/patentes_concedidas/classificacao_ipc/cod_subsecao/:id_sub_secao",
    middlewares.validarPageLimit, 
    PatenteConcedidaController.getFiltroPorCodigoIpc)

    .get("/patentes_concedidas/ict/:cnpj_ict", 
    middlewares.validarPageLimit, 
    PatenteConcedidaController.getFiltroIctPatentes)

    .get("/pesquisa_patente/concedida/:numero_pedido", PatenteConcedidaController.getPesquisaPatentes)

// Patentes Pendentes
router
    .get("/patentes_pendentes", 
    middlewares.validarPageLimit, 
    PatentePendenteController.getPatentesPendentes)

    .get("/patente_pendente/:numero_pedido", 
    middlewares.validarPageLimit,
    PatentePendenteController.getPatentePendente)

    .get("/patentes_pendentes/ict/:cnpj_ict", 
    middlewares.validarPageLimit, 
    PatentePendenteController.getFiltroIctPatentes)

    .get("/pesquisa_patente/pendente/:numero_pedido", PatentePendenteController.getPesquisaPatentes)

// Classificacões ipc
router
    .get("/classificacoes_ipc", ClassificacoesIpcController.getSecoesIpc)
    .get("/classificacoes_ipc/sub_secao/:id_secao", ClassificacoesIpcController.getSubSecaoIpc)
    .get("/classificacoes_ipc/codigos_ipc/:id_sub_secao", ClassificacoesIpcController.getCodigosSecaoIpc)

// Registros de Softwares
router
    .get("/registros_softwares", 
        middlewares.validarPageLimit, 
        RegistroSoftwareController.getRegistrosSoftwares)
    
    .get("/registro_software/:numero_pedido", RegistroSoftwareController.getRegistroSoftware)
    
    .get("/registros_softwares/ict/:cnpj_ict", 
        middlewares.validarPageLimit, 
        RegistroSoftwareController.getRegistrosSoftwaresIct)

    .get("/pesquisa_registro_software/:numero_pedido", RegistroSoftwareController.pesquisaRegistroSoftware)

module.exports = router;