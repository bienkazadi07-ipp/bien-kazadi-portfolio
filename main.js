(function () {
  "use strict";

  /* ---------- Thème clair / sombre ---------- */
  var root = document.documentElement;
  var stored = localStorage.getItem("bk-theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", theme);

  function updateThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Activer le mode clair" : "Activer le mode sombre");
      btn.innerHTML = dark
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
    });
  }
  updateThemeButtons();

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("bk-theme", next);
    updateThemeButtons();
  });

  /* ---------- Menu mobile ---------- */
  document.addEventListener("click", function (e) {
    var burger = e.target.closest("[data-hamburger]");
    var menu = document.getElementById("mobile-menu");
    if (burger && menu) {
      var isOpen = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      return;
    }
    if (menu && menu.classList.contains("open") && e.target.closest("#mobile-menu a")) {
      menu.classList.remove("open");
      var b = document.querySelector("[data-hamburger]");
      if (b) b.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Marquage du lien actif ---------- */
  (function markActive() {
    var current = (document.body.getAttribute("data-page") || "").trim();
    if (!current) return;
    document.querySelectorAll("a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === current) {
        a.setAttribute("aria-current", "page");
      }
    });
  })();

  /* ---------- Barre de progression de lecture ---------- */
  var progressEl = document.getElementById("reading-progress");
  function updateProgress() {
    if (!progressEl) return;
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressEl.style.width = pct + "%";
  }
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- Bouton retour en haut ---------- */
  var backBtn = document.getElementById("back-to-top");
  function toggleBackBtn() {
    if (!backBtn) return;
    if (window.scrollY > 500) backBtn.classList.add("show");
    else backBtn.classList.remove("show");
  }
  document.addEventListener("scroll", toggleBackBtn, { passive: true });
  toggleBackBtn();
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Apparition discrète des sections ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Copier l'adresse e-mail ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-email]");
    if (!btn) return;
    var email = btn.getAttribute("data-copy-email");
    navigator.clipboard && navigator.clipboard.writeText(email).then(function () {
      var original = btn.textContent;
      btn.textContent = "Adresse E-mail copiée !";
      setTimeout(function () { btn.textContent = original; }, 2000);
    });
  });
  
  /* ---------- Copier le numéro tel ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-tel]");
    if (!btn) return;
    var email = btn.getAttribute("data-copy-tel");
    navigator.clipboard && navigator.clipboard.writeText(email).then(function () {
      var original = btn.textContent;
      btn.textContent = "Numéro téléphone copié !";
      setTimeout(function () { btn.textContent = original; }, 2000);
    });
  });

  /* ---------- Formulaire de contact (front-end uniquement) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      var honeypot = form.querySelector(".hp-field");
      if (honeypot && honeypot.value) {
        return; // soumission probablement automatisée : on l'ignore silencieusement
      }
      var name = form.querySelector("#name").value.trim();
      var email = form.querySelector("#email").value.trim();
      var message = form.querySelector("#message").value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.textContent = "Merci de vérifier les champs : nom, e-mail valide et message sont requis.";
        status.className = "form-status show err";
        return;
      }

      // Aucun serveur n'est connecté à ce formulaire pour le moment.
      // Relier ce point à un service d'envoi (Formspree, EmailJS, backend personnalisé, etc.)
      // pour que les messages soient réellement transmis.
      status.textContent = "Message prêt à être envoyé. Merci " + name + " ! (Formulaire non encore relié à un service d'envoi.)";
      status.className = "form-status show ok";
      form.reset();
    });
  }

  /* ---------- Rendu du portfolio ---------- */
  var projectGrid = document.getElementById("project-grid");
  if (projectGrid && window.SITE_DATA) {
    var projects = window.SITE_DATA.projects;
    var categories = ["Tous"].concat(Array.from(new Set(projects.map(function (p) { return p.category; }))));
    var filterRow = document.getElementById("project-filters");

    function renderProjects(filter) {
      projectGrid.innerHTML = projects
        .filter(function (p) { return filter === "Tous" || p.category === filter; })
        .map(function (p) {
          return (
            '<article class="card project-card reveal">' +
            '<span class="project-tag">' + p.category + '</span>' +
            '<h3>' + p.title + '</h3>' +
            '<p>' + p.description + '</p>' +
            '<dl class="project-fields">' +
            '<dt>Contexte</dt><dd>' + p.context + '</dd>' +
            '<dt>Rôle</dt><dd>' + p.role + '</dd>' +
            '<dt>Outils</dt><dd>' + p.tools + '</dd>' +
            '<dt>Résultats</dt><dd>' + p.results + '</dd>' +
            '</dl>' +
            (p.link ? '<div class="btn-row"><a class="btn btn-outline" href="' + p.link + '" target="_blank" rel="noopener">Voir le projet</a></div>' : '') +
            "</article>"
          );
        })
        .join("");
      reobserveReveals();
    }

    if (filterRow) {
      filterRow.innerHTML = categories
        .map(function (c, i) {
          return '<button class="filter-btn" data-filter="' + c + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' + c + "</button>";
        })
        .join("");
      filterRow.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filterRow.querySelectorAll(".filter-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        renderProjects(btn.getAttribute("data-filter"));
      });
    }
    renderProjects("Tous");
  }

  /* ---------- Rendu du blog (liste + recherche) ---------- */
  var blogGrid = document.getElementById("blog-grid");
  if (blogGrid && window.SITE_DATA) {
    var articles = window.SITE_DATA.articles;
    var searchInput = document.getElementById("blog-search");

    function articleCard(a) {
      return (
        '<article class="card blog-card reveal' + (a.featured ? " blog-featured" : "") + '">' +
        '<a class="card-link" href="blog/' + a.id + '.html">' +
        '<div class="blog-cover">Image de couverture — [' + a.category + ']</div>' +
        '<div class="blog-card-body">' +
        '<div class="blog-meta"><span>' + a.category + '</span><span>' + a.date + '</span><span>' + a.readingTime + '</span></div>' +
        "<h3>" + a.title + "</h3>" +
        "<p>" + a.excerpt + "</p>" +
        "</div></a></article>"
      );
    }

    function renderArticles(list) {
      blogGrid.innerHTML = list.length
        ? list.map(articleCard).join("")
        : '<p class="small">Aucun article ne correspond à votre recherche.</p>';
      reobserveReveals();
    }

    renderArticles(articles);

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        renderArticles(
          articles.filter(function (a) {
            return (a.title + " " + a.excerpt + " " + a.category).toLowerCase().indexOf(q) !== -1;
          })
        );
      });
    }
  }

  function reobserveReveals() {
    var els = document.querySelectorAll(".reveal:not(.in)");
    if ("IntersectionObserver" in window && els.length) {
      var io2 = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io2.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      els.forEach(function (el) { io2.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* ---------- Partage d'article ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-share]");
    if (!btn) return;
    var url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else {
      navigator.clipboard && navigator.clipboard.writeText(url).then(function () {
        var original = btn.textContent;
        btn.textContent = "Lien copié !";
        setTimeout(function () { btn.textContent = original; }, 2000);
      });
    }
  });
})();
