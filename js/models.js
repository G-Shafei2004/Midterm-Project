// BMW model data used by the catalogue, comparison and garage.
const bmwModels = [
  {
    id: "3-series",
    name: "3 Series",
    category: "Sedan",
    price: 45000,
    power: 255,
    acceleration: "5.8 s",
    engine: "2.0L Turbo Inline-4",
    image: "images/model-3series.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "A balanced sports sedan for everyday driving."
  },
  {
    id: "5-series",
    name: "5 Series",
    category: "Sedan",
    price: 58000,
    power: 255,
    acceleration: "6.0 s",
    engine: "2.0L Turbo Inline-4",
    image: "images/model-3series.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "Executive comfort with a confident, modern character."
  },
  {
    id: "7-series",
    name: "7 Series",
    category: "Sedan",
    price: 97000,
    power: 375,
    acceleration: "5.4 s",
    engine: "3.0L Turbo Inline-6",
    image: "images/model-3series.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "A flagship sedan focused on space and refinement."
  },
  {
    id: "x3",
    name: "X3",
    category: "SUV",
    price: 47000,
    power: 248,
    acceleration: "6.0 s",
    engine: "2.0L Turbo Inline-4",
    image: "images/model-x5.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "A versatile SUV with everyday practicality."
  },
  {
    id: "x5",
    name: "X5",
    category: "SUV",
    price: 65000,
    power: 375,
    acceleration: "5.3 s",
    engine: "3.0L Turbo Inline-6",
    image: "images/model-x5.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "A spacious SUV combining comfort and capability."
  },
  {
    id: "x7",
    name: "X7",
    category: "SUV",
    price: 82000,
    power: 375,
    acceleration: "5.8 s",
    engine: "3.0L Turbo Inline-6",
    image: "images/model-x5.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "A large luxury SUV with three-row versatility."
  },
  {
    id: "m3",
    name: "M3 Competition",
    category: "Performance",
    price: 78000,
    power: 503,
    acceleration: "3.8 s",
    engine: "3.0L Twin-Turbo Inline-6",
    image: "images/model-m3.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "High-performance engineering with a track-inspired edge."
  },
  {
    id: "i4",
    name: "i4",
    category: "Electric",
    price: 53000,
    power: 335,
    acceleration: "5.7 s",
    engine: "Fully electric",
    image: "images/model-3series.jpg",
    imageAlt: "Representative BMW vehicle photograph; exact model shown may differ",
    description: "An all-electric Gran Coupé with instant response."
  }
];

const money = (amount) => "$" + amount.toLocaleString("en-US");

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("modelGrid");
  if (!grid) return;

  const searchInput = document.getElementById("modelSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortModels");
  const emptyState = document.getElementById("emptyState");
  const resultSummary = document.getElementById("resultSummary");
  const collectionCount = document.getElementById("collectionCount");

  // Search, filter, sort and display model cards.
  function renderModels() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const visibleModels = bmwModels.filter((model) => {
      const searchableText =
        `${model.name} ${model.category} ${model.description}`.toLowerCase();

      const matchesText = searchableText.includes(query);
      const matchesCategory =
        category === "all" || model.category === category;

      return matchesText && matchesCategory;
    });

    if (sortSelect.value === "price-low") {
      visibleModels.sort((a, b) => a.price - b.price);
    }

    if (sortSelect.value === "price-high") {
      visibleModels.sort((a, b) => b.price - a.price);
    }

    if (sortSelect.value === "power") {
      visibleModels.sort((a, b) => b.power - a.power);
    }

    if (sortSelect.value === "name") {
      visibleModels.sort((a, b) => a.name.localeCompare(b.name));
    }

    const fragment = document.createDocumentFragment();

    visibleModels.forEach((model) => {
      const column = document.createElement("div");
      column.className = "col-12 col-md-6 col-lg-4";

      const card = document.createElement("article");
      card.className = "model-card";

      card.innerHTML = `
        <img
          src="${model.image}"
          alt="${model.imageAlt} for the ${model.name} listing"
          loading="lazy"
        >
        <div class="model-card-body">
          <div class="model-card-top">
            <span class="model-category">${model.category}</span>
            <span class="model-power">${model.power} hp</span>
          </div>
          <h3>${model.name}</h3>
          <p>${model.description}</p>
          <div class="model-card-bottom">
            <strong>${money(model.price)}</strong>
            <button
              class="text-link choose-model"
              type="button"
              data-model="${model.id}"
            >
              Configure →
            </button>
          </div>
        </div>
      `;

      column.appendChild(card);
      fragment.appendChild(column);
    });

    // Fade between catalogue results.
    $(grid).stop(true, true).fadeTo(100, 0.25, function () {
      grid.replaceChildren(fragment);
      $(grid).fadeTo(180, 1);

      $(".model-card").hover(
        function () {
          $(this).addClass("is-hovered");
        },
        function () {
          $(this).removeClass("is-hovered");
        }
      );
    });

    const count = visibleModels.length;
    collectionCount.textContent = `${count} MODEL${count === 1 ? "" : "S"}`;
    resultSummary.textContent =
      `Showing ${count} of ${bmwModels.length} models`;
    emptyState.hidden = count !== 0;
  }

  searchInput.addEventListener("input", renderModels);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      renderModels();
    }
  });

  categoryFilter.addEventListener("change", renderModels);
  sortSelect.addEventListener("change", renderModels);

  document.getElementById("resetFilters").addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    sortSelect.value = "name";
    renderModels();
  });

  // Fill the garage and form model selectors.
  const configModel = document.getElementById("configModel");
  const interestModel = document.getElementById("interestModel");

  bmwModels.forEach((model) => {
    configModel.add(new Option(model.name, model.id));
    interestModel.add(new Option(model.name, model.id));
  });

  // Model comparison.
  const comparePicker = document.getElementById("comparePicker");
  const compareButton = document.getElementById("compareButton");
  const compareCounter = document.getElementById("compareCounter");
  const comparisonResult = document.getElementById("comparisonResult");

  const compareError = document.createElement("p");
  compareError.id = "compareError";
  compareError.className = "text-danger mt-2";
  compareError.setAttribute("role", "alert");
  comparePicker.insertAdjacentElement("afterend", compareError);

  bmwModels.forEach((model) => {
    const label = document.createElement("label");
    label.className = "compare-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = model.id;
    checkbox.setAttribute("aria-label", `Compare ${model.name}`);
    checkbox.setAttribute("aria-describedby", "compareError");

    const name = document.createElement("span");
    name.textContent = model.name;

    label.append(checkbox, name);
    comparePicker.appendChild(label);
  });

  function updateCompareSelection() {
    const checked = comparePicker.querySelectorAll("input:checked");

    compareCounter.textContent = `${checked.length} / 3 selected`;
    compareButton.disabled = checked.length < 2 || checked.length > 3;

    // Keep boxes clickable to explain attempted fourth selections.
    comparePicker.querySelectorAll("input").forEach((input) => {
      input.disabled = false;
    });

    compareError.textContent = "";
  }

  comparePicker.addEventListener("change", (event) => {
    const checkbox = event.target;

    if (!checkbox.matches('input[type="checkbox"]')) return;

    const selectedCount =
      comparePicker.querySelectorAll("input:checked").length;

    if (selectedCount > 3) {
      checkbox.checked = false;
      updateCompareSelection();

      compareError.textContent =
        "You can compare up to 3 models. Unselect one before choosing another.";
      return;
    }

    updateCompareSelection();
  });

  document.getElementById("clearCompare").addEventListener("click", () => {
    comparePicker.querySelectorAll("input").forEach((input) => {
      input.checked = false;
      input.disabled = false;
    });

    comparisonResult.hidden = true;
    comparisonResult.replaceChildren();
    updateCompareSelection();
  });

  compareButton.addEventListener("click", () => {
    const selectedIds = [
      ...comparePicker.querySelectorAll("input:checked")
    ].map((input) => input.value);

    if (selectedIds.length < 2 || selectedIds.length > 3) {
      compareError.textContent = "Please select two or three models.";
      return;
    }

    compareError.textContent = "";

    const selectedModels = bmwModels.filter((model) =>
      selectedIds.includes(model.id)
    );

    const rows = [
      ["Category", (model) => model.category],
      ["Starting price (example)", (model) => money(model.price)],
      ["Power (example)", (model) => `${model.power} hp`],
      ["0–100 km/h (example)", (model) => model.acceleration],
      ["Powertrain (example)", (model) => model.engine]
    ];

    // Desktop and tablet comparison table.
    const table = document.createElement("table");
    table.className = "table align-middle";

    const thead = document.createElement("thead");
    const header = document.createElement("tr");

    [
      "Specification",
      ...selectedModels.map((model) => model.name)
    ].forEach((label) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = label;
      header.appendChild(th);
    });

    thead.appendChild(header);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    rows.forEach(([label, getValue]) => {
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      tr.appendChild(th);

      selectedModels.forEach((model) => {
        const td = document.createElement("td");
        td.textContent = getValue(model);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Stacked comparison cards for phones.
    const mobileCards = document.createElement("div");
    mobileCards.className = "comparison-mobile";

    selectedModels.forEach((model) => {
      const card = document.createElement("article");
      card.className = "comparison-mobile-card";

      const heading = document.createElement("h3");
      heading.textContent = model.name;

      const details = document.createElement("dl");

      rows.forEach(([label, getValue]) => {
        const row = document.createElement("div");
        row.className = "comparison-mobile-row";

        const term = document.createElement("dt");
        term.textContent = label.replace(" (example)", "");

        const value = document.createElement("dd");
        value.textContent = getValue(model);

        row.append(term, value);
        details.appendChild(row);
      });

      card.append(heading, details);
      mobileCards.appendChild(card);
    });

    const note = document.createElement("p");
    note.className = "comparison-disclaimer";
    note.textContent =
      "Illustrative educational reference values only. Actual specifications vary by model year, market and configuration.";

    comparisonResult.replaceChildren(table, mobileCards, note);
    comparisonResult.hidden = false;
  });

  updateCompareSelection();

  // Interactive garage.
  const configColor = document.getElementById("configColor");
  const configPackage = document.getElementById("configPackage");
  const configTotal = document.getElementById("configTotal");

  function updateGarage() {
    const selected =
      bmwModels.find((model) => model.id === configModel.value) ||
      bmwModels[0];

    const paintCost = Number(configColor.value);
    const packageCost = Number(configPackage.value);
    const total = selected.price + paintCost + packageCost;

    document.getElementById("previewName").textContent = selected.name;
    document.getElementById("previewImage").src = selected.image;
    document.getElementById("previewImage").alt =
      `Representative BMW vehicle photograph for the ${selected.name} configuration; exact model shown may differ`;

    document.getElementById("previewSpec").textContent =
      `${selected.power} hp · ${selected.category}`;

    document.getElementById("previewColor").textContent =
      configColor.options[configColor.selectedIndex].text.split(" (+")[0];

    const paintColors = {
      "0": "#f4f4f1",
      "750": "#1c6dd0",
      "1200": "#b62b32",
      "1500": "#73777e"
    };

    document.getElementById("colorSwatch").style.backgroundColor =
      paintColors[configColor.value];

    configTotal.textContent = money(total);
  }

  [configModel, configColor, configPackage].forEach((control) => {
    control.addEventListener("change", updateGarage);
  });

  updateGarage();

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".choose-model");
    if (!button) return;

    configModel.value = button.dataset.model;
    updateGarage();

    document.getElementById("garage").scrollIntoView({
      behavior: "smooth"
    });
  });

  // Conversation form validation.
  const form = document.getElementById("inquiryForm");
  const successMessage = document.getElementById("successMessage");

  const fields = [
    "fullname",
    "email",
    "phone",
    "interestModel",
    "budget"
  ];

  const validators = {
    fullname: (value) =>
      value.trim().length >= 2
        ? ""
        : "Enter at least 2 characters for your name.",

    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? ""
        : "Enter a valid email address.",

    phone: (value) => {
      const digits = value.replace(/\D/g, "");

      return (
        digits.length >= 7 &&
        digits.length <= 15 &&
        /^\+?[0-9\s().-]+$/.test(value.trim())
      )
        ? ""
        : "Enter a valid phone number with 7 to 15 digits.";
    },

    interestModel: (value) =>
      bmwModels.some((model) => model.id === value)
        ? ""
        : "Choose a BMW model.",

    budget: (value) =>
      Number(value) >= 30000 && Number(value) <= 300000
        ? ""
        : "Enter a budget between $30,000 and $300,000."
  };

  function validateField(id) {
    const field = document.getElementById(id);
    const error = validators[id](field.value);

    document.getElementById(id + "Error").textContent = error;
    field.classList.toggle("is-invalid", Boolean(error));
    field.classList.toggle("is-valid", !error);
    field.setAttribute("aria-invalid", String(Boolean(error)));

    return !error;
  }

  function hideSuccessMessage() {
    $(successMessage).stop(true, true).hide();
    successMessage.hidden = true;
  }

  fields.forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener("input", () => validateField(id));
    field.addEventListener("change", () => validateField(id));
  });

  // Remove an old success message when the user edits again.
  form.addEventListener("input", hideSuccessMessage);
  form.addEventListener("change", hideSuccessMessage);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      hideSuccessMessage();

      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();

      return;
    }

    // Reset the form and clear its saved draft.
    form.reset();

    fields.forEach((id) => {
      const field = document.getElementById(id);
      field.classList.remove("is-valid", "is-invalid");
      field.setAttribute("aria-invalid", "false");
      document.getElementById(id + "Error").textContent = "";
    });

    $(successMessage).stop(true, true);
    successMessage.hidden = false;
    $(successMessage).hide().slideDown(250);
  });

  // Local storage: remember an unfinished conversation request.
  const storageKey = "bmwConversationDraft";
  const draftFieldIds = [...fields, "message"];

  // Restore after the model selector has been populated.
  try {
    const draft = JSON.parse(localStorage.getItem(storageKey));

    if (draft && typeof draft === "object" && !Array.isArray(draft)) {
      draftFieldIds.forEach((id) => {
        const field = document.getElementById(id);

        if (field && typeof draft[id] === "string") {
          field.value = draft[id];
        }
      });
    }
  } catch (error) {
    // The form still works if saved data or storage is unavailable.
  }

  function saveDraft() {
    const draft = {};

    draftFieldIds.forEach((id) => {
      const field = document.getElementById(id);
      if (field) draft[id] = field.value;
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch (error) {
      // The form still works if storage is unavailable.
    }
  }

  form.addEventListener("input", saveDraft);
  form.addEventListener("change", saveDraft);

  form.addEventListener("reset", () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      // Storage may be unavailable.
    }
  });

  renderModels();
});