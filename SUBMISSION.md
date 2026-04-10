# Submission package — HomeCook (read-only recipe & meal plan viewer)

This document supports LMS upload and instructor review for the **developing a recipe app** assignment. The application is a **React + Vite** client that **imports** `src/data/recipe.db.json` at build time; it does **not** mutate that file from the browser.

---

## How to run and verify

From the project root:

```text
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Production build and lint:

```text
npm run build
npm run lint
```

---

## Rubric alignment (quick checklist)

| Requirement | Where it lives |
|-------------|----------------|
| React SPA | Vite + `src/main.jsx`, `src/App.jsx` |
| List of all recipes | Route **`/recipes`** → `RecipesPage.jsx` + `RecipeList` / `RecipeCard` |
| Search (name, ingredients, tags/keywords) | Controlled `SearchBar` + `useMemo` filter via `recipeDb.recipeMatchesSearchQuery` |
| Recipe detail | **`/recipe/:id`** → `RecipeDetailPage.jsx`; invalid id → not-found view |
| Routing | `react-router-dom` in `App.jsx` |
| Data source | `recipe.db.json` read only through **`recipeDb.js`** |

**Additional product features (assignment plus spec):** landing (`/`), weekly plan (`/plan`) with print week/day, Sunday and Wednesday shopping lists with print, printable recipe page, dual shopping trips from JSON buckets.

---

## STAR summary (paste into LMS narrative if requested)

- **Situation:** Course asked for a React recipe browser backed by data, with list + search + detail, aligned to generative-AI-assisted workflow (JSON produced elsewhere, app is a viewer).
- **Tasks:** Implement routes, adapter over `recipe.db.json`, weekly `weeklyPlan` grid, two shopping pages, browser print layouts, and accessible navigation; keep the UI read-only relative to the JSON file.
- **Actions:** Built `recipeDb.js` for normalization and search fields; added pages for landing, plan, shops, and recipes; wired `print.css` and `body[data-print]` for print modes; ran ESLint and production builds.
- **Result:** A deployable static client where instructors and peers can trace data from JSON → adapter → components; `/recipes` satisfies the explicit list-and-search requirement.

---

## Git and GitHub

A **local** Git repository should contain an initial commit of source and config (excluding `node_modules` and `dist` per `.gitignore`).

To publish:

1. Create an empty repository on GitHub (no README if you already have one locally).
2. Add the remote and push:

This project was published at:

**https://github.com/JASYTIONLINE/r63-recipe-with-gen-ai**

If you clone elsewhere, use:

```text
git remote add origin https://github.com/JASYTIONLINE/r63-recipe-with-gen-ai.git
git branch -M main
git push -u origin main
```

Paste the repository URL into the LMS field if required.

---

## Files worth reviewing for comments and structure

- `src/data/recipeDb.js` — adapter, search, macro summaries, weekly plan and shopping getters.
- `src/App.jsx` — routes, navigation, print cleanup.
- `src/pages/MealPlanPage.jsx` — seven-day UI, rollups, print triggers.
- `src/print.css` — print-only visibility rules.
