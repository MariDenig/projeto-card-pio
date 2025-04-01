// Componentes
const Componentes = {
    // Template para um item do menu
    menuItem: (produto) => `
        <article class="menu-item" role="article">
            <img 
                src="${produto.imagem}" 
                alt="${produto.nome}"
                class="lazy-image"
                loading="lazy"
                onload="this.classList.add('loaded')"
            >
            <h2>${produto.nome}</h2>
            <p>${produto.descricao}</p>
            <div class="produto-info">
                <p class="preco" aria-label="Preço: ${produto.preco.toFixed(2)} reais">
                    R$ ${produto.preco.toFixed(2)}
                </p>
                <p class="calorias" aria-label="${produto.calorias} calorias">
                    ${produto.calorias} kcal
                </p>
            </div>
            <div class="alergenos" role="list" aria-label="Alergenos presentes">
                ${produto.alergenos.map(alergeno => 
                    `<span class="alergeno-tag" role="listitem" aria-label="Contém ${alergeno}">${alergeno}</span>`
                ).join('')}
            </div>
            <button 
                class="adicionar-carrinho"
                aria-label="Adicionar ${produto.nome} ao carrinho"
                data-produto-id="${produto.id}"
            >
                Adicionar ao Carrinho
            </button>
        </article>
    `,

    // Template para um item do carrinho
    carrinhoItem: (produto) => `
        <div class="carrinho-item" role="listitem">
            <h4>${produto.nome}</h4>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <button 
                class="remover-item"
                aria-label="Remover ${produto.nome} do carrinho"
                data-produto-id="${produto.id}"
            >
                Remover
            </button>
        </div>
    `
};

// Estado da aplicação
const Estado = {
    carrinho: [],
    filtroAtual: 'todos',
    
    // Getters
    get totalCarrinho() {
        return this.carrinho.reduce((total, item) => total + item.preco, 0);
    },
    
    get quantidadeCarrinho() {
        return this.carrinho.length;
    }
};

// Utilitários
const Utils = {
    // Debounce para otimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Formatação de preço
    formatarPreco(preco) {
        return preco.toFixed(2).replace('.', ',');
    },

    // Lazy loading de imagens
    lazyLoadImages() {
        const images = document.querySelectorAll('.lazy-image');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// Gerenciador de eventos
const Eventos = {
    init() {
        // Menu mobile
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Foca no primeiro item do menu quando aberto
            if (!isExpanded) {
                setTimeout(() => {
                    const primeiroItem = nav.querySelector('a');
                    if (primeiroItem) primeiroItem.focus();
                }, 300);
            }
        });

        // Navegação por teclado no menu mobile
        nav.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                menuToggle.click();
            }
        });

        // Filtros
        const filtros = document.querySelectorAll('.filtro-btn');
        filtros.forEach(filtro => {
            filtro.addEventListener('click', () => {
                filtros.forEach(f => f.setAttribute('aria-pressed', 'false'));
                filtro.setAttribute('aria-pressed', 'true');
                Estado.filtroAtual = filtro.dataset.categoria;
                this.atualizarProdutos();
            });
        });

        // Carrinho
        const carrinhoBtn = document.querySelector('.carrinho-btn');
        const carrinhoConteudo = document.querySelector('.carrinho-conteudo');
        const fecharCarrinho = document.querySelector('.fechar-carrinho');

        carrinhoBtn.addEventListener('click', () => {
            carrinhoConteudo.classList.add('active');
            carrinhoConteudo.setAttribute('aria-hidden', 'false');
        });

        fecharCarrinho.addEventListener('click', () => {
            carrinhoConteudo.classList.remove('active');
            carrinhoConteudo.setAttribute('aria-hidden', 'true');
        });

        // Delegação de eventos para botões de adicionar/remover do carrinho
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('adicionar-carrinho')) {
                const produtoId = parseInt(e.target.dataset.produtoId);
                this.adicionarAoCarrinho(produtoId);
            } else if (e.target.classList.contains('remover-item')) {
                const produtoId = parseInt(e.target.dataset.produtoId);
                this.removerDoCarrinho(produtoId);
            }
        });

        // Redimensionamento da janela
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }, 250));

        // Renderização inicial
        this.atualizarProdutos();
        this.atualizarSobremesas();
        this.atualizarCarrinho();
    },

    // Atualização dos produtos baseado no filtro
    atualizarProdutos() {
        const container = document.getElementById('subs-container');
        const produtosFiltrados = produtos.subs.filter(produto => {
            if (Estado.filtroAtual === 'todos') return true;
            if (Estado.filtroAtual === 'sem-gluten') return !produto.alergenos.includes('glúten');
            return produto.categoria === Estado.filtroAtual;
        });

        container.innerHTML = produtosFiltrados
            .map(produto => Componentes.menuItem(produto))
            .join('');

        Utils.lazyLoadImages();
    },

    // Atualização das sobremesas
    atualizarSobremesas() {
        const container = document.getElementById('sobremesas-container');
        container.innerHTML = produtos.sobremesas
            .map(produto => Componentes.menuItem(produto))
            .join('');

        Utils.lazyLoadImages();
    },

    // Gerenciamento do carrinho
    adicionarAoCarrinho(produtoId) {
        const produto = [...produtos.subs, ...produtos.sobremesas]
            .find(p => p.id === produtoId);
        
        if (produto) {
            Estado.carrinho.push(produto);
            this.atualizarCarrinho();
        }
    },

    removerDoCarrinho(produtoId) {
        const index = Estado.carrinho.findIndex(item => item.id === produtoId);
        if (index > -1) {
            Estado.carrinho.splice(index, 1);
            this.atualizarCarrinho();
        }
    },

    atualizarCarrinho() {
        const carrinhoItems = document.querySelector('.carrinho-items');
        const carrinhoContador = document.querySelector('.carrinho-contador');
        const carrinhoTotal = document.querySelector('.carrinho-total');

        carrinhoItems.innerHTML = Estado.carrinho
            .map(produto => Componentes.carrinhoItem(produto))
            .join('');

        carrinhoContador.textContent = Estado.quantidadeCarrinho;
        carrinhoTotal.textContent = `Total: R$ ${Utils.formatarPreco(Estado.totalCarrinho)}`;
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Renderização inicial
    Eventos.atualizarProdutos();
    Eventos.atualizarCarrinho();
    
    // Inicialização de eventos
    Eventos.init();
    
    // Inicialização do lazy loading
    Utils.lazyLoadImages();
});
