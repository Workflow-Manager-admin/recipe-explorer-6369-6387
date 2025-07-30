import React, { useState } from 'react';

// PUBLIC_INTERFACE
function RecipeForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    cuisine: initialData?.cuisine || '',
    duration: initialData?.duration || '',
    description: initialData?.description || '',
    ingredients: initialData?.ingredients?.join('\n') || '',
    instructions: initialData?.instructions?.join('\n') || ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      ingredients: form.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean)
    });
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Recipe' : 'Add Recipe'}</h2>
      <div className="form-row">
        <label>Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required maxLength={64}/>
        </label>
        <label>Cuisine
          <input type="text" name="cuisine" value={form.cuisine} onChange={handleChange} required maxLength={32}/>
        </label>
        <label>Duration (min)
          <input type="number" name="duration" value={form.duration} onChange={handleChange} min={1} max={600} required/>
        </label>
      </div>
      <label>Description
        <textarea name="description" value={form.description} onChange={handleChange} rows={2} required maxLength={256}/>
      </label>
      <label>Ingredients (one per line)
        <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={4} required/>
      </label>
      <label>Instructions (one per line)
        <textarea name="instructions" value={form.instructions} onChange={handleChange} rows={6} required/>
      </label>
      <div className="form-actions">
        <button className="btn btn-save" type="submit">Save</button>
        <button className="btn btn-cancel" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default RecipeForm;
