import React from 'react';

function Sidebar({ onSearch, searchTerm, setSearchTerm, onShowFavorites, showFavorites }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search recipes..."
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
        />
        <button className="btn" onClick={onSearch}>Search</button>
      </div>
      <nav className="sidebar-nav">
        <button className={showFavorites ? 'nav-link active' : 'nav-link'} onClick={onShowFavorites}>
          ⭐ Favorites
        </button>
        <a className="nav-link" href="/" style={{ marginTop: 8 }}>All Recipes</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
