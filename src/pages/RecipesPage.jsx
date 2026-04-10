/**
 * RecipesPage.jsx
 *
 * Required course surface: every recipe in the imported database appears here, and a
 * controlled search input filters the visible set. Filtering runs in `useMemo` so list
 * identity remains stable between renders when the query string is unchanged, which is
 * a standard pattern in introductory React coursework.
 */

import { useMemo, useState } from 'react'
import {
  getAllRecipes,
  recipeMatchesSearchQuery,
} from '../data/recipeDb'
import { SearchBar } from '../components/SearchBar'
import { RecipeList } from '../components/RecipeList'

export function RecipesPage() {
  const allRecipes = useMemo(() => getAllRecipes(), [])
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => allRecipes.filter((r) => recipeMatchesSearchQuery(r, query)),
    [allRecipes, query],
  )

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">All recipes</h1>
        <p className="page-header__lede">
          {allRecipes.length} recipes. Search by name, ingredient, or keyword—then
          open any card for the full method.
        </p>
      </header>
      <SearchBar id="recipe-search" value={query} onChange={setQuery} />
      <RecipeList recipes={filtered} />
    </>
  )
}
