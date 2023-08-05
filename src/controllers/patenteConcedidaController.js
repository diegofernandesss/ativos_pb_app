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
};

const getFiltroIpcPatentes = async (request, response) => {
    var patentesConcedidas = await patentesConcedidasModel.getAll();

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

// Atualizado
const getFiltroPorCodigoIpc = async (request, response) => {

    let {id_sub_secao} = request.params;
    let {page, limit, sigla_ict} = request.query;

    // Codigos de SubSeção IPC.
    let codigosSubSecaoIpc = await classificacaoesIpcModel.getCodigosSubSecaoIpc(id_sub_secao);
    if(codigosSubSecaoIpc.length == 0) {
        return response.status(404).json({mensege: "ipc not found"});
    }
    let codigosIpc = codigosSubSecaoIpc.map((cod) => { return cod["codigo"]})

    // Patentes Concedidas.
    let patentes = patentesConcedidasCorrigidas(await patentesConcedidasModel.getAll());

    // Se a classificação contem na patente.
    let contemClassificacao = (patente, codigosIpc) => {
        for(let cod of patente["classificacoes_ipc"]) {
            if(codigosIpc.includes(cod.slice(0,3))) {
                return true;
            }
        }
        return false;
    };

    // Filtragem por IPC
    let patentesFiltradas = [];
    if(sigla_ict) {
        let [ict] = await ictsModel.getIctSigla(sigla_ict);
        for(let patente of patentes) {
            if(contemClassificacao(patente,codigosIpc) && patente["depositantes"].includes(ict["nome"])) {
                patentesFiltradas.push(patente);
            }
        }
    } else {
        for(let patente of patentes) {
            if(contemClassificacao(patente,codigosIpc)) {
                console.log(patente);
                patentesFiltradas.push(patente);
            }
        }
    }
    
    if(!patentesFiltradas) {
        return response.status(404).json({mensege: "Patentes not found"});
    }

    if(page && limit) {
        let patentePage = [];
        let offset = (page - 1) * limit;
        let tamanho = patentesFiltradas.length;
        for(let i = offset; i < offset+Number(limit); i++) {
            if(i >= tamanho) {
                break;
            }
            patentePage.push(patentesFiltradas[i]);
        }
        patentesFiltradas = patentePage;
    }

    if(!patentesFiltradas) {
        return response.status(404).json({mensege: "Patentes not found"});
    }
    
    return response.status(200).json(patentesFiltradas);
};

const getFiltroIctPatentes = async (request, response) => {
    const {cnpj_ict} = request.params;
    const {page, limit} = request.query;

    const [ict] = await ictsModel.getIct(cnpj_ict);
    if (ict.length == 0) {
        return response.status(404).json({mensege: "ict not found"});
    }

    let patentesConcedidas = await patentesConcedidasModel.getAll();
    let patentes = patentesConcedidasCorrigidas(patentesConcedidas);
    
    let patentesFiltrada = [];
    for (const patente of patentes) {
        if(patente["depositantes"].includes(ict["nome"])) {
            patentesFiltrada.push(patente);
        }
    }

    if (!patentesFiltrada) {
        return response.status(404).json({mensege : "Patente not found!"})
    }

    if(page && limit) {
        let patentePage = [];
        let offset = (page - 1) * limit;
        let tamanho = patentesFiltrada.length;
        for(let i = offset; i < offset+Number(limit); i++) {
            if(i >= tamanho) {
                break;
            }
            patentePage.push(patentesFiltrada[i]);
        }
        patentesFiltrada = patentePage;
    }

    if(!patentesFiltrada) {
        return response.status(404).json({mensege: "Patentes not found"});
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
    getFiltroPorCodigoIpc,
    getFiltroIctPatentes,
}
