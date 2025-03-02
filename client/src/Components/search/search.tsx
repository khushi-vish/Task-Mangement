import "./search.css";

export default function search() {
  return (
    <div className="search-element basic">
      <div className="searchContainer shadow">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          className="searchInput "
          placeholder="Search Project"
        />
      </div>
      <div className="filter-container">
        <select className="filter">
          <option className="filter-option">Filter</option>
        </select>
      </div>
    </div>
  );
}
