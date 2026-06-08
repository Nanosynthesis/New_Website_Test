(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === path || (path === "index.html" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const cleanTitle = (title) => title.replace(/[“”]/g, "").trim();

  const formatPublicationMeta = (pub) => {
    const bits = [pub.journal, pub.year, pub.pages].filter(Boolean);
    return bits.join(" · ");
  };

  const renderHomePublications = () => {
    const target = document.getElementById("homePublications");
    if (!target || !window.LAB_PUBLICATIONS) return;
    const featured = window.LAB_PUBLICATIONS.slice(0, 3);
    target.innerHTML = featured.map((pub) => `
      <article class="publication-feature">
        ${pub.image ? `<img src="${pub.image}" alt="${cleanTitle(pub.title)}">` : ""}
        <div>
          <span class="pub-meta">${formatPublicationMeta(pub)}</span>
          <h3>${cleanTitle(pub.title)}</h3>
          <p>${pub.authors}</p>
          ${pub.link ? `<a class="text-link" href="${pub.link}" target="_blank" rel="noreferrer">Read paper</a>` : ""}
        </div>
      </article>
    `).join("");
  };

  const renderPeople = () => {
    const grid = document.getElementById("peopleGrid");
    if (!grid || !window.LAB_PEOPLE) return;
    grid.innerHTML = window.LAB_PEOPLE.map((person) => `
      <article class="people-card">
        <img src="${person.image}" alt="${person.name}">
        <div>
          <h3>${person.name}</h3>
          <p>${person.roleEn}</p>
          <small>${person.roleCn}</small>
        </div>
      </article>
    `).join("");
  };

  const renderPublications = () => {
    const list = document.getElementById("publicationList");
    const count = document.getElementById("publicationCount");
    const search = document.getElementById("publicationSearch");
    const filters = document.getElementById("yearFilters");
    if (!list || !count || !search || !filters || !window.LAB_PUBLICATIONS) return;

    let activeYear = "all";
    const years = [...new Set(window.LAB_PUBLICATIONS.map((pub) => pub.year).filter(Boolean))].slice(0, 10);
    filters.innerHTML = [
      `<button class="filter-button is-active" type="button" data-year="all">All</button>`,
      ...years.map((year) => `<button class="filter-button" type="button" data-year="${year}">${year}</button>`)
    ].join("");

    const update = () => {
      const query = search.value.trim().toLowerCase();
      const results = window.LAB_PUBLICATIONS.filter((pub) => {
        const haystack = `${pub.title} ${pub.authors} ${pub.journal} ${pub.year}`.toLowerCase();
        const yearMatches = activeYear === "all" || pub.year === activeYear;
        return yearMatches && (!query || haystack.includes(query));
      });

      count.textContent = `${results.length} publications shown`;
      list.innerHTML = results.map((pub) => `
        <article class="publication-item ${pub.image ? "has-image" : "no-image"}">
          ${pub.image ? `
            <figure class="publication-thumb">
              <img src="${pub.image}" alt="Figure for publication #${pub.number}" loading="lazy">
            </figure>
          ` : ""}
          <div class="publication-body">
            <span class="publication-number">#${pub.number}</span>
            <h2>${cleanTitle(pub.title)}</h2>
            <p>${pub.authors}</p>
            <p><strong>${formatPublicationMeta(pub)}</strong></p>
            ${pub.link ? `<a class="text-link" href="${pub.link}" target="_blank" rel="noreferrer">DOI / Link</a>` : ""}
          </div>
        </article>
      `).join("");
    };

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-year]");
      if (!button) return;
      activeYear = button.dataset.year;
      filters.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      update();
    });

    search.addEventListener("input", update);
    update();
  };

  renderHomePublications();
  renderPeople();
  renderPublications();
})();
