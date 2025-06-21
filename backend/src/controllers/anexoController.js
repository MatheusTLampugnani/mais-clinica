const { AnexoExame, Prontuario } = require('../models');

const anexoController = {
  async upload(req, res) {
    try {
      const { prontuarioId, descricao } = req.body;
      const arquivo = req.file;

      if (!arquivo) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
      }
      if (!prontuarioId || !descricao) {
        return res.status(400).json({ success: false, message: 'ID do prontuário e descrição são obrigatórios.' });
      }

      const prontuario = await Prontuario.findByPk(prontuarioId);
      if (!prontuario) {
        return res.status(404).json({ success: false, message: 'Prontuário não encontrado.' });
      }

      const novoAnexo = await AnexoExame.create({
        descricao,
        nomeArquivo: arquivo.filename,
        caminhoArquivo: arquivo.path,
        ProntuarioId: prontuarioId,
      });

      res.status(201).json({ success: true, anexo: novoAnexo });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao fazer upload do anexo.', error: error.message });
    }
  },

  async delete(req, res) {
    // Lógica para excluir o arquivo do sistema de arquivos e o registro do banco
    // (fs.unlink) - Requer implementação adicional.
    res.status(501).json({ message: "Funcionalidade de exclusão não implementada." });
  }
};

module.exports = anexoController;