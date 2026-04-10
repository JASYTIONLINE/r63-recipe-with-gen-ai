# Assignment submission: HomeCook — Recipe & meal plan viewer

**Course context:** Developing a recipe application using generative-AI-assisted authoring for structured data, implemented as a **read-only React** client.

**Author note:** Add your name, course number, section, and due date in the LMS; this file is the technical narrative to attach or paste as your write-up.

---

## Links (required for grading)

| Resource | URL |
|----------|-----|
| **Source repository** | [https://github.com/JASYTIONLINE/r63-recipe-with-gen-ai](https://github.com/JASYTIONLINE/r63-recipe-with-gen-ai) |
| **Live site (Vercel)** | [https://r63-recipe-with-gen-590wkhg6d-jasytionlines-projects.vercel.app/](https://r63-recipe-with-gen-590wkhg6d-jasytionlines-projects.vercel.app/) |
| **Live site (GitHub Pages, optional)** | [https://jasytionline.github.io/r63-recipe-with-gen-ai/](https://jasytionline.github.io/r63-recipe-with-gen-ai/) — may need `base` / `basename` fixes to match Vercel behavior. |

**Preferred demo URL:** Vercel production link (root hosting, SPA routing works after refresh). Same build as the repository; no local install required for reviewers.

---

## Problem statement (what we were solving)

The assignment called for a **React** application that helps users work with **recipe data**: browse a collection, inspect a single recipe in depth, and support **search** so the list remains usable as the catalog grows. The workflow assumes recipes and related structures (meal plan, shopping lists) may be **authored or refined with generative AI** or other tools **outside** the app, then **imported** as data the UI displays.

The product goals we implemented extend that core idea:

- Present a **weekly meal plan** tied to structured data (`weeklyPlan` in JSON).
- Support **two shopping trips** (Sunday and Wednesday) aligned to pre-declared ingredient buckets in the database.
- Provide **print-friendly** views for the week, a single day, a full recipe, and shopping lists—matching real kitchen and store use without changing the underlying JSON from the browser.

**Non-goals (explicit):** No in-app editing of recipes, no saving checklist state into the JSON file, no backend API for CRUD. The app is an **information viewer**; updates happen by editing `recipe.db.json` (or an export from another tool) and rebuilding or redeploying.

---

## What we built (solution summary)

**HomeCook** is a single-page application (SPA) built with **React 19** and **Vite**, with **React Router** for navigation. All content for recipes, the seven-day plan, and shopping sections comes from one imported file: **`src/data/recipe.db.json`**.

A dedicated module, **`src/data/recipeDb.js`**, acts as an **adapter**: it maps raw JSON shapes (for example recipe `name`) into UI-friendly props (`title`, `description`, `ingredients` as searchable strings, derived `tags`, macro summaries including optional omega-6:3 ratio). Components do not import the JSON directly; they call adapter functions. That separation makes the rubric’s “data + UI” boundary clear for grading and peer review.

**Routes:**

- **`/`** — Landing page with calls to action (meal plan, all recipes, both shops).
- **`/recipes`** — **Required** catalog: grid of cards, **search** over title, short description, ingredient lines, and tags.
- **`/recipe/:id`** — Detail: structured ingredients, macros, Prep and Cook sections, print control; invalid IDs show a not-found state.
- **`/plan`** — Seven weekday cards (Monday–Sunday), three meals each (Breakfast / Lunch / Dinner); only the **meal image** links to the recipe. Week and day **macro rollups** and **print week / print this day**.
- **`/shop/sunday`** and **`/shop/wednesday`** — Shopping lists from JSON buckets + **Print list**.
- **`/shopping-list`** — Redirects to the Sunday shop for backward compatibility.

**Printing:** `window.print()` plus **`src/print.css`**: `body[data-print]` selects which hidden **print-only** block is shown; header, nav, and footer use **`no-print`** so hard copies stay clean.

---

## How we did it (method and architecture)

1. **Scaffold:** Vite + React template, added **`react-router-dom`**, ESLint as configured in the template.
2. **Data:** Maintained **`recipe.db.json`** as valid JSON: `recipes[]`, `weeklyPlan` (weekdays → meal slots `"1"`–`"3"` → recipe ids), `shopping_list` sections, optional `micronutrient_targets_weekly` for future use. Each recipe includes **`short_description`**, structured **`ingredients`**, **`macros`** (including **`omega_3_6_ratio`** where used), and **`instructions`** (with optional split into Prep/Cook via adapter heuristics or future fields).
3. **Adapter (`recipeDb.js`):** Exposes `getAllRecipes`, `getRecipeById`, `getWeeklyPlanOrdered`, shopping section getters, `formatMacroSummary`, `sumMacros` (day/week rollups), and `recipeMatchesSearchQuery` for the search bar.
4. **UI:** One component per route under `src/pages/`; shared **`RecipeList`**, **`RecipeCard`**, **`SearchBar`** for the required list experience.
5. **Quality:** **`npm run lint`** and **`npm run build`** are clean; source is commented at file level for instructor and student readers.
6. **Version control & hosting:** Git repository on GitHub; production build deployed to **Vercel** from the same repo (see `vercel.json` for SPA rewrites). **GitHub Pages** is optional and may require extra `base` / `basename` configuration for this Vite app.

---

## How this meets the rubric (explicit mapping)

| Typical rubric / assignment expectation | How HomeCook satisfies it |
|----------------------------------------|---------------------------|
| **React** used for the UI | Entire app is React function components; entry at `src/main.jsx`. |
| **List page showing all recipes** | **`/recipes`** lists every recipe from the database via `getAllRecipes()` and `RecipeList` / `RecipeCard`. |
| **Search** | Controlled **`SearchBar`**; **`useMemo`** filters with **`recipeMatchesSearchQuery`** over title, description, ingredient strings, and derived tags. |
| **Detail page per recipe** | **`/recipe/:id`** with full ingredients, macros, Prep/Cook, print; graceful handling when the id is missing. |
| **Routing / navigation** | **`App.jsx`** declares routes and a persistent nav; deep links work for detail and shops. |
| **Data-driven behavior** | Single JSON source + **`recipeDb.js`**; no hard-coded duplicate recipe arrays in components. |
| **Generative-AI / external authoring workflow** | JSON is the handoff artifact: models or editors can emit or update **`recipe.db.json`**; the app only reads it at build time. |
| **Problem extension (meal plan, shopping, print)** | Implemented as specified: weekly grid, two shops, multiple print layouts—demonstrates end-to-end product thinking beyond a minimal list/detail demo. |

---

## Verification steps for the instructor

1. Open the **Vercel production URL** in the table above ([live site](https://r63-recipe-with-gen-590wkhg6d-jasytionlines-projects.vercel.app/)).
2. Navigate **Meal plan → All recipes**; use **search** (e.g. an ingredient or keyword from a recipe title).
3. Open any **recipe** from a card or meal-plan image; confirm **ingredients** and **Prep/Cook**.
4. Use **Print week** / **Print this day** on the meal plan and **Print** on shop and recipe pages (browser print preview is sufficient).
5. Optional local check: clone the **repository**, run `npm install`, `npm run dev`, and repeat.

---

## Conclusion

This submission delivers a **read-only React recipe and meal-plan application** that satisfies the core assignment (**list, search, detail, routing, data integration**) and implements the extended product (**weekly plan, dual shopping lists, print suite**). Data flows **JSON → adapter → components**, matching the intended **AI-assisted authoring, human-reviewed import** workflow. The **repository** preserves full source and history; **Vercel** (deployed from the same GitHub repo) provides install-free access for rubric review, with correct SPA routing after refresh.

---

## Appendix: companion files

- **`SUBMISSION.md`** — Short checklist and STAR bullets for quick LMS fields.
- **`README.md`** — Developer-oriented run instructions and route table.
