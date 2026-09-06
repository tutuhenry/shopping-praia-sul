document.addEventListener("DOMContentLoaded", () => {
  // Elementos da Home
  const featuredStoresGrid = document.getElementById("featured-stores-grid");
  
  // Elementos da Página Lojas.html
  const allStoresGrid = document.getElementById("all-stores-grid");
  const categoryFilters = document.getElementById("category-filters");
  const btnReset = document.getElementById("btn-reset");
  const radioOrdering = document.querySelectorAll('input[name="ordenacao"]');

  // Elemento Comum
  const searchInput = document.getElementById("header-search");

  let todasLojas = [];
  let categoriaSelecionada = "todas";
  let ordenacaoSelecionada = "padrao";
  let termoBusca = "";

  // Função para carregar os dados do arquivo JSON
  async function carregarLojas() {
    try {
      const resposta = await fetch("./src/js/lojas.json");
      todasLojas = await resposta.json();

      // Se estiver na Home, renderiza os destaques
      if (featuredStoresGrid) {
        const destaques = todasLojas.filter(loja => loja.destaque);
        renderizarGrid(featuredStoresGrid, destaques);
      }

      // Se estiver na página lojas.html, renderiza com filtros
      if (allStoresGrid) {
        aplicarFiltros();
      }
    } catch (erro) {
      console.error("Erro ao carregar as lojas:", erro);
    }
  }

  // Função genérica para criar e injetar os cards HTML
  function renderizarGrid(container, lojas) {
    if (!container) return;

    if (lojas.length === 0) {
      container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;'>Nenhuma loja encontrada.</p>";
      return;
    }

    container.innerHTML = lojas.map(loja => `
      <article class="card">
        <div class="card-image-placeholder">
          <img src="${loja.imagem}" alt="Logo ${loja.nome}">
        </div>
        <div class="card-info">
          <div>
            <h3>${loja.nome}</h3>
            <small style="color: var(--text-secondary); font-size: 11px;">${loja.categoria}</small>
          </div>
          <button class="btn-favorite" aria-label="Favoritar loja ${loja.nome}">🤍</button>
        </div>
      </article>
    `).join("");
  }

  // Aplica todos os filtros acumulados
  function aplicarFiltros() {
    if (!allStoresGrid) return;

    let resultado = [...todasLojas];

    // Filtro por Categoria
    if (categoriaSelecionada !== "todas") {
      resultado = resultado.filter(loja => loja.categoria === categoriaSelecionada);
    }

    // Filtro por Busca de Texto
    if (termoBusca) {
      resultado = resultado.filter(loja => 
        loja.nome.toLowerCase().includes(termoBusca) ||
        loja.categoria.toLowerCase().includes(termoBusca)
      );
    }

    // Ordenação A-Z
    if (ordenacaoSelecionada === "az") {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    renderizarGrid(allStoresGrid, resultado);
  }

  // Event Listeners dos Filtros (Página lojas.html)
  if (categoryFilters) {
    categoryFilters.addEventListener("change", (e) => {
      if (e.target.name === "categoria") {
        categoriaSelecionada = e.target.value;
        aplicarFiltros();
      }
    });
  }

  radioOrdering.forEach(radio => {
    radio.addEventListener("change", (e) => {
      ordenacaoSelecionada = e.target.value;
      aplicarFiltros();
    });
  });

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      categoriaSelecionada = "todas";
      ordenacaoSelecionada = "padrao";
      termoBusca = "";

      if (searchInput) searchInput.value = "";

      // Reseta os radio buttons no HTML
      const radioTodas = document.querySelector('input[name="categoria"][value="todas"]');
      const radioPadrao = document.querySelector('input[name="ordenacao"][value="padrao"]');
      if (radioTodas) radioTodas.checked = true;
      if (radioPadrao) radioPadrao.checked = true;

      aplicarFiltros();
    });
  }

  // Evento do Buscador no Header
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      termoBusca = e.target.value.toLowerCase().trim();

      if (allStoresGrid) {
        aplicarFiltros();
      } else if (featuredStoresGrid) {
        // Se estiver na home, filtra os cards da home
        const filtradas = todasLojas.filter(loja => 
          loja.nome.toLowerCase().includes(termoBusca) ||
          loja.categoria.toLowerCase().includes(termoBusca)
        );
        renderizarGrid(featuredStoresGrid, filtradas);
      }
    });
  }

  // Inicializa a aplicação
  carregarLojas();
});

// Lógica do Menu Hambúrguer - Mobile

const btnHamburger = document.getElementById("btn-hamburger");
const navbar = document.getElementById("navbar");

if (btnHamburger && navbar) {
  btnHamburger.addEventListener("click", () => {
    btnHamburger.classList.toggle("active");
    navbar.classList.toggle("active");
  });

  // Fecha o menu ao clicar em qualquer link
  document.querySelectorAll(".navbar-list a").forEach(link => {
    link.addEventListener("click", () => {
      btnHamburger.classList.remove("active");
      navbar.classList.remove("active");
    });
  });
}

