# Lumière — The Art of Your Smile

An art-directed, cinematic dental website concept built with Next.js, React Three Fiber, Three.js, GSAP and custom CSS. The art direction pairs deep forest-green scenes with warm porcelain, champagne accents, editorial typography and a procedural 3D tooth sculpture.

## Experience

- Full-viewport hero with pointer-responsive 3D tooth sculpture, animated metallic orbital lines and fine technical labels.
- Editorial philosophy section with large type and cinematic photography.
- Interactive 3D layered tooth anatomy illustration with educational labels.
- Three immersive treatment panels with image reveals and hover transitions.
- Clinic studio and dentist introduction sections.
- Appointment CTA, responsive mobile navigation, accessible focus states and reduced-motion support.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

The GitHub Actions workflow also runs the production build when changes are pushed to `main` or a pull request is opened.

## Before launching for a real clinic

- Replace the sample Lumière brand and copy with the practice's approved brand information.
- Update `hello@lumieredental.example` in `app/page.tsx` with a verified appointment email, or wire the CTA to the clinic's booking provider.
- Replace the generic studio and dentist photography with licensed, clinic-approved images.
- Replace the dentist name/credentials placeholder in `app/page.tsx` with verified information.
- Update `metadataBase` in `app/layout.tsx` to the real website URL.
- Review treatment descriptions and any medical information with the dental professional before publishing.

No real qualifications, patient outcomes, statistics or testimonials are claimed.
