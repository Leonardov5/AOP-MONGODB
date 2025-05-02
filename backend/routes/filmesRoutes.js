const express = require('express');
const router = express.Router();
const { 
  getFilmes, 
  getFilme, 
  criarFilme, 
  atualizarFilme, 
  excluirFilme 
} = require('../controllers/filmesController');

router
  .route('/')
  .get(getFilmes)
  .post(criarFilme);

router
  .route('/:id')
  .get(getFilme)
  .put(atualizarFilme)
  .delete(excluirFilme);

module.exports = router;