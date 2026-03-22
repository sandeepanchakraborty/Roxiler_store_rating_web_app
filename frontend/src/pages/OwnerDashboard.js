import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay',
    backgroundColor: 'rgba(116, 235, 213, 0.5)', // slightly transparent to blend with image
    padding: '2rem 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#34495e',
  },
  container: {
    maxWidth: 800,
    margin: '2rem auto',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // slightly transparent white for contrast
    borderRadius: 12,
    padding: '2rem 2.5rem',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
  },
  storeCard: {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '1rem 1.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#fafafa',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  storeTitle: {
    marginBottom: 6,
    color: '#2c3e50',
  },
  ratingText: {
    marginBottom: 8,
    fontWeight: '600',
  },
  userRating: {
    paddingLeft: 10,
    marginBottom: 10,
    borderLeft: '3px solid #2980b9',
    backgroundColor: '#e8f0fe',
    borderRadius: 4,
  },
  sectionTitle: {
    marginTop: '2rem',
    marginBottom: '1rem',
    fontWeight: '700',
    fontSize: '1.25rem',
    color: '#34495e',
  },
  formGroup: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    borderRadius: 5,
    border: '1.5px solid #ccc',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#2980b9',
    outline: 'none',
  },
  button: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#2980b9',
    color: '#fff',
    fontWeight: '700',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#1f6391',
  },
  message: {
    marginTop: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
};

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [inputFocus, setInputFocus] = useState({ currentPassword: false, newPassword: false });

  useEffect(() => {
    API.get('/ratings/owner')
      .then(res => {
        setStores(res.data);
      })
      .catch(err => {
        console.error('Error fetching ratings:', err);
        setStores([]);
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/users/password', {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={{ color: '#2c3e50' }}>Store Owner Dashboard</h2>

          {stores.length === 0 ? (
            <p>No ratings available.</p>
          ) : (
            stores.map(store => (
              <div key={store.id} style={styles.storeCard}>
                <h3 style={styles.storeTitle}>{store.name}</h3>
                <p style={styles.ratingText}><strong>Average Rating:</strong> ⭐ {store.averageRating}</p>
                <p style={styles.ratingText}><strong>Total Ratings:</strong> {store.totalRatings}</p>

                <div>
                  <h4 style={{ marginBottom: '0.8rem' }}>User Ratings</h4>
                  {store.ratings.length === 0 ? (
                    <p>No ratings yet.</p>
                  ) : (
                    store.ratings.map(r => (
                      <div key={r.id} style={styles.userRating}>
                        <p><strong>User:</strong> {r.user.name} ({r.user.email})</p>
                        <p><strong>Rating:</strong> ⭐ {r.rating}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}

          <hr style={{ margin: '2rem 0' }} />

          <h4 style={styles.sectionTitle}>Change Password</h4>
          <form onSubmit={handlePasswordChange}>
            <div style={styles.formGroup}>
              <label htmlFor="currentPassword" style={styles.label}>Current Password:</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                onFocus={() => setInputFocus({ ...inputFocus, currentPassword: true })}
                onBlur={() => setInputFocus({ ...inputFocus, currentPassword: false })}
                style={{
                  ...styles.input,
                  ...(inputFocus.currentPassword ? styles.inputFocus : {}),
                }}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="newPassword" style={styles.label}>New Password:</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                onFocus={() => setInputFocus({ ...inputFocus, newPassword: true })}
                onBlur={() => setInputFocus({ ...inputFocus, newPassword: false })}
                style={{
                  ...styles.input,
                  ...(inputFocus.newPassword ? styles.inputFocus : {}),
                }}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
            >
              Update Password
            </button>
          </form>

          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </>
  );
}
