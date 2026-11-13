# BMW Explorer Final — Verified Local Checks (2026-11-13)

**Result: 79 / 79 isolated Chromium checks passed.**

Test method: HTML, CSS and JS from the final project were embedded into a local isolated Chromium document because the current environment blocks direct navigation to local servers and file URLs. Car image assets were embedded as lightweight JPEG copies for test screenshots; real project WebP paths were separately checked. localStorage behavior was tested using a per-page mock with the same JSON get/set semantics. These tests do not replace checking the deployed GitHub Pages version.

Coverage:
- Five pages at 375px, 768px and 1280px, light and dark themes: no document horizontal overflow, no uncaught JS exceptions.
- Eight dynamically generated cards, empty search state, automatic comparison and removal, garage photo changes, calculated price changes.
- Form required validation, alphabetic names, country code, model-dependent minimum budget, valid success message and form reset.
- Model detail color switching, query link to Garage, saved cars across pages, clear all, persistent dark theme, Innovation panel image/link updates.

Known external checks for the student after publishing:
- Public GitHub Pages deployment and its exact URLs; real browser console/network inspection.
- Official W3C validator; live YouTube embed availability depends on provider/network permissions.
- GitHub commit history: authentic development commits before the deadline.
- Inherited Midterm editorial photography has one unresolved original image source URL; credits identify the available photographers and the photographer profile.

## Automated check details

- [x] index.html 375 light: no horizontal scroll
- [x] index.html 375 light: JS
- [x] models.html 375 light: no horizontal scroll
- [x] models.html 375 light: JS
- [x] innovation.html 375 light: no horizontal scroll
- [x] innovation.html 375 light: JS
- [x] model.html 375 light: no horizontal scroll
- [x] model.html 375 light: JS
- [x] saved.html 375 light: no horizontal scroll
- [x] saved.html 375 light: JS
- [x] index.html 375 dark: no horizontal scroll
- [x] index.html 375 dark: JS
- [x] models.html 375 dark: no horizontal scroll
- [x] models.html 375 dark: JS
- [x] innovation.html 375 dark: no horizontal scroll
- [x] innovation.html 375 dark: JS
- [x] model.html 375 dark: no horizontal scroll
- [x] model.html 375 dark: JS
- [x] saved.html 375 dark: no horizontal scroll
- [x] saved.html 375 dark: JS
- [x] index.html 768 light: no horizontal scroll
- [x] index.html 768 light: JS
- [x] models.html 768 light: no horizontal scroll
- [x] models.html 768 light: JS
- [x] innovation.html 768 light: no horizontal scroll
- [x] innovation.html 768 light: JS
- [x] model.html 768 light: no horizontal scroll
- [x] model.html 768 light: JS
- [x] saved.html 768 light: no horizontal scroll
- [x] saved.html 768 light: JS
- [x] index.html 768 dark: no horizontal scroll
- [x] index.html 768 dark: JS
- [x] models.html 768 dark: no horizontal scroll
- [x] models.html 768 dark: JS
- [x] innovation.html 768 dark: no horizontal scroll
- [x] innovation.html 768 dark: JS
- [x] model.html 768 dark: no horizontal scroll
- [x] model.html 768 dark: JS
- [x] saved.html 768 dark: no horizontal scroll
- [x] saved.html 768 dark: JS
- [x] index.html 1280 light: no horizontal scroll
- [x] index.html 1280 light: JS
- [x] models.html 1280 light: no horizontal scroll
- [x] models.html 1280 light: JS
- [x] innovation.html 1280 light: no horizontal scroll
- [x] innovation.html 1280 light: JS
- [x] model.html 1280 light: no horizontal scroll
- [x] model.html 1280 light: JS
- [x] saved.html 1280 light: no horizontal scroll
- [x] saved.html 1280 light: JS
- [x] index.html 1280 dark: no horizontal scroll
- [x] index.html 1280 dark: JS
- [x] models.html 1280 dark: no horizontal scroll
- [x] models.html 1280 dark: JS
- [x] innovation.html 1280 dark: no horizontal scroll
- [x] innovation.html 1280 dark: JS
- [x] model.html 1280 dark: no horizontal scroll
- [x] model.html 1280 dark: JS
- [x] saved.html 1280 dark: no horizontal scroll
- [x] saved.html 1280 dark: JS
- [x] eight model cards
- [x] empty search state
- [x] automatic compare
- [x] comparison removing checkbox
- [x] price calculated from paint and package
- [x] paint changes real model image
- [x] required field errors
- [x] name rejects numbers
- [x] model-specific budget minimum
- [x] valid form succeeds
- [x] valid form resets
- [x] models functional test JS exceptions
- [x] model detail color changes photo
- [x] selected paint passed to garage
- [x] saved car persists across pages
- [x] clear all saved models
- [x] theme persists across pages
- [x] innovation topics change photo
- [x] innovation topic link updates
