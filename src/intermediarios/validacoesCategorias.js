const pool = require('../conexao');


const validaExisteCategoriaParams = async (req, res, next) => {

    const { id } = req.params

    try{

        const queryCategoria = await pool.query(`SELECT * FROM categorias WHERE id=$1`,[id]);
    
        if(queryCategoria.rowCount < 1){
            return res.status(400).json({mensagem: 'Categoria não existe'})
        }

        next();

    }catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

const validaExisteCategoriaBody = async (req, res, next) => {

    const { categoria_id } = req.body

    try{

        const queryCategoria = await pool.query(`SELECT * FROM categorias WHERE id=$1`,[categoria_id]);
    
        if(queryCategoria.rowCount < 1){
            return res.status(400).json({mensagem: 'Categoria não existe'})
        }

        next();

    }catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

const validaCategoriaPertenceAoUsuario = async (req, res, next) => {

    const categoriaId = req.params.id;
    const usuarioId = req.usuario.id

    try{

        const queryBuscaCategoriaUsuario = await pool.query('SELECT * FROM categorias WHERE id = $1 AND usuario_id = $2', [categoriaId, usuarioId]);

        if(queryBuscaCategoriaUsuario.rowCount < 1) {
            return res.status(400).json({mensagem: 'Categoria não pertence ao usuário logado'})
        }

        next();
    
    }catch(error){
        
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }

}


const validaCategoriaBodyPertenceAoUsuario = async (req, res, next) => {

    const { categoria_id } = req.body;
    const usuarioId = req.usuario.id

    try{

        const queryBuscaCategoriaUsuario = await pool.query('SELECT * FROM categorias WHERE id = $1 AND usuario_id = $2', [categoria_id, usuarioId]);

        if(queryBuscaCategoriaUsuario.rowCount < 1) {
            return res.status(400).json({mensagem: 'Categoria não pertence ao usuário logado'})
        }

        next();
    
    }catch(error){
        
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }

}

const validaDescricao = async (req, res, next) => {

    const { descricao } = req.body

    try{

        if(!descricao || descricao.trim() === ""){
            return res.status(400).json({mensagem:'A descrição da categoria deve ser informada.'})
        }

        next();
    
    }catch(error){
        
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }

}

const validaExisteTransacaoParaCategoria = async (req, res, next) => {

    const { id } = req.params

    try{

        const queryTransacaoUsuario = await pool.query(`SELECT * FROM transacoes WHERE categoria_id=$1`, [id]);

        if(queryTransacaoUsuario.rowCount > 0){
            return res.status(403).json({menssagem:'Existe transação para essa categoria, não pode ser excluída.'})
        }
        
        next();

    }catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
  
}

const validaSeExisteDescricao = async (req, res, next) => {

    const { descricao } = req.body
    const usuarioId = req.usuario.id

    try{

        const queryDescricao = await pool.query(`SELECT descricao FROM categorias WHERE descricao = $1 AND usuario_id = $2`, [descricao, usuarioId]);

        if(queryDescricao.rowCount >= 1){
            return res.status(400).json({mensagem: 'Essa categoria já existe para esse usuário.'})
        }

        next();

    } catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})

    }

}

module.exports = {
    validaExisteCategoriaBody,
    validaCategoriaPertenceAoUsuario,
    validaCategoriaBodyPertenceAoUsuario,
    validaExisteCategoriaParams,
    validaDescricao,
    validaExisteTransacaoParaCategoria,
    validaSeExisteDescricao
}