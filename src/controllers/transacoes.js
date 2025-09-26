const pool = require('../conexao');
const { isCamposValidos } = require('./validarCamposObrigatorios');

const listar = async (req, res) => {
    try{
        const {  rows } = await pool.query(`
            SELECT * FROM transacoes WHERE usuario_id = $1`
            ,[req.usuario.id]);
        
        res.status(200).json(rows);
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
}

const cadastrar = async (req, res) => {
    try{
        const { 
            descricao, 
            valor, 
            data, 
            categoria_id, 
            tipo 
        } = req.body;

        const camposValidos = isCamposValidos(descricao, valor, data, categoria_id, tipo);

        if(!camposValidos){
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados."});
        }

        if(tipo !== 'entrada' && tipo !== 'saida'){
            return res.status(400).json({ mensagem: "Tipo de categoria inválido!"});
        }

        const { rowCount } = await pool.query(`
            SELECT * FROM categorias WHERE id = $1`
            , [categoria_id]);

        if(rowCount === 0){
            return res.status(404).json({ mensagem: "Categoria não encontrada!"});
        }

        const { rows } = await pool.query(`
            INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [descricao, valor, data, categoria_id, req.usuario.id, tipo]);

        return res.status(200).json(rows[0]);

    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
}

const atualizar = async (req, res) => {
    try{
        const { 
            descricao, 
            valor, 
            data, 
            categoria_id, 
            tipo 
        } = req.body;

        const camposValidos = isCamposValidos(descricao, valor, data, categoria_id, tipo);

        if(!camposValidos){
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados."});
        }

        if(tipo !== 'entrada' && tipo !== 'saida'){
            return res.status(400).json({ mensagem: "Tipo de categoria inválido!"});
        }

        const { id: id_transacao } = req.params;

        const { rows, rowCount } = await pool.query(`
            SELECT * FROM transacoes WHERE id = $1`
            , [id_transacao]);

        if(rowCount === 0){
            return res.status(404).json({ mensagem: "transação não encontrada!"});
        }

        if(rows[0].usuario_id !== req.usuario.id){
            return res.status(401).json({ mensagem: "Não autorizado!"});
        }

        await pool.query(`
            UPDATE transacoes SET 
            descricao = $1, 
            valor = $2, 
            data = $3, 
            categoria_id = $4,
            tipo = $5
            WHERE id = $6`
            , [descricao, valor, data, categoria_id, tipo, id_transacao]);

        return res.status(204).json();

    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
}

const deletar = async (req, res) => {
    try{
        const { id } = req.params;

        const { rows, rowCount } = await pool.query(`
            SELECT * FROM transacoes WHERE id = $1`
            , [id]);

        if(rowCount === 0){
            return res.status(404).json({ mensagem: "transação não encontrada!"});
        }

        if(rows[0].usuario_id !== req.usuario.id){
            return res.status(401).json({ mensagem: "Não autorizado!"});
        }

        await pool.query(`
            DELETE FROM transacoes WHERE id = $1`
            , [id]);

        return res.status(204).json();

    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
        
}

const extrato = async (req, res) => {
    try{
        const { rows: extrato } = await pool.query(`
            SELECT * FROM transacoes WHERE usuario_id = $1`
            ,[req.usuario.id]);
        
        let entrada = 0;
        let saida = 0;

        for(const transacao of extrato){
            if(transacao.tipo === 'entrada'){
                entrada += transacao.valor;
            }else{
                saida += transacao.valor;
            }
        }

        res.status(200).json({ entrada, saida });
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
}

const detalhar = async (req, res) => {
    try{
        const { id } = req.params;

        const { rows, rowCount } = await pool.query(`
            SELECT * FROM transacoes WHERE id = $1`
            , [id]);

        if(rowCount === 0){
            return res.status(404).json({ mensagem: "transação não encontrada!"});
        }

        if(rows[0].usuario_id !== req.usuario.id){
            return res.status(401).json({ mensagem: "Não autorizado!"});
        }

        return res.status(200).json(rows[0]);
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
        
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    deletar,
    extrato,
    detalhar
}