"use strict";
// Source information is available from every footer without a dedicated page.
document.querySelectorAll(".footer-model-sources").forEach((list) => {
  BMW.models.forEach((model) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = model.source;
    link.textContent = `BMW ${model.name}: model and paint preview source`;
    item.append(link);
    list.append(item);
  });
});
