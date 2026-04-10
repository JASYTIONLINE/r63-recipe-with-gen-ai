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

## Assignment submission

- **[SCHOOL_SUBMISSION.md](./SCHOOL_SUBMISSION.md)** — Formal write-up for the LMS: problem, solution, rubric mapping, **repo** and **GitHub Pages** links.
- **[SUBMISSION.md](./SUBMISSION.md)** — Short checklist, STAR bullets, and clone/push notes.

## Original template

Scaffolded with [Vite](https://vite.dev/) + React. ESLint config follows the template; app code lives under `src/`.
