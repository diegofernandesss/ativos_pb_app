const connection = require("./connection");

const getAll = async () => {
    const [patentesConcedidas] = await connection.execute("SELECT * FROM patentes_concedidas order by data_deposito desc");
    return patentesConcedidas;
};

const getAllPage = async (page, limit) => {
    let offset = (page - 1) * limit;
    const [patentesConcedidas] = await connection.execute("SELECT * FROM patentes_concedidas order by data_deposito desc LIMIT ? OFFSET ?;",[limit,offset]);
    return patentesConcedidas;
}

const get = async (numero_pedido) => {
    const [patenteConcedida] = await connection.execute("SELECT * FROM patentes_concedidas WHERE numero_pedido = ?",[numero_pedido]);
    return patenteConcedida;
};
module.exports = {
    getAll,
    getAllPage,
    get,
}