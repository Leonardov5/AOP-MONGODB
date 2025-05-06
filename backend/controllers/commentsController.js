const Comment = require('../models/Comment');
const Filme = require('../models/Filme');
const mongoose = require('mongoose');

// Get comments for a specific movie
exports.getCommentsByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    // Check if movieId is a valid ObjectId
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

// Add a comment to a movie
exports.addComment = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    // Check if movieId is valid
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do filme inválido'
      });
    }

    // Check if movie exists
    const movie = await Filme.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Filme não encontrado'
      });
    }

    // Create comment with movie_id
    const commentData = {
      ...req.body,
      movie_id: movieId
    };
    
    const comment = await Comment.create(commentData);

    // Increment num_mflix_comments in the movie document
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

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comentário não encontrado'
      });
    }

    // Get the movie_id before deleting the comment
    const movieId = comment.movie_id;

    // Delete the comment
    await comment.remove();

    // Decrement num_mflix_comments in the movie document
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