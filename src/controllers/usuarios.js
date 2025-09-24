const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJWT = require('../senhaJWT');

const listarUsuario = (req, res) => {
    return res.json(req.usuario);
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

const login = async (req, res) => {
    try{
        const { email, senha } = req.body;

        if(!email){
            return res.status(400).json({ mensagem: 'informe o email para o login!'});
        }
        if(!senha){
            return res.status(400).json({ mensagem: 'informe a senha para o login!'});
        }

        const { rows, rowCount } = await pool.query(`
        SELECT * FROM usuarios WHERE email = $1`,
        [email]); 
        
        if(rowCount === 0){
            return res.status(404).json({ mensagem: `E-mail e/ou senha inválido(s)!`});
        }

        const senhaValida = await bcrypt.compare(senha, rows[0].senha);

        if(!senhaValida){
            return res.status(400).json({ mensagem: `E-mail e/ou senha inválido(s)!`});
        }

        const { senha: _, ...usuarioLogado } = rows[0];

        const token = jwt.sign({ id: usuarioLogado.id }, senhaJWT, { expiresIn: '8h'});

        return res.status(200).json({ usuario: usuarioLogado, token });
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'})
    }
}

const atualizar = async (req, res) => {
    try{
        const { nome, email, senha } = req.body;

        if(!nome){
            return res.status(400).json({ mensagem: 'informe o nome para a alteração!'});
        }
        if(!email){
            return res.status(400).json({ mensagem: 'informe o email para a alteração!'});
        }
        if(!senha){
            return res.status(400).json({ mensagem: 'informe a senha para a alteração!'});
        }

        const { rowCount } = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
        
        if(rowCount === 1){
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.'});
        }

        const senhaCrypt = await bcrypt.hash(senha, 10);

        const result = await pool.query(`
            UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *`
            , [nome, email, senhaCrypt, req.usuario.id]
        );

        return res.status(201).json();
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Falha no servidor!'})
    }
}

module.exports = {
    listarUsuario,
    cadastrar,
    login,
    atualizar
}