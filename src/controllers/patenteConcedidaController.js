const patentesConcedidasModel = require("../models/patenteConcedidaModel");
const ictsModel = require("../models/ictsModel");
const classificacaoesIpcModel = require("../models/classificacaoIpcModel")
const {patentesConcedidasCorrigidas, patenteConcedidaCorrigida} = require("./correcoes");

const getPatentesConcedidas = async (request, response) => {

    const {page, limit} = request.query;

    if (page && limit) {
        let patentesConcedidas = await patentesConcedidasModel.getAllPage(page, limit);
        let totalPatentes = await patentesConcedidasModel.countPatentes();

        let patentes = patentesConcedidasCorrigidas(patentesConcedidas);

        let qtdPages = Math.ceil(totalPatentes.count/limit);
        
        return response.status(200).json({
            number_patentes : totalPatentes.count,
            number_pages: qtdPages,
            patentes
        });

    }

    var patentesConcedidas = await patentesConcedidasModel.getAll();

    let patentes = patentesConcedidasCorrigidas(patentesConcedidas);
    
    return response.status(200).json({
        number_patentes: patentes.length,
        patentes});
};

const getPatenteConcedida = async (request, response) => {
    const {numero_pedido} = request.params;
    const newNumeroPedido = numero_pedido.split("_").join(" ");

    const patenteConcedida = await patentesConcedidasModel.get(newNumeroPedido);

    if (patenteConcedida.length == 0) {
        return response.status(401).json({message : "Patente not found!"});
    }

    const patente = patenteConcedidaCorrigida(patenteConcedida[0]);

    return response.status(200).json(patente);
};

const getFiltroIpcPatentes = async (request, response) => {
    const {page, limit} = request.query;

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
        return response.status(404).json({message : "Patente not found!"})
    }

    if(page && limit) {
        let patentesPage = [];
        let offset = (page - 1) * limit;
        let tamanho = patentesFiltro.length;
        let qtdPage = Math.ceil(tamanho/limit);
        for(let i = offset; i < offset+Number(limit); i++) {
            if(i >= tamanho) {
                break;
            }
            patentesPage.push(patentesFiltro[i]);
        }
        
        return response.status(200).json({
            number_patentes: patentesFiltro.length,
            number_pages: qtdPage,
            patentes : patentesPage
        });
    }

    return response.status(200).json({
        number_patentes: patentesFiltro.length,
        patentesFiltro
    });
};

// Filtro por codigo ipc e também pode fazer por ict
const getFiltroPorCodigoIpc = async (request, response) => {

    let {id_sub_secao} = request.params;
    let {page, limit, sigla_ict} = request.query;

    // Codigos de SubSeção IPC.
    let codigosSubSecaoIpc = await classificacaoesIpcModel.getCodigosSubSecaoIpc(id_sub_secao);
    if(codigosSubSecaoIpc.length == 0) {
        return response.status(404).json({message: "ipc not found"});
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

    // Filtragem por codigos de SubSeção IPC
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
                patentesFiltradas.push(patente);
            }
        }
    }
    
    if(!patentesFiltradas) {
        return response.status(404).json({message: "Patentes not found"});
    }

    if(page && limit) {
        let patentesPage = [];
        let offset = (page - 1) * limit;
        let tamanho = patentesFiltradas.length;
        let qtdPage = Math.ceil(tamanho/limit);
        for(let i = offset; i < offset+Number(limit); i++) {
            if(i >= tamanho) {
                break;
            }
            patentesPage.push(patentesFiltradas[i]);
        }
        
        return response.status(200).json({
            number_patentes: patentesFiltradas.length,
            number_pages: qtdPage,
            patentes : patentesPage
        });
    }

    return response.status(200).json({
        number_patentes: patentesFiltradas.length,
        patentes: patentesFiltradas
    });
};

const getFiltroIctPatentes = async (request, response) => {
    const {cnpj_ict} = request.params;
    const {page, limit} = request.query;

    const [ict] = await ictsModel.getIct(cnpj_ict);
    if (ict.length == 0) {
        return response.status(404).json({message: "ict not found"});
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
        return response.status(404).json({message : "Patente not found!"})
    }

    if(page && limit) {
        let patentesPage = [];
        let offset = (page - 1) * limit;
        let tamanho = patentesFiltrada.length;
        let qtdPage = Math.ceil(tamanho/limit);
        for(let i = offset; i < offset+Number(limit); i++) {
            if(i >= tamanho) {
                break;
            }
            patentesPage.push(patentesFiltrada[i]);
        }
        
        return response.status(200).json({
            number_patentes: patentesFiltrada.length,
            number_pages: qtdPage,
            patentes : patentesPage
        });
    }


    return response.status(200).json({
        number_patentes: patentesFiltrada.length,
        patentes: patentesFiltrada
    });

};

const getPesquisaPatentes = async (request, response) => {
    let {numero_pedido} = request.params;

    numero_pedido = numero_pedido.replaceAll("_", " ")

    let patentes= await patentesConcedidasModel.pesquisaPatente(numero_pedido);

    return response.status(200).json({
        number_patentes: patentes.length,
        patentes
    });
};

module.exports = {
    getPatentesConcedidas,
    getPatenteConcedida,
    getFiltroIpcPatentes,
    getFiltroPorCodigoIpc,
    getFiltroIctPatentes,
    getPesquisaPatentes,
}