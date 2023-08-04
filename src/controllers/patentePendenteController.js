const patentePendenteModel = require("../models/patentePendenteModel");
const ictsModel = require("../models/ictsModel");
const {patentesPendentesCorrigidas, patentePendenteCorrigida} = require("./correcoes");

const getPatentesPendentes = async (request, response) => {

    const {page, limit} = request.query;
    if (page && limit) {
        var patentesPendentes = await patentePendenteModel.getAllPages(page, limit);
    } else {
        var patentesPendentes = await patentePendenteModel.getAll();
    }

    let patentes = patentesPendentesCorrigidas(patentesPendentes);

    return response.status(200).json(patentes);
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
    
    const patentes = patentesPendentesCorrigidas(await patentePendenteModel.getAll());

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

module.exports = {
    getPatentesPendentes,
    getPatentePendente,
    getFiltroIctPatentes,
}