"use strict";
(() => {
  const { models, money, reduced } = BMW;
  const $id = (id) => document.getElementById(id);
  const grid = $id("modelGrid"),
    search = $id("modelSearch"),
    category = $id("categoryFilter"),
    sort = $id("sortModels");

  let initialRender = true;

  function renderModels() {
    const query = search.value.trim().toLowerCase();
    const list = models.filter(
      (m) =>
        `${m.name} ${m.category} ${m.description}`
          .toLowerCase()
          .includes(query) &&
        (category.value === "all" || m.category === category.value),
    );
    const order = {
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      power: (a, b) => b.power - a.power,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    list.sort(order[sort.value] || order.name);
    const fragment = document.createDocumentFragment();
    list.forEach((m) => fragment.append(BMW.card(m)));
    if (initialRender) {
      // Fill the grid synchronously so anchor positions are stable on first load.
      grid.replaceChildren(fragment);
      BMW.syncSaved();
      initialRender = false;
    } else {
      $(grid)
        .stop(true, true)
        .fadeTo(reduced ? 0 : 90, 0.3, () => {
          grid.replaceChildren(fragment);
          BMW.syncSaved();
          $(grid).fadeTo(reduced ? 0 : 180, 1);
        });
    }
    $id("collectionCount").textContent = `${list.length} MODELS`;
    $id("resultSummary").textContent =
      `Showing ${list.length} of ${models.length} models`;
    $id("emptyState").hidden = !!list.length;
  }
  search.addEventListener("input", renderModels);
  category.addEventListener("change", renderModels);
  sort.addEventListener("change", renderModels);
  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      search.value = "";
      renderModels();
    }
  });
  $id("resetFilters").addEventListener("click", () => {
    search.value = "";
    category.value = "all";
    sort.value = "name";
    renderModels();
    search.focus();
  });
  // Automatic comparison: one to three selected cars, no action buttons.
  const picker = $id("comparePicker"),
    result = $id("comparisonResult"),
    error = $id("compareError");
  models.forEach((m) => {
    const label = document.createElement("label");
    label.className = "compare-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = m.id;
    input.setAttribute("aria-label", `Compare ${m.name}`);
    input.setAttribute("aria-describedby", "compareError");
    const span = document.createElement("span");
    span.textContent = m.name;
    label.append(input, span);
    picker.append(label);
  });

  function renderComparison() {
    const ids = [...picker.querySelectorAll(":checked")].map((i) => i.value),
      selected = models.filter((m) => ids.includes(m.id));
    $id("compareCounter").textContent = `${selected.length} / 3 selected`;
    $id("compareHelp").textContent =
      selected.length === 1
        ? "Add another model to compare side by side. Uncheck to remove."
        : "Results update automatically. Uncheck a model to remove it.";
    result.hidden = !selected.length;
    if (!selected.length) {
      result.replaceChildren();
      return;
    }
    const rows = [
      ["Category", (m) => m.category],
      ["Starting price (example)", (m) => money(m.price)],
      ["Power (example)", (m) => `${m.power} hp`],
      ["0–100 km/h (example)", (m) => m.acceleration],
      ["Powertrain (example)", (m) => m.engine],
    ];
    const table = document.createElement("table");
    table.className = "table align-middle";
    const caption = document.createElement("caption");
    caption.className = "visually-hidden";
    caption.textContent = "Selected BMW models and example specifications";
    table.append(caption);
    const thead = document.createElement("thead"),
      head = document.createElement("tr");
    ["Specification", ...selected.map((m) => m.name)].forEach((text) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = text;
      head.append(th);
    });
    thead.append(head);
    table.append(thead);
    const body = document.createElement("tbody");
    rows.forEach(([label, value]) => {
      const tr = document.createElement("tr"),
        th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      tr.append(th);
      selected.forEach((m) => {
        const td = document.createElement("td");
        td.textContent = value(m);
        tr.append(td);
      });
      body.append(tr);
    });
    table.append(body);
    const mobile = document.createElement("div");
    mobile.className = "comparison-mobile";
    selected.forEach((m) => {
      const article = document.createElement("article");
      article.className = "comparison-mobile-card";
      const h = document.createElement("h3");
      h.textContent = m.name;
      const dl = document.createElement("dl");
      rows.forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "comparison-mobile-row";
        const dt = document.createElement("dt"),
          dd = document.createElement("dd");
        dt.textContent = label.replace(" (example)", "");
        dd.textContent = value(m);
        row.append(dt, dd);
        dl.append(row);
      });
      article.append(h, dl);
      mobile.append(article);
    });
    const note = document.createElement("p");
    note.className = "comparison-disclaimer";
    note.textContent =
      "Illustrative educational values. Actual specifications vary by model year, market and configuration.";
    result.replaceChildren(table, mobile, note);
  }
  picker.addEventListener("change", (e) => {
    if (!e.target.matches("input[type=checkbox]")) return;
    error.textContent = "";
    if (picker.querySelectorAll(":checked").length > 3) {
      e.target.checked = false;
      error.textContent =
        "You can compare up to 3 models. Unselect one before choosing another.";
      return;
    }
    renderComparison();
  });
  renderComparison();
  // Garage: only show paint variants for the selected model.
  const config = $id("configModel"),
    paint = $id("configColor"),
    pack = $id("configPackage"),
    interest = $id("interestModel");
  models.forEach((m) => {
    config.add(new Option(m.name, m.id));
    interest.add(new Option(m.name, m.id));
  });

  function populatePaints(preferred) {
    const m = models.find((m) => m.id === config.value) || models[0];
    paint.replaceChildren(
      ...m.colors.map((c) => new Option(`${c.name} (+${money(c.cost)})`, c.id)),
    );
    if (m.colors.some((c) => c.id === preferred)) paint.value = preferred;
    updateGarage();
  }

  function updateGarage() {
    const m = models.find((m) => m.id === config.value) || models[0],
      c = m.colors.find((c) => c.id === paint.value) || m.colors[0];
    BMW.setImage($id("previewImage"), c, m);
    $id("previewName").textContent = m.name;
    $id("previewSpec").textContent = `${m.power} hp · ${m.category} · example`;
    $id("previewColor").textContent = c.name;
    $id("colorSwatch").style.backgroundColor = c.hex;
    $id("configTotal").textContent = money(
      m.price + c.cost + Number(pack.value),
    );
    BMW.paints($id("paintSwatches"), m, c.id, (id) => {
      paint.value = id;
      updateGarage();

    });
  }
  // A deep link from Model Details selects the model (and optional paint/package)
  // directly in this Garage. No banner or second configurator is needed.
  const params = new URLSearchParams(location.search);
  const initial = models.find(m => m.id === params.get("model"));
  const requestedPaint = params.get("paint");
  const requestedPackage = params.get("package");
  function loadFromLink() {
    if (initial) config.value = initial.id;
    if (["0", "1800", "3200"].includes(String(requestedPackage))) pack.value = String(requestedPackage);
    populatePaints(requestedPaint);

  }
  config.addEventListener("change", () => populatePaints());
  paint.addEventListener("change", updateGarage);
  pack.addEventListener("change", updateGarage);
  loadFromLink();

  // Clicking Configure in THIS catalogue must immediately select THAT car.
  // Do not rely on an anchor with #garage: otherwise a generic smooth-scroll
  // handler can scroll without applying the requested model query parameter.
  grid.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-configure]");
    if (!link || !grid.contains(link) || event.defaultPrevented) return;
    // Keep native behavior for Ctrl/Cmd-click, Shift-click and other tabs.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const chosen = models.find((item) => item.id === link.dataset.configure);
    if (!chosen) return;
    event.preventDefault();
    event.stopPropagation();
    config.value = chosen.id;
    pack.value = "0";
    populatePaints(chosen.colors[0].id);

    // Preserve a shareable deep link and standard browser Back navigation.
    const url = new URL(link.href, location.href);
    history.pushState({ garageModel: chosen.id }, "", url.pathname + url.search + url.hash);
    $id("garage").scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  });

  // Handle Back/Forward after choosing a different card on the same page.
  window.addEventListener("popstate", () => {
    const query = new URLSearchParams(location.search);
    const model = models.find((m) => m.id === query.get("model"));
    if (model) {
      config.value = model.id;
      pack.value = ["0", "1800", "3200"].includes(query.get("package")) ? query.get("package") : "0";
      populatePaints(query.get("paint"));
    } else {
      config.value = models[0].id;
      pack.value = "0";
      populatePaints(models[0].colors[0].id);
    }
  });
  // Browsers may restore a previously chosen dropdown value from their Back/
  // Forward cache after scripts run. Re-apply the explicit model link then.
  window.addEventListener("pageshow", (event) => { if (event.persisted && initial) loadFromLink(); });
  if (location.hash === "#garage" && initial) {
    requestAnimationFrame(() => requestAnimationFrame(() => $id("garage").scrollIntoView({block:"start"})));
  }
  // Form validation and browser-only draft storage.
  const form = $id("inquiryForm"),
    success = $id("successMessage"),
    budget = $id("budget"),
    country = $id("countryCode"),
    customCode = $id("customCode");
  const required = [
    "fullname",
    "email",
    "countryCode",
    "phone",
    "interestModel",
    "budget",
  ];
  const draftFields = [...required, "customCode", "message"];
  const touched = new Set();
  const storageKey = "bmwConversationDraft";

  function hideSuccess() {
    $(success).stop(true, true).hide();
    success.hidden = true;
  }

  function budgetHint() {
    const m = models.find((m) => m.id === interest.value);
    $id("budgetHint").textContent = m
      ? `Minimum for the ${m.name}: ${money(m.price)}. Maximum demo budget: $300,000.`
      : "Choose a model to see its minimum starting budget.";
    budget.placeholder = m
      ? `At least ${money(m.price)}`
      : "Choose a model first";
  }

  function countryFields() {
    $id("customCodeWrap").hidden = country.value !== "other";
    customCode.required = country.value === "other";
  }

  function validate(id) {
    const value = $id(id).value.trim();
    let message = "";
    const model = models.find((m) => m.id === interest.value);
    if (id === "fullname") {
      const letters = value.match(/\p{L}/gu) || [];
      if (letters.length < 2 || !/^\p{L}[\p{L}\p{M}\s’'\-]*$/u.test(value))
        message =
          "Use at least 2 letters. Numbers and other symbols are not allowed.";
    }
    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
      message = "Enter a valid email address, such as name@example.com.";
    if (id === "countryCode") {
      if (!value) message = "Select your country calling code.";
      else if (
        value === "other" &&
        !/^\+[1-9]\d{0,2}$/.test(customCode.value.trim())
      )
        message =
          "Enter a calling code starting with + and 1–3 digits, such as +81.";
    }
    if (id === "phone") {
      const digits = value.replace(/[\s()-]/g, "");
      const code = country.value === "other" ? customCode.value : country.value;
      if (
        !/^[0-9\s()-]+$/.test(value) ||
        digits.length < 6 ||
        digits.length > 14
      )
        message =
          "Use digits only, with optional spaces or brackets. Enter 6–14 digits without the country code.";
      else if (["+7", "+1"].includes(code) && digits.length !== 10)
        message = "This calling code requires a 10-digit national number.";
      else if (code === "+93" && digits.length !== 9)
        message = "For +93, enter 9 digits without the leading 0.";
      else if (
        code &&
        code !== "other" &&
        code.replace(/\D/g, "").length + digits.length > 15
      )
        message = "The full international number must not exceed 15 digits.";
    }
    if (id === "interestModel" && !model) message = "Choose a BMW model.";
    if (id === "budget") {
      if (!model) message = "Choose your model of interest first.";
      else if (
        !/^\d+(\.\d{1,2})?$/.test(value) ||
        !Number.isFinite(Number(value))
      )
        message =
          "Enter a numeric amount in USD, without letters or currency symbols.";
      else if (Number(value) < model.price)
        message = `For the ${model.name}, enter at least ${money(model.price)}.`;
      else if (Number(value) > 300000)
        message = "The maximum demo budget is $300,000.";
    }
    const field = $id(id);
    $id(id + "Error").textContent = message;
    field.classList.toggle("is-invalid", !!message);
    field.classList.toggle("is-valid", !message);
    field.setAttribute("aria-invalid", String(!!message));
    if (id === "countryCode") {
      customCode.classList.toggle(
        "is-invalid",
        !!message && country.value === "other",
      );
      customCode.setAttribute(
        "aria-invalid",
        String(!!message && country.value === "other"),
      );
    }
    return !message;
  }
  // Prevent typing/pasting letters into phone and budget inputs; validation also checks restored values.
  function restrict(field, allowed, message) {
    field.addEventListener("beforeinput", (e) => {
      if (e.isComposing || !e.data || e.inputType?.startsWith("delete")) return;
      if (!allowed.test(e.data)) {
        e.preventDefault();
        hideSuccess();
        touched.add(field.id);
        $id(field.id + "Error").textContent = message;
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
      }
    });
    field.addEventListener("paste", (e) => {
      const text = e.clipboardData.getData("text");
      if (!allowed.test(text)) {
        e.preventDefault();
        hideSuccess();
        touched.add(field.id);
        $id(field.id + "Error").textContent = message;
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
      }
    });
  }
  restrict(
    $id("phone"),
    /^[0-9\s()-]+$/,
    "Phone numbers cannot contain letters. Use the country-code selector above.",
  );
  restrict(
    budget,
    /^[0-9.]+$/,
    "Enter a numeric USD amount without letters or currency symbols.",
  );
  required.forEach((id) => {
    $id(id).addEventListener("blur", () => {
      touched.add(id);
      validate(id);
    });
    $id(id).addEventListener("input", () => {
      if (touched.has(id)) validate(id);
    });
    $id(id).addEventListener("change", () => {
      touched.add(id);
      validate(id);
    });
  });
  country.addEventListener("change", () => {
    countryFields();
    if (touched.has("phone")) validate("phone");
  });
  customCode.addEventListener("input", () => {
    touched.add("countryCode");
    validate("countryCode");
    if (touched.has("phone")) validate("phone");
  });
  interest.addEventListener("change", () => {
    budgetHint();
    if (touched.has("budget") || budget.value) validate("budget");
  });

  function saveDraft() {
    const data = {};
    draftFields.forEach((id) => (data[id] = $id(id).value));
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (_) {
      BMW.notify("Browser storage is unavailable; this draft cannot be saved.");
    }
  }
  form.addEventListener("input", () => {
    hideSuccess();
    saveDraft();
  });
  form.addEventListener("change", () => {
    hideSuccess();
    saveDraft();
  });

  function clearState() {
    touched.clear();
    required.forEach((id) => {
      $id(id).classList.remove("is-valid", "is-invalid");
      $id(id).setAttribute("aria-invalid", "false");
      $id(id + "Error").textContent = "";
    });
    customCode.classList.remove("is-invalid");
    customCode.setAttribute("aria-invalid", "false");
    budgetHint();
    countryFields();
  }
  form.addEventListener("reset", () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (_) {}
    setTimeout(clearState, 0);
  });
  $id("clearDraft").addEventListener("click", () => {
    form.reset();
    hideSuccess();
    $id("fullname").focus();
    BMW.notify("Your form draft has been cleared.");
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideSuccess();
    required.forEach((id) => touched.add(id));
    if (!required.map(validate).every(Boolean)) {
      form.querySelector(".is-invalid").focus();
      return;
    }
    form.reset();
    clearState();
    success.hidden = false;
    $(success)
      .stop(true, true)
      .hide()
      .slideDown(reduced ? 0 : 220);
  });
  try {
    const draft = JSON.parse(localStorage.getItem(storageKey));
    if (draft && typeof draft === "object" && !Array.isArray(draft))
      draftFields.forEach((id) => {
        if (typeof draft[id] === "string") $id(id).value = draft[id];
      });
  } catch (_) {}
  if (initial) interest.value = initial.id;
  budgetHint();
  countryFields();
  $id("buildRequest").addEventListener("click", () => {
    interest.value = config.value;
    budget.value = String(
      models.find((m) => m.id === config.value).price +
        models
          .find((m) => m.id === config.value)
          .colors.find((c) => c.id === paint.value).cost +
        Number(pack.value),
    );
    budgetHint();
    hideSuccess();
    if (touched.has("budget")) validate("budget");
    if (touched.has("interestModel")) validate("interestModel");
    saveDraft();
  });
  renderModels();
})();
