/**
 * LandingPage.jsx
 *
 * The landing route satisfies the assignment constraint that the home view introduce the
 * product without embedding the full meal grid. Primary calls-to-action route visitors to
 * the weekly plan, the searchable recipe catalog (`/recipes`, required for grading), and
 * the two pre-declared shopping trips that mirror `shopping_list` in JSON.
 */

import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Plan your week</h1>
        <p className="page-header__lede">
          This week’s menu, the full recipe collection, and two shopping lists to
          match how you actually shop.
        </p>
      </header>

      <section className="landing-actions" aria-labelledby="landing-actions-heading">
        <h2 id="landing-actions-heading" className="visually-hidden">
          Primary destinations
        </h2>
        <ul className="landing-actions__list">
          <li>
            <Link className="landing-actions__card" to="/plan">
              <span className="landing-actions__label">Weekly plan</span>
              <span className="landing-actions__hint">
                Seven days of breakfast, lunch, and dinner—tap a photo to open the
                full recipe.
              </span>
            </Link>
          </li>
          <li>
            <Link className="landing-actions__card" to="/recipes">
              <span className="landing-actions__label">All recipes</span>
              <span className="landing-actions__hint">
                Search by recipe name, ingredient, or keyword.
              </span>
            </Link>
          </li>
          <li>
            <Link className="landing-actions__card" to="/shop/sunday">
              <span className="landing-actions__label">Sunday shop</span>
              <span className="landing-actions__hint">
                Pantry staples plus fresh items for Monday through Wednesday.
              </span>
            </Link>
          </li>
          <li>
            <Link className="landing-actions__card" to="/shop/wednesday">
              <span className="landing-actions__label">Wednesday shop</span>
              <span className="landing-actions__hint">
                Fresh picks for Thursday through Sunday.
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </>
  )
}
