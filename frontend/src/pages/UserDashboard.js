import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    // Background image with center, cover, and fixed for a nice parallax effect
    backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    padding: '3rem 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#2c3e50',
  },
  // Overlay to darken background for readability
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '1rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    position: 'relative',
    zIndex: 1,
  },
  messageBox: {
    backgroundColor: '#d0e7ff',
    color: '#1b3b7a',
    padding: '10px 15px',
    borderRadius: 6,
    marginBottom: '1rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  storeCard: {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: '1rem 1.2rem',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  },
  storeTitle: {
    margin: 0,
    color: '#2980b9',
  },
  storeInfo: {
    margin: '0.25rem 0',
    fontSize: '0.9rem',
    color: '#555',
  },
  input: {
    width: 70,
    padding: '6px 10px',
    marginRight: '10px',
    borderRadius: 6,
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#2980b9',
  },
  button: {
    padding: '7px 15px',
    backgroundColor: '#2980b9',
    border: 'none',
    borderRadius: 6,
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonDisabled: {
    backgroundColor: '#6c9ccf',
    cursor: 'not-allowed',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#34495e',
  },
  loadingText: {
    textAlign: 'center',
    color: '#2980b9',
    fontWeight: '600',
  },
};

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [inputRatings, setInputRatings] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStoresAndRatings = async () => {
      try {
        const [storesRes, ratingsRes] = await Promise.all([
          API.get('/stores', { headers: { Authorization: `Bearer ${token}` } }),
          API.get('/ratings/user', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStores(storesRes.data);

        const ratingsMap = {};
        ratingsRes.data.forEach(r => {
          ratingsMap[r.StoreId] = r.rating;
        });
        setUserRatings(ratingsMap);
        setInputRatings(ratingsMap);
      } catch (err) {
        console.error('Error loading data:', err);
        setStores([]);
      }
    };

    fetchStoresAndRatings();
  }, [token]);

  const rateStore = async storeId => {
    const ratingValue = inputRatings[storeId];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Please enter a rating between 1 and 5.');
      return;
    }
    setLoading(true);
    try {
      await API.post(
        '/ratings',
        { storeId, rating: Number(ratingValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ratingsRes = await API.get('/ratings/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ratingsMap = {};
      ratingsRes.data.forEach(r => {
        ratingsMap[r.StoreId] = r.rating;
      });
      setUserRatings(ratingsMap);
      setInputRatings(ratingsMap);

      setMessage('Rating submitted!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Rating failed:', err);
      setMessage('Rating failed. Try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.pageWrapper}>
        <div style={styles.overlay} />
        <div style={styles.container}>
          <h2 style={styles.heading}>User Dashboard</h2>
          {message && <div style={styles.messageBox}>{message}</div>}
          {loading && <p style={styles.loadingText}>Submitting rating...</p>}
          {stores.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>
              No stores found. Please try again later or contact admin.
            </p>
          ) : (
            stores.map(store => (
              <div key={store.id} style={styles.storeCard}>
                <h3 style={styles.storeTitle}>{store.name}</h3>
                <p style={styles.storeInfo}>{store.address}</p>
                <p style={styles.storeInfo}>
                  Average Rating: {store.averageRating ? `⭐ ${store.averageRating}` : 'No ratings yet'}
                </p>
                <p style={styles.storeInfo}>
                  Your Rating: {userRatings[store.id] ? `⭐ ${userRatings[store.id]}` : 'Not rated'}
                </p>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={inputRatings[store.id] || ''}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    setInputRatings(prev => ({ ...prev, [store.id]: val }));
                  }}
                  onFocus={() => setInputFocus({ ...inputFocus, [store.id]: true })}
                  onBlur={() => setInputFocus({ ...inputFocus, [store.id]: false })}
                  style={{
                    ...styles.input,
                    ...(inputFocus[store.id] ? styles.inputFocus : {}),
                  }}
                  disabled={loading}
                />
                <button
                  onClick={() => rateStore(store.id)}
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...(loading ? styles.buttonDisabled : {}),
                  }}
                >
                  Submit Rating
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
