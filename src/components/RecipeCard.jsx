/**
 * RecipeCard.jsx
 *
 * Summary card used on `/recipes`: the entire card is linked to the detail route, which
 * differs from the meal plan page where only the image is linked (see `MealPlanPage`).
 */

import { Link } from 'react-router-dom'

export function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <Link className="recipe-card__link" to={`/recipe/${recipe.id}`}>
        <div className="recipe-card__image-wrap">
          <img
            className="recipe-card__image"
            src={recipe.image}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="recipe-card__body">
          <h2 className="recipe-card__title">{recipe.title}</h2>
          <p className="recipe-card__desc">{recipe.description}</p>
          <p className="recipe-card__meta">
            <span>Prep {recipe.prepTime}</span>
            <span aria-hidden="true"> · </span>
            <span>Cook {recipe.cookTime}</span>
          </p>
        </div>
      </Link>
    </article>
  )
}
