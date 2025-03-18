document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;

    function closeMenu() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        setTimeout(() => {
            body.style.overflow = '';
        }, 300);
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        if (body.classList.contains('menu-open')) {
            body.style.overflow = 'hidden';
        } else {
            setTimeout(() => {
                body.style.overflow = '';
            }, 300);
        }
    });

    
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

   
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) { // Só executa em mobile
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                closeMenu();
            }
        }
    });
}); 