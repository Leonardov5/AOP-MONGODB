const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, forneça um email válido'
    ]
  },
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Filme',
    required: [true, 'ID do filme é obrigatório']
  },
  text: {
    type: String,
    required: [true, 'Texto do comentário é obrigatório']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema, 'comments');