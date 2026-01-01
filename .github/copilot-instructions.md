<!-- Repo-specific guidance for AI coding agents. Keep short and actionable. -->
# Copilot / AI Agent Instructions

This file contains concise, project-specific guidance to help AI coding agents be productive immediately.

1) Big picture
- This is a Next.js (App Router) TypeScript project (see `next` v16) using the `app/` directory pattern. Key entry points:
  - Root layout: src/app/layout.tsx — supplies `Metadata` and loads `next/font` fonts.
  - Pages: src/app/page.tsx — simple static/home page for edits and examples.

2) Build / dev / lint workflows
- Start dev server: `npm run dev` (runs `next dev`).
- Build for production: `npm run build` then `npm run start` to serve.
- Lint: `npm run lint` (invokes `eslint`).

3) Key conventions and patterns (do not invent alternatives)
- App Router: use `src/app/*` for routes and `export const metadata` in layouts when needed.
- Fonts: `next/font` helpers are configured in `src/app/layout.tsx`. Preserve the `variable` font-embedding pattern when changing fonts.
- Images: use `next/image` (see `src/app/page.tsx`). Keep `priority` on critical images.
- Styling: Tailwind is used via `postcss` (see `postcss.config.mjs` and `src/app/globals.css`). Global CSS variables control light/dark colors.
- TypeScript paths: `@/*` maps to `./src/*` (see `tsconfig.json`). Use this alias when adding new imports.

4) Project-specific files to inspect for changes
- App entry & layout: src/app/layout.tsx, src/app/page.tsx
- Global styles: src/app/globals.css, postcss.config.mjs
- Tooling: package.json, tsconfig.json, eslint.config.mjs, next.config.ts

5) Integration points & deployment
- Project is set up for Vercel deployment (standard Next.js). Do not change image optimization or font usage without verifying on Vercel.

6) What to do when adding features
- Follow the App Router conventions (create a folder under `src/app` with `page.tsx` and optional `layout.tsx`).
- Update `tsconfig.json` paths if you add new top-level folders under `src` that should be referenced via `@/`.
- Register Tailwind utilities in `globals.css` and keep the `@import "tailwindcss"` line.

7) Tests and missing pieces
- There are currently no tests in the repo. If adding tests, prefer lightweight unit tests for UI components and add `test` script to `package.json` (do not add heavy infra without approval).

8) Safety and scope for AI edits
- Keep changes minimal and related to the task. Avoid large refactors (changing the routing approach, replacing App Router, or altering TypeScript target) unless the user requests it.
- When adding dependencies, update `package.json` and note why the dependency is required.

If anything here is unclear or you'd like the instructions expanded (examples, code snippets, or automated checks), tell me which section to improve.
