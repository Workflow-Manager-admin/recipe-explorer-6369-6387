import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import AuthForm from './components/AuthForm';
import { useAuth } from './hooks/useAuth';
import { recipeApi } from './api/recipeApi';

function App() {
  // Theme state (light only for now, but allow toggling)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Authentication state
  const { user, loading: authLoading, login, logout, register, setUser } = useAuth();
  const [authMode, setAuthMode] = useState('login');

  // Recipe state
  const [recipes, setRecipes] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Search & favorites
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Get recipes from server
  async function fetchRecipes() {
    setRecLoading(true);
    try {
      const recs = await recipeApi.listRecipes({
        search: searchTerm,
        showFavorites: showFavorites
      });
      setRecipes(recs);
      setSelected(null);
    } finally {
      setRecLoading(false);
    }
  }

  // Get favorites for user
  async function fetchFavorites() {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    const favs = await recipeApi.getFavorites().catch(() => []);
    setFavoriteIds(new Set(favs.map(r => r.id)));
  }

  // Initial & refresh: load recipes and favorites for user
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line
  }, [searchTerm, showFavorites, user]);

  // Toggle favorite
  async function handleToggleFavorite(recipe) {
    if (!user) return;
    await recipeApi.toggleFavorite(recipe.id);
    fetchFavorites();
  }

  // Handle recipe clicks
  function handleRecipeClick(recipe) {
    setSelected(recipe);
    setShowForm(false);
    setIsEditing(false);
  }

  // Add/edit/delete
  function handleAddRecipe() {
    setShowForm(true);
    setIsEditing(false);
    setSelected(null);
  }
  function handleEditRecipe(recipe) {
    setShowForm(true);
    setIsEditing(true);
    setSelected(recipe);
  }
  async function handleSaveRecipe(data) {
    if (isEditing && selected) {
      await recipeApi.updateRecipe(selected.id, data);
    } else {
      await recipeApi.createRecipe(data);
    }
    setShowForm(false);
    fetchRecipes();
    fetchFavorites();
  }
  async function handleDeleteRecipe(recipe) {
    if (window.confirm("Delete this recipe?")) {
      await recipeApi.deleteRecipe(recipe.id);
      setSelected(null);
      fetchRecipes();
      fetchFavorites();
    }
  }

  // Handle Auth
  async function handleLogin(form) {
    await login(form);
    setAuthMode('login');
  }
  async function handleRegister(form) {
    await register(form);
    setAuthMode('login');
  }
  function handleLogout() {
    logout();
    setShowForm(false);
    setSelected(null);
  }

  // Sidebar search
  function handleSearch() {
    fetchRecipes();
  }
  function handleShowFavorites() {
    setShowFavorites(s => !s);
  }

  // Render: Authentication first
  if (authLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="auth-app">
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <AuthForm 
          onSubmit={authMode === 'register' ? handleRegister : handleLogin}
          mode={authMode}
          switchMode={() => setAuthMode(m => m === 'login' ? 'register' : 'login')}
        />
      </div>
    );
  }

  // Main app
  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      <div className="app-layout">
        <Sidebar 
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onShowFavorites={handleShowFavorites}
          showFavorites={showFavorites}
        />
        <main className="main-content">
          <div className="toolbar">
            <button className="btn btn-large" onClick={handleAddRecipe}>+ Add Recipe</button>
            <div className="refresh-label">{recLoading ? 'Refreshing...' : ''}</div>
          </div>
          <div className="content-body">
            {showForm ? (
              <RecipeForm
                initialData={isEditing ? selected : null}
                onSave={handleSaveRecipe}
                onCancel={() => setShowForm(false)}
              />
            ) : selected ? (
              <RecipeDetail
                recipe={selected}
                onEdit={handleEditRecipe}
                onDelete={handleDeleteRecipe}
                isOwner={user && selected.author === user.username}
              />
            ) : (
              <div className="recipe-list">
                {recipes.length === 0 && <div className="no-recipes">No recipes found.</div>}
                {recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={handleRecipeClick}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favoriteIds.has(recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
