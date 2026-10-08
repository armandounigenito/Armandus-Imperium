document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.getElementById("header");
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const themeToggle = document.getElementById("themeToggle");
    const backToTop = document.getElementById("backToTop");
    const currentYear = document.getElementById("currentYear");
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    /* =========================
       MENU MOBILE
    ========================== */
    function setMenu(open) {
        if (!navbar || !menuToggle) return;

        navbar.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");

        const icon = menuToggle.querySelector("i");
        if (icon) {
            icon.className = open
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navbar.classList.contains("active");
            setMenu(!isOpen);
        });
    }

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("click", (event) => {
        if (!navbar || !menuToggle) return;

        const isMobile = window.innerWidth <= 900;
        const clickedInsideMenu =
            navbar.contains(event.target) || menuToggle.contains(event.target);

        if (isMobile && navbar.classList.contains("active") && !clickedInsideMenu) {
            setMenu(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            setMenu(false);
        }
    });

    /* =========================
       TEMA ESCURO / CLARO
    ========================== */
    const savedTheme = localStorage.getItem("armandus-theme");

    if (savedTheme === "light") {
        body.classList.add("light-mode");
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");
        const isLight = body.classList.contains("light-mode");

        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Ativar modo escuro" : "Ativar modo claro"
        );

        themeToggle.setAttribute(
            "title",
            isLight ? "Modo escuro" : "Modo claro"
        );

        if (icon) {
            icon.className = isLight
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }
    }

    updateThemeButton();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("light-mode");

            const theme = body.classList.contains("light-mode")
                ? "light"
                : "dark";

            localStorage.setItem("armandus-theme", theme);
            updateThemeButton();
        });
    }

    /* =========================
       HEADER AO FAZER SCROLL
    ========================== */
    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 20);

        if (backToTop) {
            backToTop.classList.toggle("show", window.scrollY > 450);
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* =========================
       BOTÃO VOLTAR AO TOPO
    ========================== */
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* =========================
       ANO AUTOMÁTICO
    ========================== */
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =========================
       LINKS ATIVOS DO MENU
    ========================== */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const id = entry.target.getAttribute("id");

                navLinks.forEach((link) => {
                    const isActive = link.getAttribute("href") === `#${id}`;
                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    /* =========================
       ANIMAÇÕES DE ENTRADA
    ========================== */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    /* =========================
       FORMULÁRIO
       Esta versão prepara o conteúdo
       e abre o cliente de email.
    ========================== */
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nome = document.getElementById("nome")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const mensagem = document.getElementById("mensagem")?.value.trim();

            if (!nome || !email || !mensagem) {
                if (formStatus) {
                    formStatus.textContent = "Preencha todos os campos antes de continuar.";
                }
                return;
            }

            const subject = encodeURIComponent(
                `Contacto pelo site — ${nome}`
            );

            const body = encodeURIComponent(
                `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
            );

            const destination = "contacto@armandusimperium.com";

            if (formStatus) {
                formStatus.textContent = "A preparar o seu email...";
            }

            window.location.href =
                `mailto:${destination}?subject=${subject}&body=${body}`;
        });
    }
});
