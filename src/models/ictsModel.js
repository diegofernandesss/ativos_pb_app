const connection = require("./connection");

const getAll = async () => {
    const [icts] = await connection.execute("SELECT * FROM icts");
    return icts;
};

const getIct = async (cnpj) => {
    const [ict] = await connection.execute("SELECT * FROM icts WHERE cnpj = ?;", [cnpj]);
    return ict;
}

const getIctSigla = async (sigla) => {
    const [ict] = await connection.execute("SELECT * FROM icts WHERE sigla = ?;", [sigla]);
    return ict;
}

module.exports = {
    getAll,
    getIct,
    getIctSigla
}