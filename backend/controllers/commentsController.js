const Comment = require('../models/Comment');
const Filme = require('../models/Filme');
const mongoose = require('mongoose');

exports.getCommentsByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do filme inválido'
      });
    }

    const comments = await Comment.find({ movie_id: movieId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do filme inválido'
      });
    }

    const movie = await Filme.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado'
      });
    }

    const commentData = {
      ...req.body,
      movie_id: movieId
    };
    
    const comment = await Comment.create(commentData);

    await Filme.findByIdAndUpdate(movieId, { 
      $inc: { num_mflix_comments: 1 } 
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: mensagens
      });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Erro no servidor'
      });
    }
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comentário não encontrado'
      });
    }

    const movieId = comment.movie_id;

    await comment.remove();

    await Filme.findByIdAndUpdate(movieId, { 
      $inc: { num_mflix_comments: -1 } 
    });

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