# DentaCare — Dental Patient Portal

A responsive dental patient web app inspired by the provided mint, teal, and peach dental UI reference. Built with Next.js App Router, TypeScript, Lucide icons, and a custom design system.

## Dental artwork

The `public/images/` directory contains individually art-directed dental illustration sources: a glossy porcelain tooth, cleaning, whitening, titanium implant, clear aligners, dental arch, toothbrush, and floss artwork.

High-resolution PNGs are rendered automatically from the SVG source art before development and production builds. The app uses those PNGs in its actual dashboard, treatment catalogue, care cards, and tooth-health screen.

```bash
npm install
npm run dev
```

The PNG generator can also be run manually:

```bash
npm run generate:images
```

## Included screens

- **Overview dashboard:** welcome banner, next appointment, quick actions, oral wellness demo score, care team, recommendation and visual everyday-care cards.
- **Appointments:** month calendar, selectable appointment date/time, booking dialog, and a local demo confirmation flow.
- **Treatments:** searchable and filterable treatment catalogue using dedicated artwork for cleaning, whitening, implants, and aligners.
- **Tooth health:** dental arch illustration, sample wellness metrics, history timeline, and analysis screen.
- **My records:** records list, sample document types, and privacy guidance.
- **Profile:** editable local demo details, reminder toggle, preferences, and related navigation.

## Production build

```bash
npm run build
npm start
```

The prebuild script generates PNGs before Next.js compiles the app. GitHub Actions also runs the production build for pushes to `main`, pull requests, and manual workflow dispatches.

## Important: prototype scope

This version is a **front-end demo**. Navigation, search/filtering, date and time selection, booking confirmation, tabs, profile editing, and reminder controls work in local page state. They do not connect to a clinic, account, email/SMS, calendar, database, or document storage. Patient details, appointment information, health scores, ratings, and prices are sample data.

**Do not enter real patient health data into this demo.** Before real patient use, add authenticated access, server-side authorization, secure storage, real appointment availability, clinic-approved pricing and copy, privacy notices, audit logs, backups, and any compliance controls applicable to the clinic's location.
