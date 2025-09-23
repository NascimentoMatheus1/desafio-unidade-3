const pool = require('../conexao');
const bcrypt = require('bcrypt');

const listar = (req, res) => {
    return res.json('lista de usuarios...');
}

const cadastrar = async (req, res) => {
    try{
        const { nome, email, senha } = req.body;

        if(!nome){
            return res.status(400).json({ mensagem: 'informe o nome para o cadastro!'});
        }
        if(!email){
            return res.status(400).json({ mensagem: 'informe o email para o cadastro!'});
        }
        if(!senha){
            return res.status(400).json({ mensagem: 'informe a senha para o cadastro!'});
        }

        const { rowCount } = await pool.query(`
        SELECT * FROM usuarios WHERE email = $1`,
        [email]); 
        
        if(rowCount === 1){
            return res.status(400).json({ mensagem: `Já existe usuário cadastrado com o e-mail informado!`});
        }

        const senhaCrypt = await bcrypt.hash(senha, 10);
        const { rows: dadosUsuario} = await pool.query(`
        INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *`, 
        [nome, email, senhaCrypt]); 

        return res.status(201).json({ id: dadosUsuario[0].id, nome, email });
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'})
    }
}

module.exports = {
    listar,
    cadastrar
}