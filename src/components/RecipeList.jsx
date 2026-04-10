/**
 * RecipeList.jsx
 *
 * Presentational grid of recipe cards. The parent owns filter state; this component
 * either renders the grid or an accessible empty state when the filtered array is empty.
 */

import { RecipeCard } from './RecipeCard'

export function RecipeList({ recipes }) {
  if (recipes.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p className="empty-state__title">No recipes match your search</p>
        <p className="empty-state__hint">
          Try a shorter word or a different ingredient.
        </p>
      </div>
    )
  }

  return (
    <ul className="recipe-grid">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="recipe-grid__item">
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  )
}
