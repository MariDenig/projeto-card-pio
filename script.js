document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle'); // Botão do menu hamburguer
    const nav = document.querySelector('nav'); // Elemento de navegação
    const body = document.body; // Corpo do documento

    // Função para fechar o menu
    function closeMenu() {
        nav.classList.remove('active'); // Remove a classe 'active' da navegação
        menuToggle.classList.remove('active'); // Remove a classe 'active' do botão
        body.classList.remove('menu-open'); // Remove a classe do corpo da página
        setTimeout(() => {
            body.style.overflow = ''; // Restaura o scroll do corpo
        }, 300);
    }

    // Evento de clique no botão de menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede que o clique se propague para outros elementos
        nav.classList.toggle('active'); // Alterna a classe 'active' na navegação
        menuToggle.classList.toggle('active'); // Alterna a classe 'active' no botão
        body.classList.toggle('menu-open'); // Alterna a classe no corpo
        
        if (body.classList.contains('menu-open')) {
            body.style.overflow = 'hidden'; // Impede a rolagem da página ao abrir o menu
        } else {
            setTimeout(() => {
                body.style.overflow = ''; // Restaura a rolagem ao fechar o menu
            }, 300);
        }
    });

    // Fecha o menu ao clicar em um link dentro dele
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha o menu automaticamente ao redimensionar a tela para um tamanho maior que 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Fecha o menu ao clicar fora dele (apenas em telas menores que 768px)
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) { // Só executa em dispositivos móveis
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                closeMenu();
            }
        }
    });
});
