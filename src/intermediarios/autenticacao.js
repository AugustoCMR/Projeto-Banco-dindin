require("dotenv").config();
const jwt = require("jsonwebtoken");
const senhaJwt = process.env.JWT_PASSWORD;
const pool = require("../conexao");

const autenticaUsuario = async (req, res, next) => {
   
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).json({mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."});
    }

    const token = authorization.split(" ")[1];

    try {
 
        const { id } = jwt.verify(token, senhaJwt);
      
        const {rows} = await pool.query("select * from usuarios where id = $1", [id]);

        req.usuario = rows[0];
        
        next();

    } catch(error) {
        return res.status(401).json({mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."});
    }
}

module.exports = autenticaUsuario;