/**
 * App.jsx
 *
 * Root composition component for the assignment: it provides global chrome (skip link,
 * header navigation, footer) and declares all URL routes. Centralizing routes here satisfies
 * the pedagogical goal that students can read one file to understand site information
 * architecture rather than hunting for nested route definitions.
 *
 * The `afterprint` listener clears `document.body.dataset.print` so that when the user
 * closes or cancels the browser print dialog, interactive layouts return to normal. Print
 * layouts themselves are defined in sibling components and `print.css`.
 *
 * @see ./print.css — `@media print` rules keyed off `body[data-print]`
 */

import { useEffect } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { MealPlanPage } from './pages/MealPlanPage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'
import { RecipesPage } from './pages/RecipesPage'
import { ShoppingSundayPage } from './pages/ShoppingSundayPage'
import { ShoppingWednesdayPage } from './pages/ShoppingWednesdayPage'
import './App.css'
import './print.css'

function App() {
  /* Restore normal chrome after printing: print views toggle `data-print` on `body`. */
  useEffect(() => {
    const clearPrint = () => {
      delete document.body.dataset.print
    }
    window.addEventListener('afterprint', clearPrint)
    return () => window.removeEventListener('afterprint', clearPrint)
  }, [])

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header no-print">
        <div className="app-header__inner">
          <NavLink className="app-brand" to="/" end>
            HomeCook
          </NavLink>
          <nav className="app-nav" aria-label="Main">
            <NavLink className="app-nav__link" to="/plan">
              Meal plan
            </NavLink>
            <NavLink className="app-nav__link" to="/recipes">
              All recipes
            </NavLink>
            <NavLink className="app-nav__link" to="/shop/sunday">
              Sunday shop
            </NavLink>
            <NavLink className="app-nav__link" to="/shop/wednesday">
              Wednesday shop
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main" className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan" element={<MealPlanPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/shop/sunday" element={<ShoppingSundayPage />} />
          <Route path="/shop/wednesday" element={<ShoppingWednesdayPage />} />
          <Route
            path="/shopping-list"
            element={<Navigate to="/shop/sunday" replace />}
          />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        </Routes>
      </main>
      <footer className="app-footer no-print">
        <small>
          Healthy low-carb, gluten-free recipes to help you lose weight and keep muscle.
        </small>
      </footer>
    </div>
  )
}

export default App
