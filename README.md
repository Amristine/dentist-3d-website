# Lumière Dental Studio — Cinematic 3D Website

A responsive Next.js landing page concept for a premium dental studio. The experience combines a procedural 3D tooth sculpture, fine editorial typography, warm neutral colors, GSAP scroll reveals, and mobile navigation.

## Stack

- Next.js App Router + TypeScript
- React Three Fiber, Three.js and Drei for the 3D scene
- GSAP + ScrollTrigger for subtle motion
- Tailwind CSS v4 setup with custom editorial CSS
- Lucide icons

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Customize before launch

- Replace the illustrative clinic name and copy with the actual practice's information.
- Update the appointment email in `app/page.tsx` from the placeholder `hello@lumieredental.example`.
- Replace the interior stock photo URL in `app/globals.css` with approved clinic photography.
- Review services and all claims with the dentist before publishing.

The 3D tooth is generated in code; no external 3D model file is required.
