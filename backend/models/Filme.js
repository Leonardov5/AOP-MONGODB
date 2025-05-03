const mongoose = require('mongoose');

const FilmeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Ano é obrigatório']
  },
  genres: {
    type: [String],
    required: [true, 'Gêneros são obrigatórios']
  },
  directors: {
    type: [String],
    required: [true, 'Diretores são obrigatórios']
  },
  plot: {
    type: String,
    required: [true, 'Resumo é obrigatório']
  },
  poster: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s'
  },
  imdb: {
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    votes: {
      type: Number,
      default: 0
    },
    id: {
      type: Number
    }
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Filme', FilmeSchema, 'movies');