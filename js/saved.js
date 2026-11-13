(() => {
  const { models, money, saved, card, syncSaved, writeSaved } = BMW;
  const grid = document.getElementById("savedGrid");

  function render() {
    const list = models.filter((m) => saved().includes(m.id));
    grid.replaceChildren(...list.map((m) => card(m, true)));
    document.getElementById("savedEmpty").hidden = !!list.length;
    document.getElementById("clearSaved").disabled = !list.length;
    document.getElementById("savedSummary").textContent =
      `${list.length} saved ${list.length === 1 ? "car" : "cars"} · Combined example starting prices: ${money(list.reduce((sum, m) => sum + m.price, 0))}`;
    syncSaved();
  }
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    const previous = [...grid.querySelectorAll("[data-remove]")],
      index = previous.indexOf(b);
    writeSaved(saved().filter((id) => id !== b.dataset.remove));
    const next = grid.querySelectorAll("[data-remove]");
    (
      next[Math.min(index, next.length - 1)] ||
      document.querySelector("#savedEmpty a")
    ).focus();
    BMW.notify("Car removed.");
  });
  document.getElementById("clearSaved").addEventListener("click", () => {
    writeSaved([]);
    document.querySelector("#savedEmpty a").focus();
    BMW.notify("Saved collection cleared.");
  });
  document.addEventListener("bmw:saved", render);
  render();
})();
