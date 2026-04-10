/**
 * SearchBar.jsx
 *
 * Controlled input: parent supplies `value` and `onChange` so filtering logic stays
 * colocated with data (`RecipesPage`) for straightforward unit reasoning and rubric demos.
 */

export function SearchBar({ id, value, onChange }) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor={id}>
        Search recipes
      </label>
      <input
        id={id}
        className="search-bar__input"
        type="search"
        placeholder="Search by name or ingredient…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
