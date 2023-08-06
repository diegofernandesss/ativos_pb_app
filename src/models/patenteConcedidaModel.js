const connection = require("./connection");

const getAll = async () => {
    const [patentesConcedidas] = await connection.execute("SELECT * FROM patentes_concedidas order by data_deposito desc");
    return patentesConcedidas;
};

const getAllPage = async (page, limit) => {
    let offset = (page - 1) * limit;
    const [patentesConcedidas] = await connection.execute(`SELECT * FROM patentes_concedidas ORDER BY data_deposito DESC LIMIT ${limit} OFFSET ${offset}`);
    return patentesConcedidas;
}

const get = async (numero_pedido) => {
    const [patenteConcedida] = await connection.execute("SELECT * FROM patentes_concedidas WHERE numero_pedido = ?",[numero_pedido]);
    return patenteConcedida;
};

const countPatentes = async () => {
    const [countPatentes] = await connection.execute("SELECT COUNT(*) AS count FROM patentes_concedidas;");
    return countPatentes[0];
};

module.exports = {
    getAll,
    getAllPage,
    get,
    countPatentes
}