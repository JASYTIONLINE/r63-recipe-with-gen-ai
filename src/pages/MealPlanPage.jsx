/**
 * MealPlanPage.jsx
 *
 * Implements the weekly plan route required by the product brief: seven weekday blocks
 * (`monday`–`sunday`), each with three meal slots keyed `"1"`–`"3"` in JSON but labeled
 * Breakfast / Lunch / Dinner on screen. Only the meal photograph is wrapped in a router
 * `Link`, so textual content remains easy to read without accidental navigation.
 *
 * Print behavior follows three layers: (1) `Print week` outputs a compact table-oriented
 * summary without full ingredient lists; (2) `Print this day` includes ingredient lines
 * suitable for prep but omits method text; (3) both paths rely on hidden `.print-only`
 * regions toggled via `document.body.dataset.print`, documented in `print.css`.
 *
 * Day and week macro rollups sum numeric macros across meals; omega-6:3 ratio on rollups
 * uses a calorie-weighted average, with user-facing notes explaining the limitation.
 */

import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  formatMacroSummary,
  getListItemById,
  getWeeklyPlanOrdered,
  sumMacros,
} from '../data/recipeDb'

/** Sets `body[data-print]` and opens the system print dialog on the next frame. */
function triggerPrintMode(mode) {
  document.body.dataset.print = mode
  requestAnimationFrame(() => {
    window.print()
  })
}

export function MealPlanPage() {
  /* Hydrate the plan once per mount: adapter orders weekdays and resolves slot labels. */
  const plan = useMemo(() => getWeeklyPlanOrdered(), [])
  const weekRollupMacros = useMemo(
    () =>
      sumMacros(
        plan.flatMap((d) =>
          d.meals.map((m) => getListItemById(m.recipeId)?.macros),
        ),
      ),
    [plan],
  )
  const [dayKeyForPrint, setDayKeyForPrint] = useState(null)

  useEffect(() => {
    if (!dayKeyForPrint) return undefined
    document.body.dataset.print = 'day'
    const id = requestAnimationFrame(() => {
      window.print()
    })
    return () => cancelAnimationFrame(id)
  }, [dayKeyForPrint])

  useEffect(() => {
    const handleAfterPrint = () => {
      setDayKeyForPrint(null)
    }
    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [])

  const dayPrintBlock = useMemo(() => {
    if (!dayKeyForPrint) return null
    const day = plan.find((d) => d.key === dayKeyForPrint)
    if (!day) return null
    return (
      <div className="print-day-sheet">
        <h1>{day.label} — prep list</h1>
        <p className="print-day-sheet__note">
          Amounts match the recipe cards. Cooking steps aren’t included here—use
          Print recipe on each recipe page if you want the full method.
        </p>
        <ol className="print-day-meals">
          {day.meals.map((meal) => {
            const recipe = getListItemById(meal.recipeId)
            if (!recipe) {
              return (
                <li key={meal.slot}>
                  <p>
                    <strong>{meal.label}</strong>: recipe not found ({meal.recipeId})
                  </p>
                </li>
              )
            }
            return (
              <li key={meal.slot}>
                <h2 className="print-day-meal__title">
                  {meal.label}: {recipe.title}
                </h2>
                <p className="print-day-meal__desc">{recipe.description}</p>
                <p className="print-day-meal__macros">{formatMacroSummary(recipe.macros)}</p>
                <ul>
                  {recipe.ingredients.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ol>
        {(() => {
          const dayTotals = sumMacros(
            day.meals.map((meal) => getListItemById(meal.recipeId)?.macros),
          )
          return dayTotals ? (
            <div className="print-day-rollup">
              <p>
                <strong>Day total:</strong> {formatMacroSummary(dayTotals)}
              </p>
              <p className="print-day-rollup__note" role="note">
                <strong>Note:</strong> Omega-6:3 is a calorie-weighted average across
                these meals, not a direct measure of fats combined on the plate.
              </p>
            </div>
          ) : null
        })()}
      </div>
    )
  }, [dayKeyForPrint, plan])

  return (
    <>
      <div className="no-print">
        <header className="page-header">
          <h1 className="page-header__title">Weekly meal plan</h1>
          <p className="page-header__lede">
            Breakfast, lunch, and dinner for each day. Tap a meal photo for
            ingredients, prep, and cooking steps.
          </p>
          <div className="plan-toolbar">
            <button
              type="button"
              className="button-secondary"
              onClick={() => triggerPrintMode('week')}
            >
              Print week
            </button>
          </div>
        </header>

        <section className="week-macro-rollup week-macro-rollup--top" aria-labelledby="week-rollup-heading">
          <h2 id="week-rollup-heading" className="week-macro-rollup__title">
            Week total
          </h2>
          <p className="week-macro-rollup__lede">
            All breakfasts, lunches, and dinners combined.
          </p>
          <p className="week-macro-rollup__values">
            {weekRollupMacros ? formatMacroSummary(weekRollupMacros) : '—'}
          </p>
          <p className="week-macro-rollup__note" role="note">
            <strong>Note:</strong> Protein, carbs, fat, and calories are summed across
            all meals. Omega-6:3 shown here is a calorie-weighted average of each
            recipe’s ratio—useful for comparison, not a lab measurement of fatty
            acids in the combined food.
          </p>
        </section>

        <ul className="week-grid">
          {plan.map((day) => (
            <li key={day.key} className="week-card">
              <div className="week-card__head">
                <h2 className="week-card__title">{day.label}</h2>
                <button
                  type="button"
                  className="button-ghost"
                  onClick={() => setDayKeyForPrint(day.key)}
                >
                  Print this day
                </button>
              </div>
              <ul className="meal-slot-list">
                {day.meals.map((meal) => {
                  const recipe = getListItemById(meal.recipeId)
                  if (!recipe) {
                    return (
                      <li key={meal.slot} className="meal-slot meal-slot--missing">
                        <p className="meal-slot__label">{meal.label}</p>
                        <p>Recipe not found ({meal.recipeId})</p>
                      </li>
                    )
                  }
                  return (
                    <li key={meal.slot} className="meal-slot">
                      <p className="meal-slot__label">{meal.label}</p>
                      <div className="meal-slot__body">
                        <Link
                          className="meal-slot__image-link"
                          to={`/recipe/${recipe.id}`}
                          aria-label={`Open recipe: ${recipe.title}`}
                        >
                          <img
                            className="meal-slot__image"
                            src={recipe.image}
                            alt=""
                          />
                        </Link>
                        <div className="meal-slot__text">
                          <p className="meal-slot__name">{recipe.title}</p>
                          <p className="meal-slot__desc">{recipe.description}</p>
                          <p className="meal-slot__macros">
                            {formatMacroSummary(recipe.macros)}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              {(() => {
                const dayTotals = sumMacros(
                  day.meals.map((meal) => getListItemById(meal.recipeId)?.macros),
                )
                return (
                  <div className="day-macro-rollup">
                    <h3 className="day-macro-rollup__title">Day total</h3>
                    <p className="day-macro-rollup__values">
                      {dayTotals
                        ? formatMacroSummary(dayTotals)
                        : '—'}
                    </p>
                    {dayTotals ? (
                      <p className="day-macro-rollup__note" role="note">
                        <strong>Note:</strong> Omega-6:3 is a calorie-weighted
                        average across today’s meals, not a measured fat blend.
                      </p>
                    ) : null}
                  </div>
                )
              })()}
            </li>
          ))}
        </ul>
      </div>

      <div className="print-only print-block print-week" aria-hidden="true">
        <h1 className="print-title">Weekly meal plan</h1>
        <p className="print-muted">
          Summary: recipe name, short description, and macros. Open each recipe
          on the site for full instructions.
        </p>
        <table className="print-week-table">
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Meal</th>
              <th scope="col">Recipe</th>
              <th scope="col">Summary</th>
              <th scope="col">Macros</th>
            </tr>
          </thead>
          <tbody>
            {plan.flatMap((day) =>
              day.meals.map((meal) => {
                const recipe = getListItemById(meal.recipeId)
                return (
                  <tr key={`${day.key}-${meal.slot}`}>
                    <td>{day.label}</td>
                    <td>{meal.label}</td>
                    <td>{recipe ? recipe.title : meal.recipeId}</td>
                    <td>{recipe ? recipe.description : '—'}</td>
                    <td>{recipe ? formatMacroSummary(recipe.macros) : '—'}</td>
                  </tr>
                )
              }),
            )}
          </tbody>
          <tfoot>
            <tr className="print-week-table__rollup">
              <th colSpan={4} scope="row">
                Week total (all meals)
              </th>
              <td>
                {weekRollupMacros ? formatMacroSummary(weekRollupMacros) : '—'}
              </td>
            </tr>
          </tfoot>
        </table>
        <p className="print-muted print-week-rollup-note" role="note">
          <strong>Note:</strong> Macro grams and calories are summed for the week.
          Week Omega-6:3 is a calorie-weighted average of recipe ratios—an estimate
          for planning, not analytical chemistry.
        </p>
      </div>

      {dayKeyForPrint ? (
        <div className="print-only print-block print-day" aria-hidden="true">
          {dayPrintBlock}
        </div>
      ) : null}
    </>
  )
}
