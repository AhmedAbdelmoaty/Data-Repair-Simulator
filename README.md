# Data Repair Simulator

Premium dark-mode web app that simulates a Power Query-like data cleaning experience. Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and PapaParse for in-browser CSV parsing.

## Features
- Case selector leading to the sales cleanup workbench
- Real-time data preview with column selection highlights
- Six interactive tools: trim/clean, replace values, change type, remove duplicates, handle nulls, split column
- Applied steps timeline with undo and per-step delete (reapplies transformations from the original dataset)
- Validation checks with bilingual hints and grading logic (A/B/C based on steps)
- RTL-first bilingual UI (Arabic default) with instant language toggle
- Messy CSV dataset included at `public/datasets/sales_messy.csv`

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to start the simulator.

## Project Structure
- `app/` – Next.js App Router pages
- `components/` – UI building blocks (toolbox, table, timeline, validation)
- `lib/` – Transformations, validation logic, utilities, translations
- `public/datasets/` – Messy sales CSV used in Case 1

## Notes
- All transformations are client-side; no backend is required in v1.
- Validation checks cover uniqueness, numeric conversion, positive quantities, parseable dates, and normalized channels.
