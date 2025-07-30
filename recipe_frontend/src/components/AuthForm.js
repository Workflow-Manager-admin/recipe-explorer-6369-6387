import React, { useState } from 'react';

// PUBLIC_INTERFACE
function AuthForm({ onSubmit, mode, switchMode }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.username.length < 3 || form.password.length < 6) {
      setError('Username must be ≥ 3 chars and password ≥ 6 chars.');
      return;
    }
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Error');
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} autoFocus required minLength={3}/>
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6}/>
      {error && <div className="error">{error}</div>}
      <button className="btn btn-auth" type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
      <button className="switch-auth" type="button" onClick={switchMode}>
        {mode === 'register' ? 'Already have an account? Login' : 'No account? Register'}
      </button>
    </form>
  );
}

export default AuthForm;
