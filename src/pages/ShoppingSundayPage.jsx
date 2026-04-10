/**
 * ShoppingSundayPage.jsx
 *
 * First shopping trip in the product narrative. Data are read from `shopping_list` arrays
 * in `recipe.db.json` (pantry staples and perishables through mid-week), not computed at
 * runtime from `weeklyPlan`, matching the plan’s “Option A” pre-declared bucket strategy.
 * The print path reuses the same sections inside a `.print-only` block for clean output.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getSundayShopSections } from '../data/recipeDb'

function triggerPrintMode() {
  document.body.dataset.print = 'shop'
  requestAnimationFrame(() => {
    window.print()
  })
}

export function ShoppingSundayPage() {
  const sections = useMemo(() => getSundayShopSections(), [])

  return (
    <>
      <div className="no-print">
        <header className="page-header">
          <h1 className="page-header__title">Sunday shopping list</h1>
          <p className="page-header__lede">
            Stock the pantry and grab perishables you’ll use through Wednesday.
          </p>
          <div className="plan-toolbar">
            <button type="button" className="button-secondary" onClick={triggerPrintMode}>
              Print list
            </button>
          </div>
        </header>

        <Link className="detail__back" to="/">
          ← Back to home
        </Link>

        {sections.map((section) => (
          <section key={section.title} className="shopping-section">
            <h2 className="shopping-section__title">{section.title}</h2>
            <ul className="shopping-list">
              {section.items.map((item, index) => (
                <li key={`${section.title}-${index}`} className="shopping-list__item">
                  <span className="shopping-list__name">{item.name}</span>
                  <span className="shopping-list__detail">{item.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="print-only print-block print-shop" aria-hidden="true">
        <h1 className="print-title">Sunday shop</h1>
        {sections.map((section) => (
          <section key={section.title} className="shopping-section">
            <h2 className="shopping-section__title">{section.title}</h2>
            <ul className="shopping-list">
              {section.items.map((item, index) => (
                <li key={`${section.title}-${index}`} className="shopping-list__item">
                  <span className="shopping-list__name">{item.name}</span>
                  <span className="shopping-list__detail">{item.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
