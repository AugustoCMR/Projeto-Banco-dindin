const validator = require("email-validator");
const pool = require("../conexao");
const bycript = require("bcrypt");

const validaEmail = async (req, res, next) => {

    const { email } = req.body;

    try {

        const verificaEmail = validator.validate(req.body["email"]);

        if(!verificaEmail) {
            return res.status(400).json({mensagem: "Digite um email válido."})
        }

        const query = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

        const {rowCount} = query

        if(rowCount > 0) {
            return res.status(400).json({mensagem: "O e-mail informado já está sendo utilizado por outro usuário."});
        }

        next();

    } catch (error) {
        res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }
}

const validaPropriedadesUsuario = async (req, res, next) => {
    
    const propriedades = ["nome", "email", "senha"];

    for(const propriedade of propriedades) {
        if(!req.body[propriedade]) {
            return res.status(400).json({"mensagem": `Ocorreu um erro: ${propriedade} é obrigatório`});
        }
    }

    next();
}

const validaLogin = async (req, res, next) => {

    const {email, senha} = req.body;

    const propriedades = ["email", "senha"]

    for(const propriedade of propriedades) {
        if(!req.body[propriedade]) {
            return res.status(400).json({"mensagem": `Ocorreu um erro: ${propriedade} é obrigatório`});
        }
    }

    try {

        const emailUsuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

        const {rowCount} = emailUsuario
    
        if(rowCount < 1) {
            return res.status(400).json({mensagem: "Usuário e/ou senha inválido(s)."});
        }
    
        const verificaSenha = await bycript.compare(senha, emailUsuario.rows[0].senha);
    
        if(!verificaSenha) {
            return res.status(400).json({mensagem: "Usuário e/ou senha inválido(s)."});
        }
    
        next();
        
    } catch (error) {
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }

   
}

module.exports = {
    validaEmail,
    validaPropriedadesUsuario,
    validaLogin
}