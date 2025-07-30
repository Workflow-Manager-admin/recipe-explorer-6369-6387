import React from 'react';

// PUBLIC_INTERFACE
function RecipeCard({ recipe, onClick, onToggleFavorite, isFavorite }) {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-card-header">
        <span className="recipe-title">{recipe.title}</span>
        <button
          className="star-btn"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="recipe-meta">
        <span>{recipe.cuisine}</span>
        <span>{recipe.duration} min</span>
      </div>
      <div className="recipe-description">{recipe.description?.slice(0, 72)}...</div>
    </div>
  );
}

export default RecipeCard;
