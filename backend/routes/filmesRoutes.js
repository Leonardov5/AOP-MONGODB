const express = require('express');
const router = express.Router();
const { 
  getFilmes, 
  getFilme, 
  getFilmeWithComments,
  criarFilme, 
  atualizarFilme, 
  excluirFilme 
} = require('../controllers/filmesController');

const {
  getCommentsByMovie,
  addComment,
  deleteComment
} = require('../controllers/commentsController');

router
  .route('/')
  .get(getFilmes)
  .post(criarFilme);

router
  .route('/:id')
  .get(getFilme)
  .put(atualizarFilme)
  .delete(excluirFilme);

router
  .route('/:id/with-comments')
  .get(getFilmeWithComments);

router
  .route('/:movieId/comments')
  .get(getCommentsByMovie)
  .post(addComment);

router
  .route('/comments/:id')
  .delete(deleteComment);

module.exports = router;