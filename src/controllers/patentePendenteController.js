const patentePendenteModel = require("../models/patentePendenteModel");
const ictsModel = require("../models/ictsModel");
const {patentesPendentesCorrigidas, patentePendenteCorrigida} = require("./correcoes");

const getPatentesPendentes = async (request, response) => {
    const {page, limit} = request.query;

    if (page && limit) {
        var patentesPendentes = await patentePendenteModel.getAllPages(page, limit);
        let totalPatentes = await patentePendenteModel.countPatentes();

        let patentes = patentesPendentesCorrigidas(patentesPendentes);

        let qtdPages = Math.ceil(totalPatentes.count/limit);
        
        return response.status(200).json({
            number_patentes: totalPatentes.count,
            number_pages: qtdPages,
            patentes
        });
    }
    
    var patentesPendentes = await patentePendenteModel.getAll();

    let patentes = patentesPendentesCorrigidas(patentesPendentes);

    return response.status(200).json({
        number_patentes: patentesPendentes.length,
        patentes: patentesPendentes
    });
};

const getPatentePendente = async (request, response) => {
    const {numero_pedido} = request.params;

    const patentePentente = await patentePendenteModel.get(numero_pedido);
    
    if(patentePentente.length == 0) {
        return response.status(401).json({mensege: "Patente not found!"});
    };

    let patente = patentePendenteCorrigida(patentePentente[0]);

    return response.status(200).json(patente);
};

const getFiltroIctPatentes = async (request, response) => {
    const {cnpj_ict} = request.params;
    const {page, limit} = request.query;
    
    const patentes = patentesPendentesCorrigidas(await patentePendenteModel.getAll());

    const [ict] = await ictsModel.getIct(cnpj_ict);

    if (ict.length == 0) {
        return response.status(404).json({mensege: "ict not found"});
    }
    
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

    let patentes= await patentePendenteModel.pesquisaPatente(numero_pedido);

    return response.status(200).json({
        number_patentes: patentes.length,
        patentes
    });
}

module.exports = {
    getPatentesPendentes,
    getPatentePendente,
    getFiltroIctPatentes,
    getPesquisaPatentes
}