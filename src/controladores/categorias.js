const pool = require('../conexao');
require('dotenv').config();


const listarCategorias = async (req, res) => {

    const { id } = req.usuario

    try{

    const query = await pool.query(`SELECT * FROM categorias WHERE usuario_id = $1`, [id]);

    return res.status(200).json(query.rows);
  
    }catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }

}

const detalharCategoria = async (req, res) => {

    const usuario = req.usuario
    const { id } = req.params;

    try{

    const queryCategoriaUsuario = await pool.query(`SELECT * FROM categorias WHERE id=$1 AND usuario_id=$2`, [id, usuario.id])

    return res.status(200).json(queryCategoriaUsuario.rows[0])

    }catch(error){
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }

}

const cadastrarCategoria = async (req, res) => {

    const { id } = req.usuario
    const { descricao } = req.body

    try{

    const query = await pool.query(`INSERT INTO categorias (usuario_id, descricao) VALUES ($1, $2) RETURNING *` , [id, descricao]);

        return res.status(201).json(query.rows[0])

    }catch(error){
        
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }

}

const atualizarCategoria = async (req, res) => {

    const usuario = req.usuario
    const { id } = req.params;
    const { descricao } = req.body

    try{
        
        await pool.query(`UPDATE categorias SET descricao = $1 WHERE usuario_id=$2 AND id=$3`, [descricao, usuario.id, id])

       return res.status(204).json({mensagem: 'Categoria atualiza com sucesso'})

    }catch(error){
        
       return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }

}

const deletarCategoria = async (req, res) =>{

    const { id } = req.params

    try{

        await pool.query(`DELETE FROM categorias WHERE id=$1`, [id])

        return res.status(204).json({mensagem: 'Categoria deletada'})

    }catch(error){
        
      return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }

}


module.exports = {

    listarCategorias,
    detalharCategoria,
    cadastrarCategoria,
    atualizarCategoria,
    deletarCategoria
}