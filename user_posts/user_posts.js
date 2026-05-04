const mockPosts = [
    {
        id: 1,
        hasRequests: true,
        requests: [
            { name: "Alex", timestamp: "2026-05-03 12:14" },
            { name: "Maria", timestamp: "2026-05-03 13:02" }
        ]
    },
    {
        id: 2,
        hasRequests: false,
        requests: []
    }
];

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------
       THEME + LANGUAGE
    ------------------------------ */

    const themeInputs = document.querySelectorAll('input[name="theme"]');
    const languageInputs = document.querySelectorAll('input[name="language"]');
    const languageLabel = document.getElementById('language-label');

    const dictionary = {
        en: {
            chooseTheme: "Choose Theme",
            dark: "Dark",
            light: "Light",
            pageTitle: "Your Meal Posts",
            pageSubtitle: "Manage your listings",
            activePosts: "Active Listings",
            expiredPosts: "Expired / Closed Posts",
            viewDetails: "View Details"
        },
        gr: {
            chooseTheme: "Επιλογή Θέματος",
            dark: "Σκούρο",
            light: "Ανοιχτό",
            pageTitle: "Οι Αγγελίες Φαγητού σου",
            pageSubtitle: "Διαχείριση των αγγελιών σου",
            activePosts: "Ενεργές Αγγελίες",
            expiredPosts: "Ληγμένες / Κλειστές Αγγελίες",
            viewDetails: "Λεπτομέρειες"
        }
    };

    function setTheme(theme) {
        document.body.classList.remove("theme-dark", "theme-light");
        document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
        localStorage.setItem("unibites-theme", theme);
    }

    function setLanguage(lang) {
        const selected = dictionary[lang] || dictionary.en;

        if (languageLabel) {
            languageLabel.textContent = lang === "gr" ? "ΕΛΛ" : "ENG";
        }

        document.documentElement.lang = lang === "gr" ? "el" : "en";

        /* PAGE HEADER */
        const h1 = document.querySelector(".page-heading h1");
        const subtitle = document.querySelector(".page-heading p");

        if (h1) h1.textContent = selected.pageTitle;
        if (subtitle) subtitle.textContent = selected.pageSubtitle;

        /* SECTION TITLES */
        const activeTitle = document.querySelector(".section-title span");
        const expiredTitle = document.querySelector(".section-title-collapsible span");

        if (activeTitle) activeTitle.textContent = selected.activePosts;
        if (expiredTitle) expiredTitle.textContent = selected.expiredPosts;

        /* BUTTONS */
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.textContent = selected.viewDetails;
        });

        localStorage.setItem("unibites-language", lang);
    }

    /* -----------------------------
       EVENTS
    ------------------------------ */

    themeInputs.forEach(input => {
        input.addEventListener("change", () => setTheme(input.value));
    });

    languageInputs.forEach(input => {
        input.addEventListener("change", () => setLanguage(input.value));
    });

    /* -----------------------------
       LOAD SAVED SETTINGS
    ------------------------------ */

    const savedTheme = localStorage.getItem("unibites-theme") || "light";
    const savedLanguage = localStorage.getItem("unibites-language") || "en";

    const themeInput = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    const langInput = document.querySelector(`input[name="language"][value="${savedLanguage}"]`);

    if (themeInput) themeInput.checked = true;
    if (langInput) langInput.checked = true;

    setTheme(savedTheme);
    setLanguage(savedLanguage);

    /* -----------------------------
       COLLAPSIBLE (EXPIRED POSTS)
    ------------------------------ */

    document.querySelectorAll(".section-title-collapsible").forEach(header => {
        header.addEventListener("click", () => {
            const section = header.closest(".posts-section");
            const list = section.querySelector(".post-list");

            if (!list) return;

            const isCollapsed = header.classList.toggle("collapsed");
            list.classList.toggle("hidden");

            header.setAttribute("aria-expanded", !isCollapsed);
        });
    });

    // 3 DOT MENU CLICK BEHAVIOR
    document.querySelectorAll(".menu-trigger").forEach(button => {
        button.addEventListener("click", (e) => {

            e.stopPropagation();
            const dropdown = button.nextElementSibling;
            // close all other dropdowns first
            document.querySelectorAll(".menu-dropdown").forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove("active");
                }
            });
            // toggle current one
            dropdown.classList.toggle("active");
        });
    });

    // close when clicking outside
    document.addEventListener("click", () => {
        document.querySelectorAll(".menu-dropdown").forEach(menu => {
            menu.classList.remove("active");
        });
    });
    
    const modal = document.getElementById("requestsModal");
    const requestsList = document.querySelector(".requests-list");
    const closeBtn = document.querySelector(".close-modal");
    const overlay = document.querySelector(".modal-overlay");

    /* SAFETY CHECK */
    if (!modal || !requestsList || !closeBtn || !overlay) {
        console.error("Modal elements missing from HTML");
    }

    /* OPEN MODAL */
    function openRequestsModal(requests) {
        if (!modal) return;

        requestsList.innerHTML = "";

        requests.forEach(req => {
            const item = document.createElement("div");
            item.classList.add("request-item");

            item.innerHTML = `
                <div class="request-info">
                    <strong>${req.name}</strong>
                    <p class="request-time">${req.timestamp}</p>
                </div>

                <div class="request-actions">
                    <button class="request-btn accept" title="Accept">✓</button>
                    <button class="request-btn decline" title="Decline">✕</button>
                </div>
            `;

            requestsList.appendChild(item);
        });

        modal.classList.remove("hidden");
    }

    /* CLOSE MODAL */
    function closeModal() {
        if (!modal) return;
        modal.classList.add("hidden");
    }

    /* EVENTS */
    closeBtn?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);

    /* REQUEST BARS */
    document.querySelectorAll(".post-card").forEach((card, index) => {

        const post = mockPosts?.[index];
        const statusBar = card.querySelector(".post-status-bar");

        if (!post || !statusBar) return;

        if (post.hasRequests && post.requests?.length) {

            statusBar.textContent = `${post.requests.length} new requests!`;
            statusBar.classList.add("yes-requests");

            statusBar.addEventListener("click", (e) => {
                e.stopPropagation();
                openRequestsModal(post.requests);
            });

        } else {
            statusBar.textContent = "No new requests";
            statusBar.classList.add("no-requests");
        }
    });
});