document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
        disable: function() {
            return window.innerWidth < 768; 
        }
    });
    document.body.classList.add('dark-mode');

    const categoryButtons = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;

            galleryItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
        
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navWrapper = document.querySelector('.nav-wrapper');
    const dropdowns = document.querySelectorAll('.dropdown');
    let overlay;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }
    createOverlay();

    function toggleSidebar() {
        navWrapper.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
        overlay.classList.toggle('active');
        document.body.style.overflow = navWrapper.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleSidebar);

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            } else {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    smoothScroll(targetId, 1000);
                }
            }
        });
    });

    const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown a)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navWrapper.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    overlay.addEventListener('click', () => {
        if (navWrapper.classList.contains('active')) {
            toggleSidebar();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navWrapper.classList.contains('active')) {
            toggleSidebar();
        }
    });

    function smoothScroll(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
        const navbarHeight = 70;
        const finalPosition = targetPosition - navbarHeight;
        const distance = finalPosition - startPosition;
        const speed = 4;
        const duration = Math.abs(distance) / speed;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const currentPosition = startPosition + distance * progress;
            window.scrollTo(0, currentPosition);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    const testimonialsSwiper = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
                
            },
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
});

document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

function showServiceDetails(service) {
    const serviceDetails = {
        'web-development': {
            text: 'Learn modern web development technologies including HTML5, CSS3, JavaScript, React and more.',
            icon: 'code'
        },
        'steam': {
            text: 'Experience our integrated STEAM curriculum combining Science, Technology, Engineering, Arts and Mathematics.',
            icon: 'microscope'
        },
        'robotics': {
            text: 'Master robotics through hands-on training with Arduino, sensors, actuators, and mechanical design.',
            icon: 'robot'
        }
    };

    const isDarkMode = document.body.classList.contains('dark-mode');
    const customIcon = `<i class="fas fa-${serviceDetails[service].icon}" style="font-size: 3rem; color: ${isDarkMode ? '#60a5fa' : '#2563eb'}"></i>`;

    Swal.fire({
        title: service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        text: serviceDetails[service].text,
        iconHtml: customIcon,
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        },
        customClass: {
            popup: isDarkMode ? 'dark-mode-popup' : '',
            icon: 'custom-swal-icon'
        },
        showConfirmButton: true,
        confirmButtonText: 'Close',
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b',
        confirmButtonColor: isDarkMode ? '#60a5fa' : '#2563eb'
    });
}

emailjs.init("KFASveIn4B1m_Sq0z");

function sendEmail(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const templateParams = {
        from_name: document.getElementById('first-name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_name: 'Robo Class Nepal',
        reply_to: document.getElementById('email').value
    };

    emailjs.send('service_ahctc8t', 'template_quvb8pi', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            Swal.fire({
                title: 'Message Sent!',
                text: 'Thank you for contacting us. We will get back to you soon.',
                icon: 'success',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                },
                customClass: {
                    popup: isDarkMode ? 'dark-mode-popup' : '',
                    icon: 'custom-swal-icon'
                },
                background: isDarkMode ? '#1a1a1a' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#1e293b',
                confirmButtonColor: isDarkMode ? '#60a5fa' : '#2563eb'
            });

            document.getElementById('contactForm').reset();
        }, function(error) {
            console.log('FAILED...', error);
            Swal.fire({
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
                icon: 'error',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                },
                customClass: {
                    popup: isDarkMode ? 'dark-mode-popup' : '',
                    icon: 'custom-swal-icon'
                },
                background: isDarkMode ? '#1a1a1a' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#1e293b',
                confirmButtonColor: isDarkMode ? '#60a5fa' : '#2563eb'
            });
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });

    return false;
}
