require("dotenv").config();
const pool = require("../conexao");
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = process.env.JWT_PASSWORD;

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;

    try {

        const senhaCriptografada = await bycript.hash(senha, 10);
       
        const query = await pool.query("INSERT INTO usuarios(nome, email, senha) VALUES($1, $2, $3) RETURNING *", [nome, email, senhaCriptografada]);
      
        const {senha: senhaSegura, ...usuario} = query.rows[0]

        return res.status(201).json(usuario);

    } catch(error) {
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

const login = async (req, res) => {
    const {email, senha} = req.body

    try {
        
        const query = await pool.query("SELECT * FROM usuarios where email = $1", [email]);

        const verificaSenha = await bycript.compare(senha, query.rows[0].senha);

        if(!verificaSenha) {
            return res.status(400).json({erro: "Ocorreu um erro"});
        }
    
        const token = jwt.sign({id: query.rows[0].id}, senhaJwt, {expiresIn:"1d"});

        const { senha: senhaDigitada, ...usuario} = query.rows[0];

        return res.status(200).json({usuario: usuario, token});


    } catch(error) {
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

const detalharUsuario = async (req, res) => {
    const {senha: senha, ...usuario} = req.usuario;

    return res.status(200).json(usuario);
}

const atualizarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;

    try {
        
        const senhaCriptografada = await bycript.hash(senha, 10);

        await pool.query("UPDATE USUARIOS SET nome = $1, email = $2, senha = $3 WHERE id = $4", [nome, email, senhaCriptografada, req.usuario.id]);
        
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}