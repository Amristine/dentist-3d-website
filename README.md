# DentaCare — Dental Patient Portal

A responsive dental patient web app inspired by the provided mint, teal, and peach 3D mobile UI reference. Built with Next.js App Router, TypeScript, Lucide icons, and a custom CSS design system.

## Included screens

- **Overview dashboard:** welcome banner, next appointment, quick actions, oral wellness sample score, care team, and recommendation panel.
- **Appointments:** month calendar, selectable appointment date/time, booking dialog, and a local demo confirmation flow.
- **Treatments:** searchable and filterable treatment catalogue with custom tooth artwork, descriptions, sample prices, and booking entry points.
- **Tooth health:** custom SVG dental-arch illustration, sample wellness metrics, history timeline, and analysis screen.
- **My records:** records list, sample document types and privacy guidance.
- **Profile:** editable local demo details, reminder toggle, preferences, and related navigation.

The artwork is drawn as in-app SVG and CSS illustrations so the core visual elements do not depend on external 3D model downloads or image assets.

## Run locally

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/Amristine/dentist-3d-website.git
cd dentist-3d-website
npm install
npm run dev
```

Open http://localhost:3000.

## Verify a production build

```bash
npm run build
```

GitHub Actions runs the production build on pushes to `main`, pull requests, and manual workflow dispatches.

## Important: current prototype scope

This version is a **front-end demo**. Navigation, search/filtering, date and time selection, booking confirmation, tabs, profile editing, and reminder controls work in local page state. They do not currently connect to a clinic, user account, email/SMS, calendar, database, or document storage. Sample patient details, appointment information, health scores, ratings, and prices are illustrative and are not actual medical records or clinical assessments.

## Before real patient use

1. Add authentication and patient/clinic roles with server-side authorization.
2. Store patient profiles and appointment requests in a secure backend/database; validate all input on the server.
3. Connect appointment slots to the clinic's real availability and handle conflicting bookings.
4. Add clinic email/SMS notifications and confirmation/cancellation flows.
5. Use private, access-controlled storage for actual medical records and verify access for every document request.
6. Have the practice review all treatment copy and prices; replace sample dentist details and stock imagery with approved clinic content.
7. Add privacy notices, consent, audit logs, retention rules, backups, monitoring, and any compliance requirements applicable to the clinic's location.
8. Configure production environment variables and deploy only after a security review.

**Do not enter real patient health data into this demo.** The current UI is a prototype, not a production clinical record system.
