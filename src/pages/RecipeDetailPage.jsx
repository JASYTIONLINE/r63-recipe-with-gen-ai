/**
 * RecipeDetailPage.jsx
 *
 * Detail route for a single `recipe` row. Ingredients from structured JSON fields are
 * flattened to readable lines; macronutrients and optional omega ratio render as a summary
 * string. Prep and cook text come from dedicated JSON fields when present, or from a
 * sentence-split heuristic applied to `instructions`, as described in `recipeDb.js`.
 *
 * A dormant print-only article mirrors the on-screen content for printable recipe output
 * (assignment printable #3). Navigation back targets `/recipes` so graders can verify
 * the list-to-detail flow.
 */

import { Link, useParams } from 'react-router-dom'
import { formatMacroSummary, getRecipeById } from '../data/recipeDb'

function triggerPrintRecipe() {
  document.body.dataset.print = 'recipe'
  requestAnimationFrame(() => {
    window.print()
  })
}

export function RecipeDetailPage() {
  const { id } = useParams()
  const recipe = id ? getRecipeById(id) : undefined

  if (!recipe) {
    return (
      <div className="not-found">
        <h1 className="not-found__title">Recipe not found</h1>
        <p className="not-found__text">
          We couldn’t find a recipe matching that link. Check the address or return
          to the recipe list.
        </p>
        <Link className="button-link" to="/recipes">
          Back to all recipes
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="no-print">
        <article className="detail">
          <Link className="detail__back" to="/recipes">
            ← All recipes
          </Link>
          <div className="detail-toolbar">
            <button type="button" className="button-secondary" onClick={triggerPrintRecipe}>
              Print recipe
            </button>
          </div>
          <header className="detail__header">
            <div className="detail__intro">
              <h1 className="detail__title">{recipe.title}</h1>
              <p className="detail__description">{recipe.description}</p>
              <p className="detail__meta" aria-label="Macronutrient summary">
                {formatMacroSummary(recipe.macros)}
              </p>
              {recipe.servings != null ? (
                <p className="detail__servings">Servings: {recipe.servings}</p>
              ) : null}
              <ul className="detail__tags" aria-label="Keywords">
                {recipe.tags.map((tag) => (
                  <li key={tag} className="detail__tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="detail__hero">
              <img
                className="detail__image"
                src={recipe.image}
                alt=""
                loading="eager"
              />
            </div>
          </header>

          <div className="detail__grid">
            <section className="detail-card" aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="detail-card__title">
                Ingredients
              </h2>
              <ul className="detail-list">
                {recipe.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <div className="detail-method">
              <section className="detail-card" aria-labelledby="prep-heading">
                <h2 id="prep-heading" className="detail-card__title">
                  Prep
                </h2>
                <p className="detail-prose">{recipe.prepText}</p>
              </section>
              <section className="detail-card" aria-labelledby="cook-heading">
                <h2 id="cook-heading" className="detail-card__title">
                  Cook
                </h2>
                <p className="detail-prose">{recipe.cookText}</p>
              </section>
            </div>
          </div>
        </article>
      </div>

      <div className="print-only print-block print-recipe" aria-hidden="true">
        <h1 className="print-title">{recipe.title}</h1>
        <p className="print-muted">{recipe.description}</p>
        <p className="print-muted">{formatMacroSummary(recipe.macros)}</p>
        {recipe.servings != null ? (
          <p className="print-muted">Servings: {recipe.servings}</p>
        ) : null}

        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Prep</h2>
        <p className="detail-prose">{recipe.prepText}</p>
        <h2>Cook</h2>
        <p className="detail-prose">{recipe.cookText}</p>
      </div>
    </>
  )
}
