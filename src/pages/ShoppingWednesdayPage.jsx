/**
 * ShoppingWednesdayPage.jsx
 *
 * Second shopping trip: renders `thursday_to_sunday_perishables` (and headings from the
 * adapter) so the mid-week run focuses on shorter shelf-life items. Like the Sunday page,
 * this is a read-only projection of JSON; checklist interactions that persist state are
 * intentionally out of scope for the assignment.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getWednesdayShopSections } from '../data/recipeDb'

function triggerPrintMode() {
  document.body.dataset.print = 'shop'
  requestAnimationFrame(() => {
    window.print()
  })
}

export function ShoppingWednesdayPage() {
  const sections = useMemo(() => getWednesdayShopSections(), [])

  return (
    <>
      <div className="no-print">
        <header className="page-header">
          <h1 className="page-header__title">Wednesday shopping list</h1>
          <p className="page-header__lede">
            Fresh ingredients for Thursday through Sunday dinners and snacks.
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
        <h1 className="print-title">Wednesday shop</h1>
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
