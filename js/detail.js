"use strict";
(() => {
  const carId = new URLSearchParams(location.search).get("id");
  const model = BMW.models.find((item) => item.id === carId);
  const target = document.getElementById("modelDetail");
  if (!model) {
    document.getElementById("missingModel").hidden = false;
    return;
  }
  const story = window.BMW_EDITORIAL?.[model.id];
  document.title = `BMW Explorer | ${model.name} details`;
  const index = BMW.models.findIndex((item) => item.id === model.id);
  const previous = BMW.models[(index + BMW.models.length - 1) % BMW.models.length];
  const next = BMW.models[(index + 1) % BMW.models.length];
  const startingPaint = model.colors.find((color) => color.id === new URLSearchParams(location.search).get('paint')) || model.colors[0];
  target.innerHTML = `
    <section class="model-detail-hero" aria-labelledby="detailHeading">
      <div class="container">
        <div class="model-breadcrumb-row"><nav class="model-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="models.html">All models</a><span aria-hidden="true">/</span><span aria-current="page">${model.name}</span></nav><a class="model-breadcrumb-back" href="models.html">← Back to all models</a></div>
        <div class="model-detail-grid">
          <div class="model-detail-copy">
            <p class="eyebrow">MODEL SPOTLIGHT / ${model.category.toUpperCase()}</p>
            <h1 id="detailHeading">BMW <span class="accent">${model.name}</span></h1>
            <p class="model-detail-intro">${model.description}</p>
            <div class="model-detail-summary"><div><strong>${model.power} hp</strong><span>Example output</span></div><div><strong>${model.acceleration}</strong><span>Example 0–100 km/h</span></div></div>
            <p class="model-detail-price"><small>Illustrative starting price</small><strong>${BMW.money(model.price)}</strong></p>
            <div class="model-detail-actions"><a class="btn btn-gold detail-customize-link" href="models.html?model=${model.id}&paint=${startingPaint.id}#garage">Customize this BMW <span aria-hidden="true">↗</span></a><button type="button" class="save-button" data-save="${model.id}" aria-pressed="false">♡ Save</button></div>
            <p class="model-detail-note">Preview real BMW paint photographs here. Build pricing and packages remain in the main Garage.</p>
          </div>
          <figure class="model-photo-card">
            <img id="detailCarPhoto" src="${startingPaint.image}" alt="BMW ${model.name} in ${startingPaint.name}" width="1200" height="675" decoding="async">
            <div class="detail-paint-selector"><div class="detail-paint-selector-heading"><strong>Preview exterior colors</strong><span id="detailPaintName" aria-live="polite">${startingPaint.name}</span></div><div class="detail-paint-swatches" id="detailPaintSwatches" role="group" aria-label="Choose an exterior color to preview BMW ${model.name}"></div><p>Choose a finish to view its real model photo. Continue to the Garage to calculate your build.</p></div>
            <figcaption class="detail-photo-caption">BMW ${model.name} · Official model imagery · Paint and equipment vary by market</figcaption>
          </figure>
        </div>
      </div>
    </section>
    <section class="model-specs-section" id="specifications" aria-labelledby="specsHeading"><div class="container">
      <div class="model-section-heading"><div><p class="eyebrow dark-eyebrow">THE ESSENTIALS</p><h2 id="specsHeading" class="section-title">At a <span class="accent">glance.</span></h2></div><p>Simple, comparable information for the selected BMW. Examples only; actual figures vary by year and market.</p></div>
      <div class="model-specs-grid">
       <div class="model-specs-list"><dl><div><dt>Model</dt><dd>BMW ${model.name}</dd></div><div><dt>Body style</dt><dd>${model.category}</dd></div><div><dt>Example powertrain</dt><dd>${model.engine}</dd></div><div><dt>Example output</dt><dd>${model.power} hp</dd></div><div><dt>Example 0–100 km/h</dt><dd>${model.acceleration}</dd></div><div><dt>Illustrative base price</dt><dd>${BMW.money(model.price)}</dd></div></dl></div>
       <aside class="model-specs-cta"><p class="eyebrow">READY TO EXPLORE?</p><h3>Make this BMW yours.</h3><p>In the Interactive Garage, choose a paint and package and see the estimated total change immediately.</p><a class="btn btn-gold detail-customize-link" href="models.html?model=${model.id}&paint=${startingPaint.id}#garage">Go to the Garage <span aria-hidden="true">↗</span></a></aside>
      </div>
    </div></section>
    <section class="model-story-section" id="modelStory" aria-labelledby="storyHeading"><div class="container">
      <div class="model-section-heading"><div><p class="eyebrow dark-eyebrow">BEHIND THE BADGE</p><h2 class="section-title" id="storyHeading">${story ? story.title : 'Meet your next BMW.'}</h2></div><p>${story ? story.subtitle : model.description}</p></div>
      <div class="model-story-columns"><div class="model-story-prose"><p>${story ? story.paragraphs[0] : model.description}</p><p>${story ? story.paragraphs[1] : 'Features depend on the chosen specification and market.'}</p></div><div class="model-highlights"><h3>Discover the highlights</h3><ul>${model.highlights.map((text) => `<li>${text}</li>`).join('')}</ul><a href="${model.source}" target="_blank" rel="noopener noreferrer">Official BMW model information ↗</a></div></div>
      ${story ? `<div class="model-official-facts"><h3>BMW regional reference: ${story.variant}</h3><dl>${story.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p>These are published example variant figures and may differ from the illustrative Garage data.</p></div>` : ''}
    </div></section>
    ${story ? `<section class="model-film-section" id="modelFilm" aria-labelledby="filmHeading"><div class="container"><p class="eyebrow dark-eyebrow">SEE IT IN MOTION</p><h2 id="filmHeading" class="section-title">BMW <span class="accent">${model.name}</span> on film.</h2><p class="model-film-intro">An official BMW video hosted by YouTube. Availability depends on your connection and the video's regional restrictions.</p>
     <div class="bmw-film-stage" id="bmwFilmStage" data-video-id="${story.video}"><img class="bmw-film-poster" src="${model.image}" alt="BMW ${model.name} video preview" loading="lazy"><div class="bmw-film-poster-shade"></div><div class="bmw-film-credit"><span>OFFICIAL BMW CHANNEL</span><strong>${story.videoTitle}</strong><small>${story.videoBy}</small></div><button class="bmw-film-play" type="button" id="bmwFilmPlay" aria-label="Play BMW ${model.name} film"><span aria-hidden="true">▶</span><span>Play film</span></button><div class="bmw-film-player" id="bmwFilmPlayer" hidden></div><button class="bmw-film-close" type="button" id="bmwFilmClose" hidden aria-label="Close film">× Close film</button><div class="bmw-film-error" id="bmwFilmError" hidden role="status"><strong>The film is unavailable right now.</strong><p>Your BMW details remain available. You can try again or use the official model link.</p><button type="button" id="bmwFilmRetry">Try again</button></div></div>
     <p class="model-film-note">${story.note} The embedded film may depict a different model year or variant.</p></div></section>` : ''}
    <section class="model-next-section" id="detailNext"><div class="container"><h2>Continue exploring.</h2><div class="model-next-links"><a href="model.html?id=${previous.id}">← ${previous.name}</a><a href="models.html">All 8 models</a><a href="model.html?id=${next.id}">${next.name} →</a></div></div></section>
  `;
  // Reuse the same BMW paint data as the Garage. Every swatch changes the
  // actual manufacturer model image (not just a colored overlay).
  const detailImage = document.getElementById("detailCarPhoto");
  const detailSwatches = document.getElementById("detailPaintSwatches");
  const detailPaintName = document.getElementById("detailPaintName");
  let activePaint = startingPaint;
  const selectPaint = (paintId) => {
    const color = model.colors.find((item) => item.id === paintId);
    if (!color) return;
    activePaint = color;
    BMW.setImage(detailImage, color, model);
    detailPaintName.textContent = color.name;
    target.querySelectorAll('.detail-customize-link').forEach((link) => {
      link.href = `models.html?model=${encodeURIComponent(model.id)}&paint=${encodeURIComponent(color.id)}#garage`;
    });
    BMW.paints(detailSwatches, model, color.id, selectPaint);
  };
  model.colors.forEach((color) => { const preload = new Image(); preload.src = color.image; });
  selectPaint(activePaint.id);
  BMW.syncSaved();
  if (story && window.BMWFilmPlayer) {
    BMWFilmPlayer.init({
      stage: document.getElementById("bmwFilmStage"),
      play: document.getElementById("bmwFilmPlay"),
      close: document.getElementById("bmwFilmClose"),
      error: document.getElementById("bmwFilmError"),
      retry: document.getElementById("bmwFilmRetry"),
      mount: document.getElementById("bmwFilmPlayer"), story, model
    });
  }
})();
