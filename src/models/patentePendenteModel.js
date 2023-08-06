const connection = require("./connection");

const getAll = async () => {
    const [patentesPendentes] = await connection.execute("SELECT * FROM patentes_pendentes");
    return patentesPendentes;
}

const getAllPages = async (page, limit) => {
    let offset = (page - 1) * limit;
    const [patentesPendentes] = await connection.execute(`SELECT * FROM patentes_pendentes LIMIT ${limit} OFFSET ${offset};`);
    return patentesPendentes;
}

const get = async (numero_pedido) => {
    const [patentePendente] = await connection.execute("SELECT * FROM patentes_pendentes WHERE numero_pedido = ?",[numero_pedido]);
    return patentePendente;
};

const countPatentes = async () => {
    const [countPatentes] = await connection.execute("SELECT COUNT(*) AS count FROM patentes_pendentes;");
    return countPatentes[0];
};

module.exports = {
    getAll,
    getAllPages,
    get,
    countPatentes
}