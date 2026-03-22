import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    position: 'relative',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage:
      "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    width: 360,
    padding: '2rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  heading: {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#34495e',
    fontWeight: '700',
    fontSize: '1.8rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    marginBottom: '1rem',
    borderRadius: 4,
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#2980b9',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#2980b9',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#1f6391',
  },
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [inputFocus, setInputFocus] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      const role = res.data.role?.toLowerCase().trim();
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', role);

      if (role === 'admin') navigate('/admin');
      else if (role === 'owner') navigate('/owner');
      else navigate('/user');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.overlay} />
      <form onSubmit={handleSubmit} style={styles.container} noValidate>
        <h2 style={styles.heading}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, email: true })}
          onBlur={() => setInputFocus({ ...inputFocus, email: false })}
          style={{
            ...styles.input,
            ...(inputFocus.email ? styles.inputFocus : {}),
          }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, password: true })}
          onBlur={() => setInputFocus({ ...inputFocus, password: false })}
          style={{
            ...styles.input,
            ...(inputFocus.password ? styles.inputFocus : {}),
          }}
          required
        />

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          Login
        </button>
      </form>
    </div>
  );
}
