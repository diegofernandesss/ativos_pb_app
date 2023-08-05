const connection = require('./connection');

const getSecoesIpc = async () => {
    const [secoes_ipc] = await connection.execute("SELECT * FROM secoes_ipc");
    return secoes_ipc;
};

const getSubSecaoIpc = async (id_secao) => {
    const [sub_secao] = await connection.execute("SELECT * FROM sub_secao_ipc WHERE id_secao = ?", [id_secao]);
    return sub_secao;
}

const getCodigosSubSecaoIpc = async (id_sub_secao) => {
    const [cods_sub] = await connection.execute("SELECT codigo FROM codigo_sub_secao WHERE id_sub_secao_ipc = ?", [id_sub_secao]);
    return cods_sub;
}

module.exports = {
    getSecoesIpc,
    getSubSecaoIpc,
    getCodigosSubSecaoIpc
}