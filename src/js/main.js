document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos Comuns ---
  const searchInput = document.getElementById("header-search");
  const btnHamburger = document.getElementById("btn-hamburger");
  const navbar = document.getElementById("navbar");

  // --- Elementos de Lojas ---
  const featuredStoresGrid = document.getElementById("featured-stores-grid");
  const allStoresGrid = document.getElementById("all-stores-grid");
  const categoryFilters = document.getElementById("category-filters");
  const btnReset = document.getElementById("btn-reset");
  const radioOrderingStores = document.querySelectorAll('input[name="ordenacao"]');

  // --- Elementos de Cinema ---
  const moviesGridHome = document.getElementById("movies-grid"); // ID da index.html
  const featuredMoviesGrid = document.getElementById("featured-movies-grid"); // ID alternativo de destaque
  const allMoviesGrid = document.getElementById("all-movies-grid"); // ID da página de cinema

  // --- Estados do Sistema ---
  let todasLojas = [];
  let todosFilmes = [];
  let categoriaSelecionada = "todas";
  let ordenacaoSelecionada = "padrao";
  let termoBusca = "";

  // ==========================================
  // FUNÇÃO DE RENDERIZAÇÃO DE CARDS
  // ==========================================
  // O parâmetro 'tipo' define qual HTML será gerado ("loja" ou "filme")
  function renderizarGrid(container, itens, tipo = "loja") {
    if (!container) return;

    if (!itens || itens.length === 0) {
      container.innerHTML = `<p style='grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;'>Nenhum item encontrado.</p>`;
      return;
    }

    if (tipo === "filme") {
      // --- TEMPLATE PARA CARTAZ DE CINEMA ---
      container.innerHTML = itens.map(filme => `
        <article class="card card-movie">
          <div class="card-image-placeholder movie-poster">
            <img src="${filme.imagem || 'https://via.placeholder.com/300x450?text=Sem+Cartaz'}" alt="Cartaz do filme ${filme.nome}">
          </div>
          <div class="card-info movie-info">
            <h3>${filme.nome}</h3>
            <!-- Você pode adicionar classificação ou duração aqui se tiver no JSON -->
            <button class="btn-favorite" aria-label="Favoritar filme ${filme.nome}">🤍</button>
          </div>
        </article>
      `).join("");
    } else {
      // --- TEMPLATE PADRÃO PARA LOJAS ---
      container.innerHTML = itens.map(loja => `
        <article class="card card-store">
          <div class="card-image-placeholder store-logo">
            <img src="${loja.imagem || 'https://via.placeholder.com/300x300?text=Sem+Logo'}" alt="Logo da loja ${loja.nome}">
          </div>
          <div class="card-info store-info">
            <div>
              <h3>${loja.nome}</h3>
              ${loja.categoria ? `<small style="color: var(--text-secondary); font-size: 11px;">${loja.categoria}</small>` : ''}
            </div>
            <button class="btn-favorite" aria-label="Favoritar loja ${loja.nome}">🤍</button>
          </div>
        </article>
      `).join("");
    }
  }

  // ==========================================
  // CARREGAMENTO E FILTROS DE LOJAS
  // ==========================================
  async function carregarLojas() {
    try {
      const resposta = await fetch("./src/js/lojas.json");
      todasLojas = await resposta.json();

      if (featuredStoresGrid) {
        const destaques = todasLojas.filter(loja => loja.destaque);
        // Passa "loja" como tipo
        renderizarGrid(featuredStoresGrid, destaques, "loja");
      }

      if (allStoresGrid) {
        aplicarFiltrosLojas();
      }
    } catch (erro) {
      console.error("Erro ao carregar as lojas:", erro);
    }
  }

  function aplicarFiltrosLojas() {
    if (!allStoresGrid) return;

    let resultado = [...todasLojas];

    if (categoriaSelecionada !== "todas") {
      resultado = resultado.filter(loja => loja.categoria === categoriaSelecionada);
    }

    if (termoBusca) {
      resultado = resultado.filter(loja =>
        loja.nome.toLowerCase().includes(termoBusca) ||
        (loja.categoria && loja.categoria.toLowerCase().includes(termoBusca))
      );
    }

    if (ordenacaoSelecionada === "az") {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    // Passa "loja" como tipo
    renderizarGrid(allStoresGrid, resultado, "loja");
  }

  // ==========================================
  // CARREGAMENTO DE FILMES
  // ==========================================
  async function carregarFilmes() {
    try {
      // Usando filmes.json fornecido anteriormente
      const resposta = await fetch("./src/js/filmes.json");
      todosFilmes = await resposta.json();

      const containerHome = moviesGridHome || featuredMoviesGrid;

      if (containerHome) {
        const destaques = todosFilmes.filter(filme => filme.destaque);
        // Passa "filme" como tipo para usar o template correto
        renderizarGrid(containerHome, destaques, "filme");
      }

      if (allMoviesGrid) {
        // Passa "filme" como tipo
        renderizarGrid(allMoviesGrid, todosFilmes, "filme");
      }
    } catch (erro) {
      console.error("Erro ao carregar os filmes:", erro);
    }
  }

  // ==========================================
  // EVENT LISTENERS E BUSCA
  // ==========================================

  // Filtros de Lojas (inalterado)
  if (categoryFilters) {
    categoryFilters.addEventListener("change", (e) => {
      if (e.target.name === "categoria") {
        categoriaSelecionada = e.target.value;
        aplicarFiltrosLojas();
      }
    });
  }

  radioOrderingStores.forEach(radio => {
    radio.addEventListener("change", (e) => {
      ordenacaoSelecionada = e.target.value;
      aplicarFiltrosLojas();
    });
  });

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      categoriaSelecionada = "todas";
      ordenacaoSelecionada = "padrao";
      termoBusca = "";
      if (searchInput) searchInput.value = "";
      const radioTodas = document.querySelector('input[name="categoria"][value="todas"]');
      const radioPadrao = document.querySelector('input[name="ordenacao"][value="padrao"]');
      if (radioTodas) radioTodas.checked = true;
      if (radioPadrao) radioPadrao.checked = true;
      aplicarFiltrosLojas();
    });
  }

  // Busca do Header (Sensível ao tipo de grid ativo)
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      termoBusca = e.target.value.toLowerCase().trim();

      // Atualiza Lojas
      if (allStoresGrid) {
        aplicarFiltrosLojas();
      } else if (featuredStoresGrid) {
        const lojasFiltradas = todasLojas.filter(loja =>
          loja.nome.toLowerCase().includes(termoBusca) ||
          (loja.categoria && loja.categoria.toLowerCase().includes(termoBusca))
        );
        renderizarGrid(featuredStoresGrid, lojasFiltradas, "loja");
      }

      // Atualiza Filmes
      const gridFilmesAtivo = moviesGridHome || featuredMoviesGrid || allMoviesGrid;
      if (gridFilmesAtivo) {
        const filmesFiltrados = todosFilmes.filter(filme =>
          filme.nome.toLowerCase().includes(termoBusca)
        );
        // Garante que usa o tipo "filme" na busca também
        renderizarGrid(gridFilmesAtivo, filmesFiltrados, "filme");
      }
    });
  }

  // Menu Hambúrguer (Mobile)
  if (btnHamburger && navbar) {
    btnHamburger.addEventListener("click", () => {
      btnHamburger.classList.toggle("active");
      navbar.classList.toggle("active");
    });
    document.querySelectorAll(".navbar-list a").forEach(link => {
      link.addEventListener("click", () => {
        btnHamburger.classList.remove("active");
        navbar.classList.remove("active");
      });
    });
  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================
  if (featuredStoresGrid || allStoresGrid) {
    carregarLojas();
  }

  if (moviesGridHome || featuredMoviesGrid || allMoviesGrid) {
    carregarFilmes();
  }
});
