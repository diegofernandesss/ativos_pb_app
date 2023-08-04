const ictsModel = require("../models/ictsModel");

const getIcts = async (_request, response) => {
    const icts = await ictsModel.getAll();
    return response.status(200).json(icts);
};

const getIct = async (request, response) => {
    const {cnpj_ict} = request.params;

    const ict = await ictsModel.getIct(cnpj_ict);

    if (!ict) {
        return response.status(404).json({mensege: "ict not found"});
    }
    return response.status(200).json(ict);
};

module.exports = {
    getIcts,
    getIct
};