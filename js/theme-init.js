(() => {
  let theme = "light";
  try {
    const saved = JSON.parse(localStorage.getItem("bmwTheme"));
    if (saved === "dark" || saved === "light") theme = saved;
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.bsTheme = theme;
})();
