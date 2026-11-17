# IRON DISTRICT

A premium, single-page fitness club site built with React, TypeScript and Vite. The experience is designed around an industrial editorial direction: concrete-dark surfaces, oversized Anton typography, electric orange accents and cinematic male training photography.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## What is included

- Cinematic full-screen hero with scroll parallax, staged type entrance and a rotating metallic weight-plate accent built in CSS/SVG.
- Fabricated, asymmetric "The District" editorial section with a horizontal image reveal.
- Scroll-pinned horizontal training-zone gallery with progress state and image hover transitions.
- Three membership tiers with pointer-driven 3D tilt, a highlighted Performance plan and a working application dialog.
- Male-only coach portraits with grayscale-to-color hover states, profile quotes and booking links.
- Testimonial carousel and scroll-triggered animated statistics.
- Final CTA with location, contact and hours, plus a large editorial footer.
- Mobile navigation, reduced-motion support, keyboard focus states and native dialog semantics.
- Self-hosted Anton and Inter Tight fonts for offline-safe rendering.

## Structure

```
public/
  fonts/        self-hosted display and sans fonts
  images/       optimized WebP training photography
src/
  App.tsx       page sections, animations and membership dialog
  styles.css    design system, layout and responsive motion
  main.tsx      React entry point
```

Photography sourced from [Pexels](https://www.pexels.com) and used for demonstration purposes. All visible human photography features men only.
