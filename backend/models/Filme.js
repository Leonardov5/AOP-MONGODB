const mongoose = require('mongoose');

const FilmeSchema = new mongoose.Schema({
  plot: {
    type: String,
    required: [true, 'Resumo é obrigatório']
  },
  genres: {
    type: [String],
    required: [true, 'Gêneros são obrigatórios']
  },
  runtime: {
    type: Number
  },
  cast: {
    type: [String]
  },
  num_mflix_comments: {
    type: Number,
    default: 0
  },
  poster: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s'
  },
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  fullplot: {
    type: String
  },
  languages: {
    type: [String]
  },
  released: {
    type: Date
  },
  directors: {
    type: [String],
    required: [true, 'Diretores são obrigatórios']
  },
  writers: {
    type: [String]
  },
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: {
    type: String
  },
  year: {
    type: Number,
    required: [true, 'Ano é obrigatório']
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
    id: Number
  },
  countries: {
    type: [String]
  },
  type: {
    type: String,
    default: 'movie'
  },
  tomatoes: {
    viewer: {
      lastUpdated: Date
    }
  }
});

module.exports = mongoose.model('Filme', FilmeSchema, 'movies');