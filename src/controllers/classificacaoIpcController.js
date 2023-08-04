const classificacaoesIpc = require("../models/classificacaoIpcModel");

const getSecoesIpc = async (_request, response) => {
    const secoesIpc = await classificacaoesIpc.getSecoesIpc();
    return response.status(200).json(secoesIpc);
}

const getSubSecaoIpc = async (request, response) => {
    const {id_secao} = request.params;

    const subsSecao = await classificacaoesIpc.getSubSecaoIpc(id_secao);

    return response.status(200).json(subsSecao);
}

const getCodigosSecaoIpc = async (request, response) => {
    const {id_sub_secao} = request.params;

    const codigoSubSecao = await classificacaoesIpc.getCodigosSubSecaoIpc(id_sub_secao);

    if(codigoSubSecao.length == 0) {
        return response.status(201).json({mensage:"Not found code Sub Section IPC!"})
    }

    var cods = []
    for (const cod of codigoSubSecao) {
        cods.push(cod["codigo"]);
    }

    return response.status(200).json({codigos: cods});
}

module.exports = {
    getSecoesIpc,
    getSubSecaoIpc,
    getCodigosSecaoIpc,
}