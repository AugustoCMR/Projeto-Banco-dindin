const pool = require("../conexao");

const cadastrarTransacao = async (req, res) => {

    const { descricao, valor, data, categoria_id, tipo } = req.body

    const usuarioId = req.usuario.id
     
    try{

        const cadastraTransacao = await pool.query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1,$2,$3,$4,$5, $6) RETURNING *`,[descricao, valor, data, categoria_id, usuarioId, tipo])

        return res.status(201).json(cadastraTransacao.rows[0])
        
    }catch(error){

        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }
    
}

const listarTransacoes = async(req, res) => {

    const { filtro } = req.query

    try {
         
        let filtroExibicao = []

        if(filtro){
            for(i = 0; i < filtro.length; i++){
                const itemPesquisado = `%${filtro[i]}%`;
                const { rows: transacoes } = await pool.query(`
                SELECT transacoes.*, categorias.descricao as categoria_nome
                FROM transacoes
                JOIN categorias on transacoes.categoria_id = categorias.id 
                WHERE categorias.descricao ILIKE $1 AND transacoes.usuario_id=$2`,[itemPesquisado, req.usuario.id])
                
                filtroExibicao.push(...transacoes);
              
            }

            return res.status(200).json(filtroExibicao)

        }
        
        const { rows: transacoes } = await pool.query("SELECT *, categorias.descricao AS categoria_nome FROM transacoes JOIN categorias ON transacoes.categoria_id = categorias.id WHERE transacoes.usuario_id = $1", [req.usuario.id]);

        return res.status(200).json(transacoes);

    } catch(error) {
        
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

const detalharTransacao = async (req, res) => {

    const { id } = req.params;

   try {

        const {rows: transacoes} = await pool.query("SELECT *, categorias.descricao AS categoria_nome FROM transacoes JOIN categorias ON transacoes.categoria_id = categorias.id WHERE transacoes.id = $1 and transacoes.usuario_id = $2", [id, req.usuario.id]);


        return res.status(200).json(transacoes);
        

   } catch (error) {
         return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
   }

}

const atualizarTransacao = async (req, res) => {

    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try{

            await pool.query(`UPDATE transacoes 
            SET descricao = $1, 
            valor = $2, 
            data = $3, 
            categoria_id = $4,
            tipo = $5
            WHERE id = $6`,[descricao, valor, data, categoria_id, tipo, id])
            res.status(204).json({mensagem: 'Categoria atualizada com sucesso'})
     
    }catch(error){

        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }

}

const deletarTransacao = async(req, res) => {
    
    const {id} = req.params;

    try {
        
        await pool.query("DELETE FROM transacoes WHERE id = $1 AND   usuario_id = $2", [id, req.usuario.id]);

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`})
    }
}

const extratoTransacao = async (req, res) => {

    const usuarioId = req.usuario.id

    try{

        const { rows: somaTransacoes } = await pool.query(
            `SELECT
            SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS entrada,
            SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saida
            FROM transacoes
            WHERE usuario_id = $1`, [usuarioId])

        return res.status(200).json(somaTransacoes[0])

    }catch(error){

        return res.status(500).json({mensagem: `Ocorreu um erro interno ${error.message}`});
    }
}

module.exports = {
   deletarTransacao,
   listarTransacoes,
   detalharTransacao,
   cadastrarTransacao,
   atualizarTransacao,
   extratoTransacao
}