import React from 'react';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-title">
        <span role="img" aria-label="Recipe Book">📖</span> Recipe Explorer
      </div>
      <div className="header-userarea">
        {user ? (
          <>
            <span className="greet">Hello, {user.username}</span>
            <button className="btn btn-logout" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

export default Header;
