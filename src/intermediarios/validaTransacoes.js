const pool = require("../conexao");

const validaIdTransacao = async (req, res, next) => {

    const { id } = req.params;

    try {
        
        const query = await pool.query("SELECT * FROM transacoes WHERE id = $1", [id]);

        const {rowCount} = query;

        if(rowCount < 1) {
            return res.status(400).json({mensagem: "Transação não encontrada."});
        }

        const verificaUsuario = await pool.query("SELECT * FROM transacoes WHERE id = $1 and usuario_id = $2", [id, req.usuario.id]);

        if(verificaUsuario.rowCount < 1) {
            return res.status(400).json({mensagem: "Transação não pertence ao usuário conectado"})
        }

        next();

    } catch (error) {
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}


const validaSeCamposForamDigitados = async (req, res, next) => {

  
    try{

        const propriedades = ["descricao", "valor", "data", "categoria_id", "tipo"];

        for(const propriedade of propriedades) {
            if(!req.body[propriedade]) {
                return res.status(400).json({"mensagem": `Ocorreu um erro: ${propriedade} é obrigatório`});
            }
        }

        next();

    }catch(error){
       return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }

}

const validaTipo = async (req, res, next) => {

    const { tipo } = req.body

    try{

        if(tipo !== 'entrada' && tipo !== 'saida'){
           return res.status(400).json({menssagem: 'O tipo deve ser saida ou entrada'})
        }

        next();
        
    }catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }

}

module.exports = {
    validaIdTransacao,
    validaSeCamposForamDigitados,
    validaTipo,

}