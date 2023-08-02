/*========== SCROLL SECTIONS ACTIVE LINK =========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active-link');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active-link');
            });
        };
    });
};    


/*========== SHOW MENU =========*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

/*========== MENU SHOW=========*/
if (navToggle) {
  navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
  });
}

/*========== MENU HIDDEN =========*/
if (navClose) {
    navClose.addEventListener('click', () => {
          navMenu.classList.remove('show-menu');
    });
  }



/*========== HOME SWPER =========*/
 var homeSswiper = new Swiper('.home-swiper', {
    spaceBetween: 30,
    loop: 'true',
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
 });

 
/*========== DEALS TAB =========*/
const tabs = document.querySelectorAll('[data-target]'),
 tabContents = document.querySelectorAll('[content]');

 tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);
        tabContents.forEach((tabContent) => {
            tabContent.classList.remove('active-tab');
        });

        target.classList.add('active-tab');

        tabs.forEach((tab) => {
            tab.classList.remove('active-tab');
        });

        tab.classList.add('active-tab');
    });
 });

/*========== SHOW SCROLL UP =========*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    //Quando a rolagem for maior que 350 viewport heigt, adicione a classe show-scroll a uma tag com a classe scroll-top
    if(this.scrollY >= 350) scrollUp.classList.add('show-scroll');
    else scrollUp.classList.remove('show-scroll')
}


window.addEventListener('scroll', scrollUp)

 