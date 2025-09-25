const pool = require('../conexao');

const listar = async (req, res) => {
    try{
        const result = await pool.query('SELECT * from categorias;');

        return res.status(200).json(result.rows);
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'});
    }
}

module.exports = {
    listar,
}