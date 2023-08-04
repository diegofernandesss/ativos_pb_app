const connection = require("./connection");

const getAll = async () => {
    const [patentesPendentes] = await connection.execute("SELECT * FROM patentes_pendentes");
    return patentesPendentes;
}

const getAllPages = async (page, limit) => {
    let offset = (page - 1) * limit;
    const [patentesPendentes] = await connection.execute("SELECT * FROM patentes_pendentes LIMIT ? OFFSET ?;",[limit,offset]);
    return patentesPendentes;
}

const get = async (numero_pedido) => {
    const [patentePendente] = await connection.execute("SELECT * FROM patentes_pendentes WHERE numero_pedido = ?",[numero_pedido]);
    return patentePendente;
};

module.exports = {
    getAll,
    getAllPages,
    get,
}