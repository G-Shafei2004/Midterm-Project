"use strict";
window.BMW = (() => {
  const models = window.BMW_MODELS;
  const money = (n) => "$" + Number(n).toLocaleString("en-US");
  let volatileSaved = [];

  function notify(message) {
    const node = document.getElementById("siteStatus");
    if (!node) return;
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => node.classList.remove("visible"), 4200);
  }

  function saved() {
    try {
      const data = JSON.parse(localStorage.getItem("bmwSavedCars"));
      if (Array.isArray(data))
        return [...new Set(data)].filter((id) =>
          models.some((m) => m.id === id),
        );
    } catch (_) {}
    return volatileSaved;
  }

  function writeSaved(ids) {
    volatileSaved = ids;
    try {
      localStorage.setItem("bmwSavedCars", JSON.stringify(ids));
    } catch (_) {
      notify(
        "Browser storage is unavailable. These choices will last for this page only.",
      );
    }
    syncSaved();
    document.dispatchEvent(new Event("bmw:saved"));
  }

  function syncSaved() {
    const ids = saved();
    document
      .querySelectorAll(".saved-count")
      .forEach((el) => (el.textContent = ids.length));
    document.querySelectorAll("[data-save]").forEach((btn) => {
      const on = ids.includes(btn.dataset.save);
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "♥ Saved" : "♡ Save";
      const model = models.find((m) => m.id === btn.dataset.save);
      btn.setAttribute(
        "aria-label",
        `${on ? "Remove" : "Save"} ${model?.name || "car"}${on ? " from saved cars" : ""}`,
      );
    });
  }

  function toggleSaved(id) {
    const ids = saved();
    const on = ids.includes(id);
    writeSaved(on ? ids.filter((v) => v !== id) : [...ids, id]);
    notify(
      on
        ? "Car removed from your saved collection."
        : "Car saved. Find it on the Saved cars page.",
    );
  }

  function card(m, remove = false) {
    const el = document.createElement("div");
    el.className = "col-12 col-md-6 col-lg-4";
    el.innerHTML = `<article class="model-card"><a class="model-image-link" href="model.html?id=${m.id}" aria-label="Explore BMW ${m.name}"><img src="${m.image}" alt="${m.imageAlt}" width="1200" height="675" loading="lazy"><span class="model-details-hint" aria-hidden="true">◈ EXPLORE MODEL DETAILS</span></a><div class="model-card-body"><div class="model-card-top"><span class="model-category">${m.category}</span><span class="model-power">${m.power} hp · example</span></div><h3><a href="model.html?id=${m.id}">${m.name}</a></h3><p>${m.description}</p><div class="model-card-bottom"><span><small>Example starting price</small><strong>${money(m.price)}</strong></span><button type="button" class="save-button" data-save="${m.id}" aria-pressed="false">♡ Save</button></div><div class="card-actions"><a class="text-link" href="model.html?id=${m.id}">View details →</a><a class="text-link" data-configure="${m.id}" href="models.html?model=${m.id}#garage" aria-label="Configure BMW ${m.name} in the interactive Garage">Configure →</a>${remove ? `<button class="remove-car" type="button" data-remove="${m.id}" aria-label="Remove ${m.name}">Remove</button>` : ""}</div></div></article>`;
    return el;
  }

  function setImage(img, color, model) {
    img.src = color.image;
    img.alt = `BMW ${model.name} in ${color.name}`;
  }

  function paints(node, model, selected, onChange) {
    const hadFocus = node.contains(document.activeElement);
    node.replaceChildren();
    model.colors.forEach((c) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "paint-chip";
      button.style.setProperty("--paint", c.hex);
      button.setAttribute("aria-label", c.name);
      button.setAttribute("aria-pressed", String(c.id === selected));
      button.title = c.name;
      button.addEventListener("click", () => onChange(c.id));
      node.append(button);
    });
    if (hadFocus) node.querySelector('[aria-pressed="true"]')?.focus();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-save]");
    if (b) toggleSaved(b.dataset.save);
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "bmwSavedCars" || e.key === null) {
      syncSaved();
      document.dispatchEvent(new Event("bmw:saved"));
    }
    if (e.key === "bmwTheme") {
      try {
        const t = JSON.parse(e.newValue);
        if (["light", "dark"].includes(t)) {
          document.documentElement.dataset.theme = t;
          document.documentElement.dataset.bsTheme = t;
          updateTheme();
        }
      } catch (_) {}
    }
  });

  function updateTheme() {
    const btn = document.getElementById("themeToggle");
    const dark = document.documentElement.dataset.theme === "dark";
    btn.textContent = dark ? "☀ Light mode" : "☾ Dark mode";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
  }
  updateTheme();
  document.getElementById("themeToggle").addEventListener("click", () => {
    const t =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    document.documentElement.dataset.bsTheme = t;
    try {
      localStorage.setItem("bmwTheme", JSON.stringify(t));
    } catch (_) {
      notify(
        "Theme changed. Browser storage is unavailable, so it may not persist.",
      );
    }
    updateTheme();
  });
  const page = location.pathname.split("/").pop() || "index.html";
  const home = page === "index.html";
  const faq = document.getElementById("faq");

  function activeNav() {
    const navHeight = document
      .querySelector(".site-navbar")
      .getBoundingClientRect().height;
    const rect = faq?.getBoundingClientRect();
    const atFaq =
      home &&
      rect &&
      (rect.top < navHeight + 130 ||
        innerHeight + scrollY >= document.documentElement.scrollHeight - 4) &&
      rect.bottom > navHeight;
    const key = atFaq
      ? "faq"
      : home
        ? "home"
        : page === "innovation.html"
          ? "innovation"
          : page === "saved.html"
            ? "saved"
            : ["models.html", "model.html"].includes(page)
              ? "models"
              : "";
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const active = a.dataset.nav === key;
      a.classList.toggle("active", active);
      a.removeAttribute("aria-current");
      if (active) a.setAttribute("aria-current", atFaq ? "location" : "page");
    });
  }
  let pending = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          activeNav();
          pending = false;
        });
      }
    },
    {
      passive: true,
    },
  );
  window.addEventListener("resize", activeNav);
  window.addEventListener("hashchange", activeNav);
  activeNav();
  document.querySelectorAll(".site-navbar a").forEach((a) =>
    a.addEventListener("click", () => {
      const collapse = document.getElementById("mainNav");
      if (window.bootstrap && collapse.classList.contains("show"))
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }),
  );
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $(".faq-question").each(function (i) {
    const answer = $(this).next(".faq-answer");
    answer.attr("id", `faq-answer-${i}`);
    $(this).attr("aria-controls", `faq-answer-${i}`);
  });
  $(".faq-question").on("click", function () {
    const $button = $(this),
      $answer = $button.next(".faq-answer"),
      open = $button.attr("aria-expanded") === "true";
    $(".faq-question")
      .not($button)
      .attr("aria-expanded", "false")
      .find("span")
      .text("+");
    $(".faq-answer")
      .not($answer)
      .stop(true, true)
      .slideUp(reduced ? 0 : 180, function () {
        this.hidden = true;
      });
    if (open) {
      $button.attr("aria-expanded", "false").find("span").text("+");
      $answer.stop(true, true).slideUp(reduced ? 0 : 180, function () {
        this.hidden = true;
      });
    } else {
      $button.attr("aria-expanded", "true").find("span").text("−");
      $answer
        .stop(true, true)
        .prop("hidden", false)
        .hide()
        .slideDown(reduced ? 0 : 220);
    }
  });
  $(document).on("click", 'a[href*="#"]', function (e) {
    const url = new URL(this.href, location.href);
    // A catalogue Configure link may point to THIS page but with a different
    // model in its query string. Let the browser navigate in that case so
    // models.js can initialize the correct car/paint/package. Only smooth-scroll
    // links whose full page address (pathname + query) is unchanged.
    if (
      url.origin !== location.origin ||
      url.pathname !== location.pathname ||
      url.search !== location.search ||
      !url.hash
    ) return;
    const target = document.getElementById(
      decodeURIComponent(url.hash.slice(1)),
    );
    if (!target) return;
    e.preventDefault();
    const offset = document.querySelector(".site-navbar").offsetHeight + 18;
    $("html,body")
      .stop(true)
      .animate(
        {
          scrollTop: Math.max(
            0,
            target.getBoundingClientRect().top + scrollY - offset,
          ),
        },
        reduced ? 0 : 300,
      );
    // Keep the selected build query string when scrolling within the Garage.
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  });
  $(document)
    .on("mouseenter", ".model-card,.feature-card", function () {
      $(this).addClass("is-hovered");
    })
    .on("mouseleave", ".model-card,.feature-card", function () {
      $(this).removeClass("is-hovered");
    });
  const video = document.querySelector(".hero-video"),
    videoButton = document.getElementById("videoToggle");
  if (video && videoButton) {
    videoButton.addEventListener("click", async () => {
      if (video.paused) {
        try {
          await video.play();
          videoButton.textContent = "Pause background video";
          videoButton.setAttribute("aria-pressed", "true");
        } catch (_) {
          notify("The video could not play. Please try again.");
        }
      } else {
        video.pause();
        videoButton.textContent = "Play background video";
        videoButton.setAttribute("aria-pressed", "false");
      }
    });
  }
  syncSaved();
  return {
    models,
    money,
    saved,
    writeSaved,
    syncSaved,
    toggleSaved,
    card,
    setImage,
    paints,
    notify,
    reduced,
  };
})();
