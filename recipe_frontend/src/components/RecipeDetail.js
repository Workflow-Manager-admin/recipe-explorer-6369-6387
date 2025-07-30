import React from 'react';

// PUBLIC_INTERFACE
function RecipeDetail({ recipe, onEdit, onDelete, isOwner }) {
  return (
    <div className="recipe-detail">
      <h2>{recipe.title}</h2>
      <div className="meta-row">
        <span><strong>Cuisine:</strong> {recipe.cuisine}</span>
        <span><strong>Duration:</strong> {recipe.duration} min</span>
        <span><strong>Author:</strong> {recipe.author}</span>
      </div>
      <p className="detail-description">{recipe.description}</p>
      <h4>Ingredients</h4>
      <ul>
        {recipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
      <h4>Instructions</h4>
      <ol>
        {recipe.instructions?.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
      {isOwner &&
        <div className="detail-actions">
          <button className="btn btn-edit" onClick={() => onEdit(recipe)}>Edit</button>
          <button className="btn btn-delete" onClick={() => onDelete(recipe)}>Delete</button>
        </div>
      }
    </div>
  );
}

export default RecipeDetail;
