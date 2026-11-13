"use strict";
(() => {
  const topics = {
    digital: {
      number: "01 / DIGITAL COCKPIT",
      title: "Technology designed for the driver.",
      description: "BMW's digital cockpit can bring navigation, vehicle information and infotainment into a clear driver-focused layout. Some BMW models include a curved display and voice interaction; the exact interface depends on the vehicle and model year.",
      points: ["Navigation and driving information", "Touch, voice and physical controls", "Model-specific curved display features"],
      image: "images/cars/7-series-0.webp",
      imageAlt: "BMW 7 Series exterior in a blue-toned finish, illustrating a luxury technology-focused model",
      photoLabel: "BMW 7 Series · Digital cabin experience",
      modelId: "7-series", modelName: "7 Series"
    },
    assist: {
      number: "02 / DRIVER ASSISTANCE",
      title: "Technology that supports your awareness.",
      description: "Depending on equipment, BMW driver-assistance systems may help with parking, distance monitoring and lane awareness. These systems support the driver; they are not substitutes for attention or safe driving.",
      points: ["Available parking assistance", "Available cameras and sensor systems", "The driver always remains responsible"],
      image: "images/cars/x5-1.webp",
      imageAlt: "BMW X5 SUV exterior, shown as a visual example for the driver-assistance topic",
      photoLabel: "BMW X5 · Driving assistance context",
      modelId: "x5", modelName: "X5"
    },
    electric: {
      number: "03 / ELECTRIC MOBILITY",
      title: "An electric drive with a BMW feel.",
      description: "Electric BMW models use electric motors to deliver smooth response. Their battery technology, charging options and range depend on vehicle specification, weather and use. Explore the i4 to see a real electric BMW model.",
      points: ["Immediate electric-motor response", "Charging and energy monitoring", "Driving range varies with conditions"],
      image: "images/cars/i4-2.webp",
      imageAlt: "BMW i4 electric vehicle exterior shown in a professional model photograph",
      photoLabel: "BMW i4 · Electric Gran Coupé",
      modelId: "i4", modelName: "i4"
    },
    connected: {
      number: "04 / CONNECTED SERVICES",
      title: "Bring your digital world on the road.",
      description: "Compatible BMW vehicles can connect navigation, media, phone functions and selected online services to the driving experience. Supported apps, features and subscriptions vary by country and software version.",
      points: ["Supported smartphone integration", "Connected navigation and media", "Service availability depends on region"],
      image: "images/cars/5-series-2.webp",
      imageAlt: "BMW 5 Series exterior, illustrating the modern connected vehicle concept",
      photoLabel: "BMW 5 Series · Connected driving context",
      modelId: "5-series", modelName: "5 Series"
    }
  };
  const buttons = [...document.querySelectorAll("[data-innovation]")];
  const article = document.querySelector(".innovation-display");
  if (!buttons.length || !article) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Local model photographs: preloading keeps transitions smooth after a click.
  Object.values(topics).forEach((data) => { const image = new Image(); image.src = data.image; });
  function activate(id, focus = false) {
    const data = topics[id];
    if (!data) return;
    buttons.forEach((button) => {
      const active = button.dataset.innovation === id;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const update = () => {
      document.getElementById("innovationNumber").textContent = data.number;
      const photo = document.getElementById("innovationTopicImage");
      photo.src = data.image;
      photo.alt = data.imageAlt;
      document.getElementById("innovationPhotoLabel").textContent = data.photoLabel;
      const link = document.getElementById("innovationModelLink");
      link.href = `model.html?id=${encodeURIComponent(data.modelId)}`;
      link.innerHTML = `Discover the BMW ${data.modelName} <span aria-hidden="true">↗</span>`;
      document.getElementById("innovationTitle").textContent = data.title;
      document.getElementById("innovationDescription").textContent = data.description;
      const points = document.getElementById("innovationPoints");
      points.replaceChildren(...data.points.map((text) => { const li = document.createElement("li"); li.textContent = text; return li; }));
      article.dataset.topic = id;
      if (focus) document.getElementById("innovationTitle").focus({preventScroll:true});
    };
    if (reduced) return update();
    $(article).stop(true, true).fadeTo(110, 0.5, () => {
      update();
      $(article).fadeTo(170, 1);
    });
  }
  buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.innovation)));
  activate("digital");
})();
