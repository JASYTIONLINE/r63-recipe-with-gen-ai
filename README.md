# HomeCook — Weekly meal plan & recipes (React + Vite)

Read-only viewer for a **single imported database** (`src/data/recipe.db.json`): recipes, a seven-day **`weeklyPlan`**, and two **shopping-list** sections (Sunday and Wednesday trips). The UI does not edit the JSON.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production bundle to `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build |

## Routes

| Path | Page |
|------|------|
| `/` | Landing — links to plan, recipes, shops |
| `/plan` | Weekly meal grid, print week / print day |
| `/recipes` | All recipes + search |
| `/recipe/:id` | Detail: ingredients, macros, prep/cook, print |
| `/shop/sunday` | First shopping list + print |
| `/shop/wednesday` | Mid-week shopping list + print |

Legacy **`/shopping-list`** redirects to **`/shop/sunday`**.

## Data

Author content in **`src/data/recipe.db.json`**, then rebuild or refresh dev server. The adapter **`src/data/recipeDb.js`** maps JSON shapes to props for list cards, detail, and search.

## Repository

**https://github.com/JASYTIONLINE/r63-recipe-with-gen-ai**

## Deploy on Vercel

The repo is designed to deploy from **GitHub** with **no `base` path changes** (root URL, standard `BrowserRouter`).

1. Sign in at [vercel.com](https://vercel.com) and click **Add New… → Project**.
2. **Import** `JASYTIONLINE/r63-recipe-with-gen-ai` (authorize the GitHub app if prompted).
3. Leave defaults: **Framework Preset** Vite (or Other with **Build Command** `npm run build`, **Output Directory** `dist`).
4. Deploy. Vercel runs `npm install` and `npm run build`; **`vercel.json`** adds SPA rewrites so routes like `/recipes` work on refresh.
5. Copy the **Production** URL from the project dashboard (e.g. `https://r63-recipe-with-gen-ai.vercel.app` — exact hostname may include your team slug). Paste that URL into your LMS write-up ([SCHOOL_SUBMISSION.md](./SCHOOL_SUBMISSION.md)).

**GitHub Pages** (`*.github.io/<repo>/`) still needs a `base` + `basename` if you use it; **Vercel is the recommended live demo** for this stack.

## Assignment submission

- **[SCHOOL_SUBMISSION.md](./SCHOOL_SUBMISSION.md)** — Formal write-up for the LMS: problem, solution, rubric mapping, **repo** and live site links.
- **[SUBMISSION.md](./SUBMISSION.md)** — Short checklist, STAR bullets, and clone/push notes.

## Original template

Scaffolded with [Vite](https://vite.dev/) + React. ESLint config follows the template; app code lives under `src/`.
