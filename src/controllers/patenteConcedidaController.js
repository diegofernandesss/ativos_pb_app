const patentesConcedidasModel = require("../models/patenteConcedidaModel");
const ictsModel = require("../models/ictsModel");
const classificacaoesIpcModel = require("../models/classificacaoIpcModel")
const {patentesConcedidasCorrigidas, patenteConcedidaCorrigida} = require("./correcoes");

const getPatentesConcedidas = async (request, response) => {

    const {page, limit} = request.query;
    if (page && limit) {
        var patentesConcedidas = await patentesConcedidasModel.getAllPage(page, limit);
    } else {
        var patentesConcedidas = await patentesConcedidasModel.getAll();
    }

    let patentes = patentesConcedidasCorrigidas(patentesConcedidas);
    
    return response.status(200).json(patentes);
};

const getPatenteConcedida = async (request, response) => {
    const {numero_pedido} = request.params;
    const newNumeroPedido = numero_pedido.split("_").join(" ");

    const patenteConcedida = await patentesConcedidasModel.get(newNumeroPedido);

    if (patenteConcedida.length == 0) {
        return response.status(401).json({mensege : "Patente not found!"});
    }

    const patente = patenteConcedidaCorrigida(patenteConcedida[0]);

    return response.status(200).json(patente);
}

const getFiltroIpcPatentes = async (request, response) => {
    const patentesConcedidas = await patentesConcedidasModel.getAll();
    let patentes = patentesConcedidasCorrigidas(patentesConcedidas);

    const {classificacao_ipc} = request.params;

    let patentesFiltro = []
    for (const patente of patentes) {
        for(const classe of patente["classificacoes_ipc"]) {
            if (classificacao_ipc == classe.slice(0,3)) {
                patentesFiltro.push(patente);
                break;
            }
        }
    }
    if (!patentesFiltro) {
        return response.status(404).json({mensege : "Patente not found!"})
    }

    return response.status(200).json(patentesFiltro)
};

const getFiltroCodigoIpcPatentes = async (request, response) => {
    const patentesConcedidas = await patentesConcedidasModel.getAll();
    let patentes = patentesConcedidasCorrigidas(patentesConcedidas);

    const {id_sub_secao} = request.params;
    const {sigla_ict} = request.query;

    const codigoSubSecao = await classificacaoesIpcModel.getCodigosSubSecaoIpc(id_sub_secao);

    if(codigoSubSecao.length == 0) {
        return response.status(201).json({mensage:"Not found code Sub Section IPC!"})
    }

    let codigosIpc = []
    for (const cod of codigoSubSecao) {
        codigosIpc.push(cod["codigo"]);
    }

    const existeClassificacao = (classes, codigosIpc) => {
        for(const classe of classes) {
            if (codigosIpc.includes(classe.slice(0,3)));
                return true;
        }
        return false;
    }

    let patentesFiltro = [];
    if(sigla_ict) {
        let ict = await ictsModel.getIctSigla(sigla_ict.toUpperCase());

        for (const patente of patentes) {
            if (patente["depositantes"].includes(ict[0]["nome"]) && existeClassificacao(patente["classificacoes_ipc"], codigosIpc)) {
                patentesFiltro.push(patente);       
            }
        }
    } else {
        for (const patente of patentes) {
            for(const classe of patente["classificacoes_ipc"]) {
                if (codigosIpc.includes(classe.slice(0,3))) {
                    patentesFiltro.push(patente);
                    break;
                }
            }
        }
    }

    if (!patentesFiltro) {
        return response.status(404).json({mensege : "Patente not found!"})
    }

    return response.status(200).json(patentesFiltro)
};

const getFiltroIctPatentes = async (request, response) => {
    const {cnpj_ict} = request.params;
    
    const patentes = patentesConcedidasCorrigidas(await patentesConcedidasModel.getAll());

    const ict = await ictsModel.getIct(cnpj_ict);

    if (ict.length == 0) {
        return response.status(404).json({mensege: "ict not found"});
    }
    
    const patentesFiltrada = [];
    for (const patente of patentes) {
        for(const depositante of patente["depositantes"]) {
            if (ict[0]["nome"] == depositante) {
                patentesFiltrada.push(patente);
                break;
            }
        }
    }
    if (!patentesFiltrada) {
        return response.status(404).json({mensege : "Patente not found!"})
    }

    return response.status(200).json(patentesFiltrada);

};

const getFiltroIctIpcPatentes = async (request, response) => {
    const {cnpj_ict} = request.params;
    const {classificacao_ipc} = request.params;
    
    const patentes = patentesConcedidasCorrigidas(await patentesConcedidasModel.getAll());

    const ict = await ictsModel.getIct(cnpj_ict);

    if (ict.length == 0) {
        return response.status(404).json({mensege: "ict not found"});
    }
    
    const existeClassificacao = (classes, SecaoClasse) => {
        for(const classe of classes) {
            if (classe.slice(0,3) == SecaoClasse)
                return true
        }
        return false
    }

    const patentesFiltrada = [];
    for (const patente of patentes) {
        if (patente["depositantes"].includes(ict[0]["nome"]) && existeClassificacao(patente["classificacoes_ipc"],classificacao_ipc)) {
            patentesFiltrada.push(patente);       
        }
    }
    if (!patentesFiltrada) {
        return response.status(404).json({mensege : "Patente not found!"})
    }

    return response.status(200).json(patentesFiltrada);

};

module.exports = {
    getPatentesConcedidas,
    getPatenteConcedida,
    getFiltroIpcPatentes,
    getFiltroCodigoIpcPatentes,
    getFiltroIctPatentes,
    getFiltroIctIpcPatentes,
}