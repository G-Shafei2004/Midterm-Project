# Verification summary — revised Final project

The project was checked after the requested revisions.

## Checked using the actual HTML/CSS/JavaScript in an isolated headless Chromium test

- 5 pages × three viewport widths (375, 768, 1280 px) × two color modes = **30 page/theme/width combinations**.
- No document-level horizontal overflow in those isolated tests.
- No uncaught JavaScript page errors in those isolated tests.
- Models page: 8 DOM-generated cards, empty search message, reset, automatic comparison, selected paint photograph and calculated total.
- Enquiry form: invalid name containing digits rejected; valid input produced the local success message.
- BMW Innovation: choosing the Electric Mobility topic updated the information panel.
- Model Details: displayed the X7 details; no 3D rotation button or duplicate package calculator.
- Navigation: static links to local pages and static assets were checked; no missing references found.

## Limitations / must verify on GitHub Pages

This runtime blocked navigation to a local HTTP server. The isolated browser used inlined copies of the files, so it does **not** establish that the live GitHub Pages deployment, official BMW YouTube videos, or Chrome's cross-page localStorage persistence works there. Test those on the deployed site before the deadline. Also run the W3C HTML Validator on the deployed pages. Google Fonts and video streaming may require internet.

The video previews and photos retain their existing attribution links in the footer; confirm image license/creator details for inherited photographs before submission.
