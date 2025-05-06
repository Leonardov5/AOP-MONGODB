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
    const btnVoltar = document.getElementById('btn-voltar');
    const btnEditar = document.getElementById('btn-editar');
    const btnExcluir = document.getElementById('btn-excluir');
    const fecharBtns = document.querySelectorAll('.fechar');

    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');

    let paginaAtual = 1;
    let totalPaginas = 1;
    let filmesPorPagina = 48;
    let todosFilmes = [];
    let filmes = [];
    let filmeAtual = null;

    carregarFilmes();

    abrirCadastro.addEventListener('click', () => abrirModalCadastro());
    btnCancelar.addEventListener('click', () => fecharModal(modalFilme));
    btnVoltar.addEventListener('click', () => voltarParaDetalhes());
    formFilme.addEventListener('submit', salvarFilme);
    btnEditar.addEventListener('click', editarFilmeAtual);
    btnExcluir.addEventListener('click', excluirFilmeAtual);
    btnPesquisar.addEventListener('click', pesquisarFilmes);
    inputPesquisa.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') pesquisarFilmes();
    });

    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            mudarPagina(paginaAtual - 1);
        }
    });

    btnProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            mudarPagina(paginaAtual + 1);
        }
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
            todosFilmes = await ApiService.getFilmes();
            totalPaginas = Math.ceil(todosFilmes.length / filmesPorPagina);
            filmes = paginarFilmes(todosFilmes, paginaAtual);
            renderizarFilmes(filmes);
            atualizarControlesPaginacao();
        } catch (error) {
            listaFilmes.innerHTML = `<div class="error">Erro ao carregar filmes: ${error.message}</div>`;
        }
    }

    function paginarFilmes(filmes, pagina) {
        const inicio = (pagina - 1) * filmesPorPagina;
        const fim = inicio + filmesPorPagina;
        return filmes.slice(inicio, fim);
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
                <span>★</span> ${filme.imdb && filme.imdb.rating ? filme.imdb.rating.toFixed(1) : 'N/A'}
              </div>
            </div>
          </div>
        `;

            filmeCard.addEventListener('click', () => abrirDetalhes(filme._id));
            listaFilmes.appendChild(filmeCard);
        });
    }

    function atualizarControlesPaginacao() {
        const paginasContainer = document.getElementById('paginas-container');

        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = paginaAtual === totalPaginas;

        paginasContainer.innerHTML = '';

        let startPage = Math.max(1, paginaAtual - 2);
        let endPage = Math.min(totalPaginas, paginaAtual + 2);

        if (endPage - startPage < 4 && totalPaginas > 5) {
            if (paginaAtual <= 3) {
                endPage = Math.min(5, totalPaginas);
            } else if (paginaAtual >= totalPaginas - 2) {
                startPage = Math.max(1, totalPaginas - 4);
            }
        }

        if (startPage > 1) {
            adicionarBotaoPagina(1);
            if (startPage > 2) {
                adicionarEllipsis();
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            adicionarBotaoPagina(i);
        }

        if (endPage < totalPaginas) {
            if (endPage < totalPaginas - 1) {
                adicionarEllipsis();
            }
            adicionarBotaoPagina(totalPaginas);
        }
    }

    function adicionarBotaoPagina(numeroPagina) {
        const paginasContainer = document.getElementById('paginas-container');
        const botao = document.createElement('button');
        botao.textContent = numeroPagina;
        botao.classList.add('btn-pagina');
        if (numeroPagina === paginaAtual) {
            botao.classList.add('ativo');
        }
        botao.addEventListener('click', () => mudarPagina(numeroPagina));
        paginasContainer.appendChild(botao);
    }

    function adicionarEllipsis() {
        const paginasContainer = document.getElementById('paginas-container');
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.classList.add('ellipsis');
        paginasContainer.appendChild(ellipsis);
    }

    function mudarPagina(pagina) {
        paginaAtual = pagina;
        filmes = paginarFilmes(todosFilmes, paginaAtual);
        renderizarFilmes(filmes);
        atualizarControlesPaginacao();
        listaFilmes.scrollIntoView({ behavior: 'smooth' });
    }

    function abrirModalCadastro() {
        modalTitulo.textContent = 'Adicionar Novo Filme';
        formFilme.reset();
        document.getElementById('filme-id').value = '';
        modalFilme.style.display = 'block';
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    async function abrirDetalhes(id) {
        try {
            const data = await ApiService.getFilmeWithComments(id);
            filmeAtual = data.filme;
            const comments = data.comments;

            const detalhesContent = document.getElementById('detalhes-content');
            
            // Construir bloco de informações do filme com detalhes estendidos
            let filmeMeta = '';
            if (filmeAtual.directors && filmeAtual.directors.length) {
                filmeMeta += `<div>Realizador: ${filmeAtual.directors.join(', ')}</div>`;
            }
            if (filmeAtual.genres && filmeAtual.genres.length) {
                filmeMeta += `<div>Género: ${filmeAtual.genres.join(', ')}</div>`;
            }
            if (filmeAtual.imdb && filmeAtual.imdb.rating) {
                filmeMeta += `<div>Avaliação: ${filmeAtual.imdb.rating.toFixed(1)}/10 ★ (${filmeAtual.imdb.votes || 0} votos)</div>`;
            }
            if (filmeAtual.runtime) {
                filmeMeta += `<div>Duração: ${filmeAtual.runtime} minutos</div>`;
            }
            if (filmeAtual.cast && filmeAtual.cast.length) {
                filmeMeta += `<div>Elenco: ${filmeAtual.cast.join(', ')}</div>`;
            }
            if (filmeAtual.languages && filmeAtual.languages.length) {
                filmeMeta += `<div>Idiomas: ${filmeAtual.languages.join(', ')}</div>`;
            }
            if (filmeAtual.countries && filmeAtual.countries.length) {
                filmeMeta += `<div>Países: ${filmeAtual.countries.join(', ')}</div>`;
            }
            if (filmeAtual.released) {
                filmeMeta += `<div>Data de Lançamento: ${formatDate(filmeAtual.released)}</div>`;
            }
            if (filmeAtual.writers && filmeAtual.writers.length) {
                filmeMeta += `<div>Argumentistas: ${filmeAtual.writers.join(', ')}</div>`;
            }
            if (filmeAtual.awards && filmeAtual.awards.text) {
                filmeMeta += `<div>Prémios: ${filmeAtual.awards.text}</div>`;
            }

            detalhesContent.innerHTML = `
                <img src="${filmeAtual.poster}" alt="${filmeAtual.title}" class="detalhes-poster">
                <div class="detalhes-info">
                    <h2>${filmeAtual.title} (${filmeAtual.year})</h2>
                    <div class="detalhes-meta">
                        ${filmeMeta}
                    </div>
                    ${filmeAtual.fullplot ? `
                    <div class="detalhes-resumo">
                        <h3>Resumo</h3>
                        <p>${filmeAtual.fullplot}</p>
                    </div>` : (filmeAtual.plot ? `
                    <div class="detalhes-resumo">
                        <h3>Resumo</h3>
                        <p>${filmeAtual.plot}</p>
                    </div>` : '')}
                    
                    <div class="detalhes-comentarios">
                        <h3>Comentários (${comments.length})</h3>
                        <div class="form-comentario">
                            <h4>Adicionar um comentário</h4>
                            <form id="form-comentario">
                                <input type="text" id="comment-name" placeholder="O teu nome" required>
                                <input type="email" id="comment-email" placeholder="O teu email" required>
                                <textarea id="comment-text" placeholder="O teu comentário" required></textarea>
                                <button type="submit">Enviar Comentário</button>
                            </form>
                        </div>
                        <div id="lista-comentarios" class="lista-comentarios">
                        ${renderizarComentarios(comments)}
                        </div>
                    </div>
                </div>
            `;

            // Adicionar listener ao formulário de comentário
            const formComentario = document.getElementById('form-comentario');
            formComentario.addEventListener('submit', (e) => adicionarComentario(e, filmeAtual._id));

            modalDetalhes.style.display = 'block';
        } catch (error) {
            alert(`Erro ao carregar detalhes do filme: ${error.message}`);
        }
    }

    function renderizarComentarios(comentarios) {
        if (!comentarios || comentarios.length === 0) {
            return '<p class="no-comments">Ainda não há comentários para este filme.</p>';
        }

        return comentarios.map(comment => `
            <div class="comentario" data-id="${comment._id}">
                <div class="comentario-cabecalho">
                    <strong>${comment.name}</strong>
                    <span class="comentario-data">${formatDate(comment.date)}</span>
                </div>
                <p>${comment.text}</p>
            </div>
        `).join('');
    }

    async function adicionarComentario(e, movieId) {
        e.preventDefault();
        
        const name = document.getElementById('comment-name').value;
        const email = document.getElementById('comment-email').value;
        const text = document.getElementById('comment-text').value;
        
        try {
            const comment = await ApiService.addComment(movieId, { name, email, text });
            
            // Limpar o formulário
            document.getElementById('form-comentario').reset();
            
            // Adicionar o novo comentário à lista
            const listaComentarios = document.getElementById('lista-comentarios');
            const noComment = listaComentarios.querySelector('.no-comments');
            if (noComment) {
                listaComentarios.innerHTML = '';
            }
            
            const comentarioElement = document.createElement('div');
            comentarioElement.className = 'comentario';
            comentarioElement.dataset.id = comment._id;
            comentarioElement.innerHTML = `
                <div class="comentario-cabecalho">
                    <strong>${comment.name}</strong>
                    <span class="comentario-data">${formatDate(comment.date)}</span>
                </div>
                <p>${comment.text}</p>
            `;
            
            listaComentarios.prepend(comentarioElement);
        } catch (error) {
            alert(`Erro ao adicionar comentário: ${error.message}`);
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
        document.getElementById('diretor').value = filmeAtual.directors ? filmeAtual.directors.join(', ') : '';
        document.getElementById('ano').value = filmeAtual.year;
        document.getElementById('genero').value = filmeAtual.genres ? filmeAtual.genres.join(', ') : '';
        document.getElementById('resumo').value = filmeAtual.fullplot || filmeAtual.plot || '';
        document.getElementById('posterUrl').value = filmeAtual.poster || '';
        document.getElementById('avaliacao').value = filmeAtual.imdb && filmeAtual.imdb.rating ? filmeAtual.imdb.rating : '';
        
        // Preencher campos adicionais
        document.getElementById('runtime').value = filmeAtual.runtime || '';
        document.getElementById('cast').value = filmeAtual.cast ? filmeAtual.cast.join(', ') : '';
        document.getElementById('languages').value = filmeAtual.languages ? filmeAtual.languages.join(', ') : '';
        document.getElementById('countries').value = filmeAtual.countries ? filmeAtual.countries.join(', ') : '';
        document.getElementById('released').value = filmeAtual.released ? new Date(filmeAtual.released).toISOString().split('T')[0] : '';
        document.getElementById('writers').value = filmeAtual.writers ? filmeAtual.writers.join(', ') : '';
        document.getElementById('awards').value = filmeAtual.awards && filmeAtual.awards.text ? filmeAtual.awards.text : '';
        document.getElementById('votes').value = filmeAtual.imdb && filmeAtual.imdb.votes ? filmeAtual.imdb.votes : '';

        fecharModal(modalDetalhes);
        modalFilme.style.display = 'block';
    }

    async function salvarFilme(e) {
        e.preventDefault();

        const filmeId = document.getElementById('filme-id').value;

        const filmeData = {
            title: document.getElementById('titulo').value,
            directors: document.getElementById('diretor').value.split(',').map(item => item.trim()),
            year: parseInt(document.getElementById('ano').value),
            genres: document.getElementById('genero').value.split(',').map(item => item.trim()),
            fullplot: document.getElementById('resumo').value,
            plot: document.getElementById('resumo').value,
            poster: document.getElementById('posterUrl').value || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
            runtime: parseInt(document.getElementById('runtime').value) || null,
            cast: document.getElementById('cast').value ? document.getElementById('cast').value.split(',').map(item => item.trim()) : [],
            languages: document.getElementById('languages').value ? document.getElementById('languages').value.split(',').map(item => item.trim()) : [],
            countries: document.getElementById('countries').value ? document.getElementById('countries').value.split(',').map(item => item.trim()) : [],
            released: document.getElementById('released').value ? new Date(document.getElementById('released').value) : null,
            writers: document.getElementById('writers').value ? document.getElementById('writers').value.split(',').map(item => item.trim()) : [],
            awards: {
                text: document.getElementById('awards').value || ''
            },
            imdb: {
                rating: parseFloat(document.getElementById('avaliacao').value) || 0,
                votes: parseInt(document.getElementById('votes').value) || 0
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
            alert(`Erro ao guardar filme: ${error.message}`);
        }
    }

    async function excluirFilmeAtual() {
        if (!filmeAtual) return;

        if (confirm(`Tem a certeza que deseja eliminar o filme "${filmeAtual.title}"?`)) {
            try {
                await ApiService.excluirFilme(filmeAtual._id);
                alert('Filme eliminado com sucesso!');
                fecharModal(modalDetalhes);
                carregarFilmes();
            } catch (error) {
                alert(`Erro ao eliminar filme: ${error.message}`);
            }
        }
    }

    function pesquisarFilmes() {
        const termo = inputPesquisa.value.toLowerCase().trim();

        if (!termo) {
            carregarFilmes();
            return;
        }

        const filmesFiltrados = todosFilmes.filter(filme =>
            filme.title.toLowerCase().includes(termo) ||
            (filme.directors && filme.directors.some(diretor => diretor.toLowerCase().includes(termo))) ||
            (filme.genres && filme.genres.some(genero => genero.toLowerCase().includes(termo))) ||
            (filme.plot && filme.plot.toLowerCase().includes(termo)) ||
            (filme.cast && filme.cast.some(ator => ator.toLowerCase().includes(termo))) ||
            (filme.year && filme.year.toString().includes(termo))
        );

        paginaAtual = 1;
        totalPaginas = Math.ceil(filmesFiltrados.length / filmesPorPagina);
        const filmesExibidos = paginarFilmes(filmesFiltrados, paginaAtual);
        renderizarFilmes(filmesExibidos);
        atualizarControlesPaginacao();
    }

    function voltarParaDetalhes() {
        fecharModal(modalFilme);
        modalDetalhes.style.display = 'block';
    }
});