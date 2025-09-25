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

        const { rowCount } = await pool.query(`SELECT * FROM categorias WHERE id = $1`, [categoria_id]);

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

module.exports = {
    listar,
    cadastrar,
}