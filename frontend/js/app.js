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
          <img src="${filme.posterUrl}" alt="${filme.titulo}" class="filme-poster">
          <div class="filme-info">
            <h3>${filme.titulo}</h3>
            <div class="filme-meta">
              <span>${filme.ano}</span>
              <div class="filme-avaliacao">
                <span>★</span> ${filme.avaliacao.toFixed(1)}
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
          <img src="${filmeAtual.posterUrl}" alt="${filmeAtual.titulo}" class="detalhes-poster">
          <div class="detalhes-info">
            <h2>${filmeAtual.titulo} (${filmeAtual.ano})</h2>
            <div class="detalhes-meta">
              <div>Diretor: ${filmeAtual.diretor}</div>
              <div>Gênero: ${filmeAtual.genero}</div>
              <div>Avaliação: ${filmeAtual.avaliacao.toFixed(1)}/10 ★</div>
            </div>
            <div class="detalhes-sinopse">
              <h3>Resumo</h3>
              <p>${filmeAtual.sinopse}</p>
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
      document.getElementById('titulo').value = filmeAtual.titulo;
      document.getElementById('diretor').value = filmeAtual.diretor;
      document.getElementById('ano').value = filmeAtual.ano;
      document.getElementById('genero').value = filmeAtual.genero;
      document.getElementById('sinopse').value = filmeAtual.sinopse;
      document.getElementById('posterUrl').value = filmeAtual.posterUrl;
      document.getElementById('avaliacao').value = filmeAtual.avaliacao;
      
      fecharModal(modalDetalhes);
      modalFilme.style.display = 'block';
    }
    
    async function salvarFilme(e) {
      e.preventDefault();
      
      const filmeId = document.getElementById('filme-id').value;
      
      const filmeData = {
        titulo: document.getElementById('titulo').value,
        diretor: document.getElementById('diretor').value,
        ano: parseInt(document.getElementById('ano').value),
        genero: document.getElementById('genero').value,
        sinopse: document.getElementById('sinopse').value,
        posterUrl: document.getElementById('posterUrl').value || 'https://via.placeholder.com/500x750?text=Sem+Imagem',
        avaliacao: parseFloat(document.getElementById('avaliacao').value) || 0
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
      
      if (confirm(`Tem certeza que deseja excluir o filme "${filmeAtual.titulo}"?`)) {
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
        filme.titulo.toLowerCase().includes(termo) || 
        filme.diretor.toLowerCase().includes(termo) ||
        filme.genero.toLowerCase().includes(termo)
      );
      
      renderizarFilmes(resultados);
    }
  });