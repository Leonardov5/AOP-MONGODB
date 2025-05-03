document.addEventListener('DOMContentLoaded', () => {
    const listaFilmes = document.getElementById('lista-filmes');
    const modalFilme = document.getElementById('modal-filme');
    const modalDetalhes = document.getElementById('modal-detalhes');
    const formFilme = document.getElementById('form-filme');
    const modalTitulo = document.getElementById('modal-titulo');
    const inputPesquisa = document.getElementById('pesquisa');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    
    const abrirCadastro = document.getElementById('abrir-cadastro');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnEditar = document.getElementById('btn-editar');
    const btnExcluir = document.getElementById('btn-excluir');
    const fecharBtns = document.querySelectorAll('.fechar');
    
    let filmes = [];
    let filmeAtual = null;
    
    carregarFilmes();
    
    abrirCadastro.addEventListener('click', () => abrirModalCadastro());
    btnCancelar.addEventListener('click', () => fecharModal(modalFilme));
    formFilme.addEventListener('submit', salvarFilme);
    btnEditar.addEventListener('click', editarFilmeAtual);
    btnExcluir.addEventListener('click', excluirFilmeAtual);
    btnPesquisar.addEventListener('click', pesquisarFilmes);
    inputPesquisa.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') pesquisarFilmes();
    });
    
    fecharBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        fecharModal(modalFilme);
        fecharModal(modalDetalhes);
      });
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === modalFilme) fecharModal(modalFilme);
      if (e.target === modalDetalhes) fecharModal(modalDetalhes);
    });
    
    async function carregarFilmes() {
      try {
        listaFilmes.innerHTML = '<div class="loading">A carregar filmes...</div>';
        filmes = await ApiService.getFilmes();
        renderizarFilmes(filmes);
      } catch (error) {
        listaFilmes.innerHTML = `<div class="error">Erro ao carregar filmes: ${error.message}</div>`;
      }
    }
    
    function renderizarFilmes(filmes) {
      if (filmes.length === 0) {
        listaFilmes.innerHTML = '<div class="no-results">Nenhum filme encontrado</div>';
        return;
      }
      
      listaFilmes.innerHTML = '';
      
      filmes.forEach(filme => {
        const filmeCard = document.createElement('div');
        filmeCard.className = 'filme-card';
        filmeCard.dataset.id = filme._id;
        
        filmeCard.innerHTML = `
          <img src="${filme.poster}" alt="${filme.title}" class="filme-poster">
          <div class="filme-info">
            <h3>${filme.title}</h3>
            <div class="filme-meta">
              <span>${filme.year}</span>
              <div class="filme-avaliacao">
                <span>★</span> ${filme.imdb.rating.toFixed(1)}
              </div>
            </div>
          </div>
        `;
        
        filmeCard.addEventListener('click', () => abrirDetalhes(filme._id));
        listaFilmes.appendChild(filmeCard);
      });
    }
    
    function abrirModalCadastro() {
      modalTitulo.textContent = 'Adicionar Novo Filme';
      formFilme.reset();
      document.getElementById('filme-id').value = '';
      modalFilme.style.display = 'block';
    }
    
    async function abrirDetalhes(id) {
      try {
        filmeAtual = await ApiService.getFilme(id);
        
        const detalhesContent = document.getElementById('detalhes-content');
        detalhesContent.innerHTML = `
          <img src="${filmeAtual.poster}" alt="${filmeAtual.title}" class="detalhes-poster">
          <div class="detalhes-info">
            <h2>${filmeAtual.title} (${filmeAtual.year})</h2>
            <div class="detalhes-meta">
              <div>Diretor: ${filmeAtual.directors}</div>
              <div>Gênero: ${filmeAtual.genres.join(', ')}</div>
              <div>Avaliação: ${filmeAtual.imdb.rating.toFixed(1)}/10 ★</div>
            </div>
            <div class="detalhes-sinopse">
              <h3>Resumo</h3>
              <p>${filmeAtual.plot}</p>
            </div>
          </div>
        `;
        
        modalDetalhes.style.display = 'block';
      } catch (error) {
        alert(`Erro ao carregar detalhes do filme: ${error.message}`);
      }
    }
    
    function fecharModal(modal) {
      modal.style.display = 'none';
    }
    
    function editarFilmeAtual() {
      if (!filmeAtual) return;
      
      modalTitulo.textContent = 'Editar Filme';
      
      document.getElementById('filme-id').value = filmeAtual._id;
      document.getElementById('titulo').value = filmeAtual.title;
      document.getElementById('diretor').value = filmeAtual.directors;
      document.getElementById('ano').value = filmeAtual.year;
      document.getElementById('genero').value = filmeAtual.genres.join(', ');
      document.getElementById('resumo').value = filmeAtual.plot;
      document.getElementById('posterUrl').value = filmeAtual.poster;
      document.getElementById('avaliacao').value = filmeAtual.imdb.rating;
      
      fecharModal(modalDetalhes);
      modalFilme.style.display = 'block';
    }
    
    async function salvarFilme(e) {
      e.preventDefault();
      
      const filmeId = document.getElementById('filme-id').value;
      
      const filmeData = {
        title: document.getElementById('titulo').value,
        directors: document.getElementById('diretor').value,
        year: parseInt(document.getElementById('ano').value),
        genres: document.getElementById('genero').value.split(','),
        plot: document.getElementById('resumo').value,
        poster: document.getElementById('posterUrl').value || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
        imdb: {
          rating: parseFloat(document.getElementById('avaliacao').value) || 0
        }
      };
      
      try {
        if (filmeId) {
          await ApiService.atualizarFilme(filmeId, filmeData);
          alert('Filme atualizado com sucesso!');
        } else {
          await ApiService.criarFilme(filmeData);
          alert('Filme adicionado com sucesso!');
        }
        
        fecharModal(modalFilme);
        carregarFilmes();
      } catch (error) {
        alert(`Erro ao salvar filme: ${error.message}`);
      }
    }
    
    async function excluirFilmeAtual() {
      if (!filmeAtual) return;
      
      if (confirm(`Tem certeza que deseja excluir o filme "${filmeAtual.title}"?`)) {
        try {
          await ApiService.excluirFilme(filmeAtual._id);
          alert('Filme excluído com sucesso!');
          fecharModal(modalDetalhes);
          carregarFilmes();
        } catch (error) {
          alert(`Erro ao excluir filme: ${error.message}`);
        }
      }
    }
    
    function pesquisarFilmes() {
      const termo = inputPesquisa.value.toLowerCase().trim();
      
      if (!termo) {
        renderizarFilmes(filmes);
        return;
      }
      
      const resultados = filmes.filter(filme => 
        filme.title.toLowerCase().includes(termo) || 
        filme.directors.some(genero => genero.toLowerCase().includes(termo)) ||
        filme.genres.some(genero => genero.toLowerCase().includes(termo))
      );
      
      renderizarFilmes(resultados);
    }
  });