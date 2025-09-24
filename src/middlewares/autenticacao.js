const pool = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaJWT = require('../senhaJWT');

const verificarUsuarioLogado = async (req, res, next) => {
    try{
        const { authorization } = req.headers;

        if(!authorization){
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.'});
        }

        const token = authorization.split(' ')[1];

        const { id } = await jwt.verify(token, senhaJWT);

        const { rows, rowCount } = await pool.query(`
            SELECT id, nome, email FROM usuarios WHERE id = $1`, 
            [id]);

        if(rowCount === 0){
            return res.status(404).json({ mensagem: 'Usuario não encontrado'});
        }

        req.usuario = rows[0];

        next();

    }catch(error){
        console.log(error.message);
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.'});
    }
}

module.exports = { verificarUsuarioLogado };