const removedorEspacos = (item) => {return item.trim()};

const patentesConcedidasCorrigidas = (patentes) => {
    let patentesConcedidas = [];
    for (const patente of patentes) {

        let data_deposito = new Date(patente["data_deposito"]).toLocaleDateString();
        let data_publicacao = new Date(patente["data_publicacao"]).toLocaleDateString();
        
        let classificacoes_ipc = patente["classificacao_ipc"];
        if(classificacoes_ipc) {
            classificacoes_ipc = classificacoes_ipc.split(";").map(removedorEspacos);
        }
        
        // let classificacoes_cpc = patente["classificacao_cpc"];
        // if (classificacoes_cpc) {
        //     classificacoes_cpc = classificacoes_cpc.split(";").map(removedorEspacos);
        // }

        let depositantes = patente["depositantes"].split("/").map(removedorEspacos);
        
        patentesConcedidas.push(
            {
                numero_pedido: patente["numero_pedido"].trim(),
                data_deposito,
                data_publicacao,
                classificacoes_ipc,
                //classificacoes_cpc,
                titulo: patente["titulo"],
                depositantes,
    
            }
        );
    }
    return patentesConcedidas
    
};

const patenteConcedidaCorrigida = (patente) => {
    let data_deposito = new Date(patente["data_deposito"]).toLocaleDateString();
    let data_publicacao = new Date(patente["data_publicacao"]).toLocaleDateString();
    
    let classificacoes_ipc = patente["classificacao_ipc"];
    if(classificacoes_ipc) {
        classificacoes_ipc = classificacoes_ipc.split(";").map(removedorEspacos);
    }
    
    let classificacoes_cpc = patente["classificacao_cpc"];
    if (classificacoes_cpc) {
        classificacoes_cpc = classificacoes_cpc.split(";").map(removedorEspacos);
    }

    inventores = patente["inventores"].split("/").map(removedorEspacos);
    depositantes = patente["depositantes"].split("/").map(removedorEspacos);
    
    return {
        numero_pedido: patente["numero_pedido"].trim(),
        data_deposito,
        data_publicacao,
        classificacoes_ipc,
        classificacoes_cpc,
        titulo: patente["titulo"],
        resumo: patente["resumo"],
        inventores,
        depositantes,

    };

};

const patentesPendentesCorrigidas = (patentes) => {
    let patentesPendentes = [];
    for (const patente of patentes) {

        let data_deposito = new Date(patente["data_deposito"]).toLocaleDateString();
        let data_protocolo = new Date(patente["data_protocolo"]).toLocaleDateString();

        let exame_pago = false;
        if (patente["exame_pago"] == 1) {
            exame_pago = true;
        }

        depositantes = patente["depositantes"].split("/").map(removedorEspacos);
        
        patentesPendentes.push(
            {
                numero_pedido: patente["numero_pedido"],
                data_deposito,
                data_protocolo,
                exame_pago,
                depositantes 
            }
        );
    }
    return patentesPendentes
};

const patentePendenteCorrigida = (patente) => {
    let data_deposito = new Date(patente["data_deposito"]).toLocaleDateString();
    let data_protocolo = new Date(patente["data_protocolo"]).toLocaleDateString();

    let exame_pago = false;
    if (patente["exame_pago"] == 1) {
        exame_pago = true;
    }

    depositantes = patente["depositantes"].split("/").map(removedorEspacos);
    
    return {
        numero_pedido: patente["numero_pedido"],
        data_deposito,
        data_protocolo,
        exame_pago,
        depositantes,
        natureza: patente["natureza"],
        situacao_inpi: patente["situacao_inpi"],
        estado_detalhado: patente["estado_detalhado"],
        area_tecnologica: patente["area_tecnologica"],
        campo_tecnologico: patente["campo_tecnologico"]
    };
}

module.exports = {
    removedorEspacos,
    patentesConcedidasCorrigidas,
    patenteConcedidaCorrigida,
    patentesPendentesCorrigidas,
    patentePendenteCorrigida
}