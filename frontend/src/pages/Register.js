import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    position: 'relative',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundImage:
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black overlay
    zIndex: 0,
  },
  formContainer: {
    position: 'relative',
    width: 400,
    padding: '2rem',
    borderRadius: 12,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'rgba(253, 253, 253, 0.95)', // slightly transparent white
    color: '#34495e',
    zIndex: 1,
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#2c3e50',
    fontSize: '1.8rem',
    fontWeight: '700',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    borderRadius: 5,
    border: '1.5px solid #ccc',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#2980b9',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    fontSize: '1rem',
    borderRadius: 5,
    border: '1.5px solid #ccc',
    marginBottom: '1.5rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '0.7rem',
    backgroundColor: '#2980b9',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#1f6391',
  },
};

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });

  const [inputFocus, setInputFocus] = useState({
    name: false,
    email: false,
    address: false,
    password: false,
    role: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.trim().length < 2) {
      return alert('Name must be at least 2 characters long.');
    }

    try {
      const payload = { ...form, role: form.role.toLowerCase().trim() };
      await API.post('/auth/register', payload);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert('Registration failed: ' + msg);
      console.error('Registration error:', err.response?.data || err);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.overlay} />
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <h2 style={styles.heading}>Register</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, name: true })}
          onBlur={() => setInputFocus({ ...inputFocus, name: false })}
          style={{ ...styles.input, ...(inputFocus.name ? styles.inputFocus : {}) }}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, email: true })}
          onBlur={() => setInputFocus({ ...inputFocus, email: false })}
          style={{ ...styles.input, ...(inputFocus.email ? styles.inputFocus : {}) }}
          required
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, address: true })}
          onBlur={() => setInputFocus({ ...inputFocus, address: false })}
          style={{ ...styles.input, ...(inputFocus.address ? styles.inputFocus : {}) }}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, password: true })}
          onBlur={() => setInputFocus({ ...inputFocus, password: false })}
          style={{ ...styles.input, ...(inputFocus.password ? styles.inputFocus : {}) }}
          required
        />
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          onFocus={() => setInputFocus({ ...inputFocus, role: true })}
          onBlur={() => setInputFocus({ ...inputFocus, role: false })}
          style={{ ...styles.select, ...(inputFocus.role ? styles.inputFocus : {}) }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          Register
        </button>
      </form>
    </div>
  );
}
