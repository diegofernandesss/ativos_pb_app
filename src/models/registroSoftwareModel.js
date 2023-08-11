const connection = require("./connection");

const getAll = async () => {
    let [registrosSoftwares] = await connection.execute("SELECT numero_pedido, titulo_programa, data_deposito, nomes_titulares FROM registro_software order by data_deposito desc;");
    return registrosSoftwares;
};

const getAllPage = async (page, limit) => {
    let offset = (page - 1) * limit;
    let [registrosSoftwares] = await connection.execute(`SELECT numero_pedido, titulo_programa, data_deposito, nomes_titulares FROM registro_software order by data_deposito desc LIMIT ${limit} OFFSET ${offset};`);
    return registrosSoftwares;
};

const get = async (numero_pedido) => {
    let query = "SELECT * FROM registro_software WHERE numero_pedido = ?";
    let [registoSoftware] = await connection.execute(query, [numero_pedido]);
    return registoSoftware;
}

const countRegistros = async () => {
    let [count] = await connection.execute("SELECT COUNT(*) AS count FROM registro_software;");
    return count[0]
};

const pesquisaRegistro = async (numero_pedido) => {
    let query = 'SELECT numero_pedido, titulo_programa FROM registro_software WHERE numero_pedido LIKE "'+numero_pedido+'%" LIMIT 10;';
    let [registoSoftware] = await connection.execute(query);
    return registoSoftware;
}

module.exports = {
    getAll,
    getAllPage,
    get,
    countRegistros,
    pesquisaRegistro
}