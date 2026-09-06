# Shopping Praia Sul — Plataforma Web

Projeto desenvolvido como estudo de caso e peça de portfólio profissional para a plataforma digital fictícia do **Shopping Praia Sul**. A aplicação consiste em um portal responsivo com renderização dinâmica de conteúdos, busca em tempo real e sistema de filtragem de lojas.

---

## Tecnologias Utilizadas

* **HTML5:** Estruturação semântica das páginas (`index.html` e `lojas.html`).
* **CSS3:** Estilização moderna com variáveis CSS, CSS Grid, Flexbox, efeitos de glassmorphism e media queries responsivas.
* **JavaScript (ES6+):** Manipulação do DOM, consumo de dados locais via `fetch API`, lógica do menu hambúrguer e algoritmos de busca e filtragem.
* **JSON:** Estrutura de dados para armazenamento do catálogo de lojas e marcas.

---

## Funcionalidades

- [x] **Navegação Responsiva:** Header com efeito translúcido e menu hambúrguer para dispositivos móveis.
- [x] **Busca Dinâmica:** Filtragem em tempo real na barra de pesquisa superior.
- [x] **Consumo de Dados:** Injeção dinâmica de cards de lojas a partir do arquivo `lojas.json`.
- [x] **Catálogo Completo (`lojas.html`):**
  - Filtro interativo por categoria.
  - Ordenação por ordem alfabética (A-Z).
  - Botão de redefinição de filtros.

---

## Estrutura de Arquivos

```text
├── assets/
│   ├── css/
│   │   └── style.css
│   └── images/
├── src/
│   └── js/
│       ├── lojas.json
│       └── main.js
├── index.html
├── lojas.html
└── README.md
