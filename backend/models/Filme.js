const mongoose = require('mongoose');

const FilmeSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  diretor: {
    type: String,
    required: [true, 'Diretor é obrigatório'],
    trim: true
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório']
  },
  genero: {
    type: String,
    required: [true, 'Gênero é obrigatório'],
    trim: true
  },
  sinopse: {
    type: String,
    required: [true, 'Resumo é obrigatório']
  },
  posterUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  avaliacao: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  dataAdicionado: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Filme', FilmeSchema);