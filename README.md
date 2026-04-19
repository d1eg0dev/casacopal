# Casa Copal — Careyes

Private luxury villa website for Casa Copal, located in Costa Careyes, Jalisco, Mexico.

## Project Structure

```
casa-copal/
├── index.html          # Main HTML (all pages in single file with JS navigation)
├── css/
│   └── style.css       # Complete design system stylesheet
├── js/
│   └── main.js         # Navigation, cursor, scroll animations
├── images/
│   ├── logo.png        # Casa Copal logo (transparent background)
│   └── compressed_*.jpg # Property photography (51 images)
└── README.md
```

## Design System

- **Primary Color:** Copal Amber `#D48E38`
- **Background:** White Sand `#F2EEEB`
- **Dark:** `#1A1814`
- **Display Font:** Cormorant Garamond (Google Fonts)
- **Body Font:** Manrope (Google Fonts)

## Pages

- **Home** — Hero, intro, gallery strip, suites preview, amenities, gastronomy, experiences, location
- **The House** — Architecture details, common spaces, amenities gallery
- **Suites** — Grid of all 9 suites (6 with photography, 3 placeholder)
- **Suite Detail** — Individual pages for Suites 1, 2, 3, 4, 5, 8
- **Gastronomy** — Food photography grid, private dining details
- **Gallery** — Masonry grid with 30 images
- **Careyes** — Destination info, transportation details
- **Contact / Inquire** — Hero image, reservation form

## Notes

- Suite names are pending client approval (currently Suite One through Suite Nine)
- Suites 6, 7, 9 photography pending — marked with "Photo coming soon"
- Contact form is visual only (no backend)
- All navigation works via JavaScript `showPage()` function

## Credits

Developed by [WD Studio Agency](https://wdstudio.agency/)
