/**
 * recipeDb.js
 *
 * This module is the data-access boundary between the static JSON meal database and the
 * React presentation layer. The course rubric expects a clear separation: components should
 * consume plain objects with predictable keys (`title`, `description`, `macros`) rather
 * than reaching into raw import shape (`name`, nested `ingredients`).
 *
 * The database is read-only at runtime. Updates to menus or nutrition values occur by
 * editing `recipe.db.json` (or an exported successor) outside the app and rebuilding.
 *
 * Exports cover three concerns: (1) recipe list and detail projections for routes such as
 * `/recipes` and `/recipe/:id`; (2) ordered weekly plan structures for `/plan`; and
 * (3) shopping sections derived from `shopping_list` buckets. Search helpers derive tags
 * when the source file omits a native tag array, so the search requirement remains testable.
 *
 * @see ../data/recipe.db.json — authoritative schema for recipes, weeklyPlan, shopping_list
 */

import recipeDatabase from './recipe.db.json'

/** Lowercase weekday keys in display order Monday through Sunday. */
export const WEEKDAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

/**
 * Meal slot keys in JSON are the strings `"1"`, `"2"`, and `"3"`.
 * We keep string keys here so lookups stay explicit after JSON import.
 */
export const MEAL_SLOT_LABELS = {
  '1': 'Breakfast',
  '2': 'Lunch',
  '3': 'Dinner',
}

/**
 * Builds a deterministic placeholder image URL so every recipe has a stable
 * thumbnail before real `image` URLs exist in the imported JSON.
 *
 * @param {string} id - Recipe identifier such as `recipe_001`.
 * @returns {string} Absolute URL suitable for `<img src>`.
 */
export function placeholderImageForRecipe(id) {
  const n = String(id).replace(/\D/g, '') || '0'
  const seed = parseInt(n, 10) % 1000
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&sig=${seed}`
}

/**
 * Returns the first sentence of a longer instruction block. Used only when a recipe
 * row has no `short_description` in JSON.
 *
 * @param {string} text - Full `instructions` string from the database.
 * @returns {string} Truncated, still meaningful blurb.
 */
export function firstSentence(text) {
  if (!text || typeof text !== 'string') return ''
  const idx = text.indexOf('. ')
  if (idx === -1) return text.trim()
  return text.slice(0, idx + 1).trim()
}

/**
 * Card and list blurbs: prefer authoring `short_description` in JSON, fall back to instructions.
 *
 * @param {{ short_description?: string, instructions?: string }} r - Raw recipe row.
 * @returns {string}
 */
function recipeShortDescription(r) {
  const s = r.short_description
  if (s != null && String(s).trim()) return String(s).trim()
  return firstSentence(r.instructions || '')
}

/**
 * Derives simple searchable tags from the recipe title so the `/recipes`
 * search bar can match keywords even when the source JSON has no `tags` array.
 *
 * @param {{ name: string }} recipe - Raw recipe row from JSON.
 * @returns {string[]} Lowercase tokens used only for filtering (not shown as chips unless desired).
 */
function deriveTagsFromName(recipe) {
  const words = recipe.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
  return [...new Set(words)].slice(0, 8)
}

/**
 * Formats one structured ingredient for display on recipe detail pages,
 * including amount, name, metric note, and preparation when present.
 *
 * @param {{ name: string, amount: string, grams?: number, prep?: string }} row
 * @returns {string} Human-readable line for lists and search.
 */
function formatIngredientLine(row) {
  let line = `${row.amount} ${row.name}`.trim()
  if (row.grams != null) line += ` (${row.grams} g)`
  if (row.prep) line += ` — ${row.prep}`
  return line
}

/**
 * Maps a raw recipe record to the compact shape used by `RecipeCard` and
 * client-side search on `/recipes`.
 *
 * @param {object} r - Raw recipe from `recipe.db.json`.
 * @returns {object} List item with `title`, `description`, `tags`, and string `ingredients`.
 */
export function mapRecipeToListItem(r) {
  return {
    id: r.id,
    title: r.name,
    description: recipeShortDescription(r),
    image: placeholderImageForRecipe(r.id),
    prepTime: '—',
    cookTime: '—',
    tags: deriveTagsFromName(r),
    /** Flat strings so search can scan ingredient text without nested objects */
    ingredients: r.ingredients.map((ing) => formatIngredientLine(ing)),
    macros: { ...r.macros },
  }
}

/**
 * Splits free-form instructions into Prep and Cook sections when optional
 * fields are absent. If `prep_instructions` and `cook_instructions` exist on the
 * imported JSON in the future, those take precedence.
 *
 * @param {object} r - Raw recipe.
 * @returns {{ prep: string, cook: string }}
 */
function splitPrepCook(r) {
  if (r.prep_instructions && r.cook_instructions) {
    return { prep: r.prep_instructions, cook: r.cook_instructions }
  }
  const text = r.instructions || ''
  const sentences = text
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith('.') ? s : `${s}.`))
  if (sentences.length <= 1) {
    return {
      prep: 'Here we summarize mise en place and early steps; see Cook for finishing.',
      cook: text,
    }
  }
  const mid = Math.ceil(sentences.length / 2)
  return {
    prep: sentences.slice(0, mid).join(' '),
    cook: sentences.slice(mid).join(' '),
  }
}

/**
 * Builds tiny ordered steps for screens that expect an array of strings.
 *
 * @param {string} text - Full instructions.
 * @returns {string[]}
 */
function stepsFromInstructions(text) {
  if (!text) return []
  return text
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith('.') ? s : `${s}.`))
}

/**
 * Full detail view model including ingredients, macros, and prep/cook text.
 *
 * @param {object} r - Raw recipe row.
 * @returns {object}
 */
export function mapRecipeToDetail(r) {
  const list = mapRecipeToListItem(r)
  const { prep, cook } = splitPrepCook(r)
  return {
    ...list,
    ingredients: r.ingredients.map((ing) => formatIngredientLine(ing)),
    ingredientRows: r.ingredients,
    steps: stepsFromInstructions(r.instructions),
    prepText: prep,
    cookText: cook,
    instructionsFull: r.instructions,
    servings: r.servings,
  }
}

/**
 * @returns {ReturnType<mapRecipeToListItem>[]}
 */
export function getAllRecipes() {
  return recipeDatabase.recipes.map(mapRecipeToListItem)
}

/**
 * Resolves a single recipe by id for the detail route.
 *
 * @param {string} id - URL parameter from `/recipe/:id`.
 * @returns {ReturnType<mapRecipeToDetail>|undefined}
 */
export function getRecipeById(id) {
  const raw = recipeDatabase.recipes.find((row) => row.id === id)
  return raw ? mapRecipeToDetail(raw) : undefined
}

/**
 * Returns ordered weekday blocks with meal slots pointing at recipe ids.
 *
 * @returns {{ key: string, label: string, meals: { slot: string, label: string, recipeId: string }[] }[]}
 */
export function getWeeklyPlanOrdered() {
  const plan = recipeDatabase.weeklyPlan
  return WEEKDAY_KEYS.map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    meals: ['1', '2', '3'].map((slot) => ({
      slot,
      label: MEAL_SLOT_LABELS[slot],
      recipeId: plan[key][slot],
    })),
  }))
}

/**
 * Resolves a list item for a recipe id (used on the meal plan grid).
 *
 * @param {string} recipeId
 */
export function getListItemById(recipeId) {
  const raw = recipeDatabase.recipes.find((row) => row.id === recipeId)
  return raw ? mapRecipeToListItem(raw) : undefined
}

/**
 * Sunday shop: pantry staples plus fresh items through mid-week.
 *
 * @returns {{ title: string, items: { name: string, detail: string }[] }[]}
 */
export function getSundayShopSections() {
  const s = recipeDatabase.shopping_list
  return [
    {
      title: 'Pantry & non-perishables',
      items: s.sunday_non_perishables.map((row) => ({
        name: row.name,
        detail: `${row.amount} ${row.unit} (${row.approx_us})`,
      })),
    },
    {
      title: 'Fresh through Wednesday',
      items: s.sunday_to_wednesday_perishables.map((row) => ({
        name: row.name,
        detail: `${row.amount} ${row.unit} (${row.approx_us})`,
      })),
    },
  ]
}

/**
 * Wednesday shop: fresh items for the back half of the week.
 *
 * @returns {{ title: string, items: { name: string, detail: string }[] }[]}
 */
export function getWednesdayShopSections() {
  const s = recipeDatabase.shopping_list
  return [
    {
      title: 'Fresh for Thursday–Sunday',
      items: s.thursday_to_sunday_perishables.map((row) => ({
        name: row.name,
        detail: `${row.amount} ${row.unit} (${row.approx_us})`,
      })),
    },
  ]
}

/**
 * Weekly micronutrient ranges (optional; reserved for future UI).
 *
 * @returns {Record<string, { min?: number, max?: number }>|null}
 */
export function getWeeklyMicronutrientTargets() {
  const t = recipeDatabase.micronutrient_targets_weekly
  return t && typeof t === 'object' ? { ...t } : null
}

/**
 * Sums protein, carbs, fat, and calories across macro objects (e.g. three meals in a day).
 * Omega-6:3 ratio cannot be summed; this function uses a **calorie-weighted average** of each
 * meal’s `omega_3_6_ratio` when calories are present, otherwise a simple mean of available ratios.
 *
 * @param {({ protein_g?: number, carbs_g?: number, fat_g?: number, calories?: number, omega_3_6_ratio?: number }|null|undefined)[]} macrosObjects
 * @returns {{ protein_g: number, carbs_g: number, fat_g: number, calories: number, omega_3_6_ratio?: number }|null}
 */
export function sumMacros(macrosObjects) {
  const list = macrosObjects.filter(Boolean)
  if (list.length === 0) return null
  let protein_g = 0
  let carbs_g = 0
  let fat_g = 0
  let calories = 0
  let omegaWeightedNum = 0
  let omegaWeightedDen = 0
  const ratiosForMean = []
  for (const m of list) {
    if (m.protein_g != null) protein_g += Number(m.protein_g)
    if (m.carbs_g != null) carbs_g += Number(m.carbs_g)
    if (m.fat_g != null) fat_g += Number(m.fat_g)
    if (m.calories != null) calories += Number(m.calories)
    const r = m.omega_3_6_ratio
    if (r != null && !Number.isNaN(Number(r))) {
      const rv = Number(r)
      ratiosForMean.push(rv)
      const cal = m.calories
      if (cal != null && Number(cal) > 0) {
        omegaWeightedNum += rv * Number(cal)
        omegaWeightedDen += Number(cal)
      }
    }
  }
  let omega_3_6_ratio
  if (omegaWeightedDen > 0) {
    omega_3_6_ratio = omegaWeightedNum / omegaWeightedDen
  } else if (ratiosForMean.length > 0) {
    omega_3_6_ratio =
      ratiosForMean.reduce((acc, x) => acc + x, 0) / ratiosForMean.length
  }
  const out = {
    protein_g: Math.round(protein_g * 10) / 10,
    carbs_g: Math.round(carbs_g * 10) / 10,
    fat_g: Math.round(fat_g * 10) / 10,
    calories: Math.round(calories),
  }
  if (omega_3_6_ratio != null && !Number.isNaN(omega_3_6_ratio)) {
    out.omega_3_6_ratio = Math.round(omega_3_6_ratio * 10) / 10
  }
  return out
}

/**
 * One-line macro summary for cards, meal plan slots, and print layouts.
 *
 * `omega_3_6_ratio` is the approximate omega-6 : omega-3 mass ratio for the serving
 * (e.g. 12 → about 12:1). Tune per recipe in JSON as you refine nutrition data.
 *
 * @param {{ protein_g?: number, carbs_g?: number, fat_g?: number, calories?: number, omega_3_6_ratio?: number }} macros
 * @returns {string}
 */
export function formatMacroSummary(macros) {
  if (!macros) return ''
  const p = macros.protein_g
  const c = macros.carbs_g
  const f = macros.fat_g
  const cal = macros.calories
  const o36 = macros.omega_3_6_ratio
  const parts = []
  if (p != null) parts.push(`Protein ${p} g`)
  if (c != null) parts.push(`Carbs ${c} g`)
  if (f != null) parts.push(`Fat ${f} g`)
  if (cal != null) parts.push(`${cal} kcal`)
  if (o36 != null && !Number.isNaN(Number(o36))) {
    const n = Number(o36)
    const ratioLabel = Number.isInteger(n) ? `${n}:1` : `${n.toFixed(1)}:1`
    parts.push(`Omega-6:3 ~${ratioLabel}`)
  }
  return parts.join(' · ')
}

/**
 * Case-insensitive match across title, short description, ingredient lines, and tags.
 *
 * @param {ReturnType<mapRecipeToListItem>} recipe
 * @param {string} query
 * @returns {boolean}
 */
export function recipeMatchesSearchQuery(recipe, query) {
  if (!query.trim()) return true
  const needle = query.trim().toLowerCase()
  const haystacks = [
    recipe.title,
    recipe.description,
    ...recipe.ingredients,
    ...recipe.tags,
  ]
  return haystacks.some((s) => String(s).toLowerCase().includes(needle))
}
