const Filme = require('../models/Filme');

exports.getFilmes = async (req, res) => {
  try {
    //const filmes = await Filme.find();
    const filmes = await Filme.find().limit(1000);

    res.status(200).json({
      success: true,
      count: filmes.length,
      data: filmes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

exports.getFilme = async (req, res) => {
  try {
    const filme = await Filme.findById(req.params.id);

    if (!filme) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: filme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

exports.criarFilme = async (req, res) => {
  try {
    const filme = await Filme.create(req.body);

    res.status(201).json({
      success: true,
      data: filme
    });

    console.log('Filme criado com sucesso:', filme);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: mensagens
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro no servidor'
      });
    }
  }
};

exports.atualizarFilme = async (req, res) => {
  try {
    const filme = await Filme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!filme) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: filme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

exports.excluirFilme = async (req, res) => {
  try {
    const filme = await Filme.findByIdAndDelete(req.params.id);

    if (!filme) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};