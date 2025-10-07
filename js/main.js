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

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }

    themeToggle.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
});

// Cargar preferencia guardada
document.addEventListener("DOMContentLoaded", () => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";

    if (savedDarkMode) {
        document.body.classList.add("dark-mode");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        themeToggle.setAttribute("aria-label", "Toggle light mode");
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
        // Replace Service_ID and Template_ID with your EmailJS service and template IDs
        emailjs
            .send("service_vjswj04", "template_7rbsjxj", formData)
            .then(function (response) {
                // Show success message
                successMessage.classList.remove("hidden");
                event.target.reset();
                contactForm.reset();
            })
            .catch(function (error) {
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
