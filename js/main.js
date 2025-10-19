// Función del Modo Oscuro
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.className = "theme-toggle btn";
    themeToggle.innerHTML = `
        <i class="fa-solid fa-sun"></i>
        <i class="fa-solid fa-moon"></i>
    `;

    const buttonsContainer = document.querySelector(".buttons");
    if (buttonsContainer) {
        buttonsContainer.prepend(themeToggle);
    }

    // Obtener referencias a los íconos
    const sunIcon = themeToggle.querySelector(".fa-sun");
    const moonIcon = themeToggle.querySelector(".fa-moon");

    // Cargar tema guardado
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);

        // Actualizar íconos
        if (theme === "dark") {
            sunIcon.style.display = "none";
            moonIcon.style.display = "inline-flex";
            themeToggle.setAttribute("aria-label", "Cambiar a modo claro");
        } else {
            sunIcon.style.display = "inline-flex";
            moonIcon.style.display = "none";
            themeToggle.setAttribute("aria-label", "Cambiar a modo oscuro");
        }
    }

    // Aplicar tema inicial
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    // Alternar tema al hacer clic
    themeToggle.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";

        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
});

// Cargar preferencia guardada
document.addEventListener("DOMContentLoaded", () => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";

    if (savedDarkMode) {
        document.body.classList.add("dark-mode");
    }
});

// Funcionalidad del modal
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("catImage");
    const modalName = document.getElementById("catName");
    const modalDate = document.getElementById("catDate");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    initLazyLoading();
    enhanceLazyLoading();
    initPagination();

    // Obtener todas las imágenes de la galería
    const galleryItems = document.querySelectorAll(".gallery-card");
    let currentIndex = 0;

    // Abrir modal al hacer clic en una imagen
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            currentIndex = index;
            updateModal();
            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Prevenir scroll
        });
    });

    // Cerrar modal
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    });

    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // Navegación con teclado
    document.addEventListener("keydown", function (e) {
        if (modal.style.display === "block") {
            if (e.key === "Escape") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            } else if (e.key === "ArrowLeft") {
                navigate(-1);
            } else if (e.key === "ArrowRight") {
                navigate(1);
            }
        }
    });

    // Navegación con botones
    prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        navigate(-1);
    });

    nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        navigate(1);
    });

    // Función para navegar entre imágenes
    function navigate(direction) {
        currentIndex += direction;

        // Navegación circular
        if (currentIndex < 0) {
            currentIndex = galleryItems.length - 1;
        } else if (currentIndex >= galleryItems.length) {
            currentIndex = 0;
        }

        updateModal();
    }

    // Actualizar contenido del modal
    function updateModal() {
        const currentItem = galleryItems[currentIndex];
        const imgSrc = currentItem.querySelector("img").src;
        const name = currentItem.querySelector(".catName").textContent;
        const date = currentItem.querySelector(".catDate").textContent;

        modalImg.src = imgSrc;
        modalImg.alt = `Foto de ${name}`;
        modalName.textContent = name;
        modalDate.textContent = date;
    }
});

// Galería de Imágenes
let currentPage = 1;
const itemsPerPage = 8;
// Mejorar el lazy loading
function enhanceLazyLoading() {
    // Opción 1: Solo imágenes dentro de .gallery-grid-container
    const galleryImages = document.querySelectorAll(
        '.gallery-grid-container img[loading="lazy"]'
    );

    // Opción 2: Solo imágenes de tarjetas de galería
    // const galleryImages = document.querySelectorAll('.gallery-card img');

    galleryImages.forEach((img) => {
        if (!img.hasAttribute("data-src")) {
            img.setAttribute("data-src", img.src);

            // Solo aplicar estilos a imágenes de galería (no al logo)
            if (img.closest(".gallery-card")) {
                img.style.backgroundColor = "#f0f0f0";
                img.style.minHeight = "200px";

                img.onload = function () {
                    this.style.backgroundColor = "transparent";
                };
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        if (lazyImage.getAttribute("data-src")) {
                            lazyImage.src = lazyImage.getAttribute("data-src");
                            lazyImage.removeAttribute("data-src");
                        }
                        observer.unobserve(lazyImage);
                    }
                });
            });

            observer.observe(img);
        }
    });
}
function initLazyLoading() {
    const lazyImages = document.querySelectorAll(".gallery-card img");

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach((img) => {
        img.dataset.src = img.src;
        img.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
        imageObserver.observe(img);
    });
}

function loadMoreImages() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const allCards = document.querySelectorAll(".gallery-card");

    // Oculta todas las imágenes primero
    allCards.forEach((card) => (card.style.display = "none"));

    // Muestra solo las de la página actual
    for (let i = 0; i < endIndex && i < allCards.length; i++) {
        allCards[i].style.display = "block";
    }
}

function initPagination() {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Cargar más fotos";
    loadMoreBtn.className = "load-more-btn";
    loadMoreBtn.style.margin = "20px auto";
    loadMoreBtn.style.display = "block";

    loadMoreBtn.addEventListener("click", function () {
        currentPage++;
        loadMoreImages();

        // Oculta el botón si no hay más imágenes
        const totalCards = document.querySelectorAll(".gallery-card").length;
        if (currentPage * itemsPerPage >= totalCards) {
            loadMoreBtn.style.display = "none";
        }
    });

    document.querySelector(".gallery-grid-container").after(loadMoreBtn);
    loadMoreImages(); // Carga inicial
}

// Formulario de contacto
// form_name
// form_email

// Initialize EmailJS with your public key
(function () {
    // Replace this with your EmailJS public key
    emailjs.init("YvF95f3Jw4Je2bd-A");
})();

// Get form and success message elements
const contactForms = document.querySelectorAll(".contact-form");
const successMessage = document.getElementById("success-message");

// Add form submit event listener to each form
// Add form submit event listener to each form
contactForms.forEach(function (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form data
        const formData = {
            to_name: "Admin",
            form_name: document.getElementById("name").value,
            message: document.getElementById("message").value,
            reply_to: document.getElementById("email").value,
        };

        // Send email using EmailJS
        emailjs
            .send("service_vjswj04", "template_7rbsjxj", formData)
            .then(function () {
                // Show success message
                successMessage.classList.remove("hidden");
                event.target.reset();
                contactForm.reset();
            })
            .catch(function () {
                alert("Failed to send message. Please try again.");
            });
    });
});
// Mensaje de Emoji
const catButton = document.getElementById("catButton");
const catMessage = document.getElementById("catMessage");

catButton.addEventListener("click", () => {
    if (
        catMessage.style.display === "none" ||
        catMessage.style.display === ""
    ) {
        catMessage.style.display = "block";
        catMessage.textContent = "¡Miau!";
        catButton.textContent = "😸";
        catMessage.classList.add("fade-in");
        catMessage.addEventListener(
            "animationend",
            () => {
                catMessage.classList.remove("fade-in");
            },
            { once: true }
        );
    } else {
        catMessage.style.display = "none";
    }
});
