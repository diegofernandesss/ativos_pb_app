const registroSoftwareModel = require("../models/registroSoftwareModel");
const ictModel = require("../models/ictsModel");
const {registrosSoftwareCorrigidos, registroSoftwareCorrigido} = require("./correcoes");

const getRegistrosSoftwares = async (request, response) => {

    const {page, limit} = request.query;

    if(page && limit) {
        let registros = await registroSoftwareModel.getAllPage(page, limit);
        let registrosSoftwares = registrosSoftwareCorrigidos(registros);
        let totalRegistros = await registroSoftwareModel.countRegistros();

        let qtdPages = Math.ceil(totalRegistros.count/limit);

        return response.status(200).json({
            registration_number: totalRegistros.count,
            number_pages: qtdPages,
            software_records: registrosSoftwares
        });
    }

    let registros = await registroSoftwareModel.getAll();
    let registrosSoftwares = registrosSoftwareCorrigidos(registros);

    return response.status(200).json({
        registration_number : registrosSoftwares.length,
        software_records : registrosSoftwares
    });
};

const getRegistroSoftware = async (request, response) => {
    let {numero_pedido} = request.params;
    numero_pedido = numero_pedido.replaceAll("_", " ");

    let [registro] = await registroSoftwareModel.get(numero_pedido);
    if(!registro) {
        return response.status(404).json({message: "Software registration not found!"})
    }
    registro = registroSoftwareCorrigido(registro);

    return response.status(200).json({software_registration:registro})
};

const getRegistrosSoftwaresIct = async (request, response) => {
    let {cnpj_ict} = request.params;
    let {page, limit} = request.query;

    let [ict] = await ictModel.getIct(cnpj_ict);
    if(!ict) {
        return response.status(404).json({message: "ICT not found!"})
    }

    let registros = await registroSoftwareModel.getAll();
    let registrosSoftwares = registrosSoftwareCorrigidos(registros);

    let registrosFiltrados = [];
    for(let registro of registrosSoftwares) {
        if(registro["nomes_titulares"].includes(ict.nome)) {
            registrosFiltrados.push(registro);
        } ;
    };

    if(registrosFiltrados.length == 0) {
        return response.status(404).json({message: "Software registration not found!"})
    }

    if(page && limit) {
        let registroPage = [];
        let offset = (page - 1) * limit;
        let tamanho = registrosFiltrados.length;
        let qtdPage = Math.ceil(tamanho/limit);
        for(let i = offset; i < offset+Number(limit); i++) {
            if(i >= tamanho) {
                break;
            }
            registroPage.push(registrosFiltrados[i]);
        }
        
        return response.status(200).json({
            registration_number: registrosFiltrados.length,
            number_pages: qtdPage,
            software_records : registroPage
        });
    }

    return response.status(200).json({
        registration_number : registrosFiltrados.length,
        software_records : registrosFiltrados
    });
};

const pesquisaRegistroSoftware = async (request, response) => {
    let {numero_pedido} = request.params;
    numero_pedido = numero_pedido.replaceAll("_", " ");

    let registrosSoftwares = await registroSoftwareModel.pesquisaRegistro(numero_pedido);

    return response.status(200).json({
        registration_number : registrosSoftwares.length,
        software_records : registrosSoftwares
    });
};

module.exports = {
    getRegistrosSoftwares,
    getRegistroSoftware,
    getRegistrosSoftwaresIct,
    pesquisaRegistroSoftware
};