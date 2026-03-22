import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const styles = {
  // Background wrapper covers the entire viewport
  backgroundWrapper: {
    minHeight: '100vh',
    backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80)', // Example image URL from Unsplash
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '2rem 0',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background for readability
    borderRadius: 12,
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  heading: {
    color: '#2c3e50',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  section: {
    marginBottom: '2rem',
    padding: '1rem',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  input: {
    flex: '1 1 200px',
    padding: '0.5rem',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    flex: '1 1 220px',
    padding: '0.5rem',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.6rem 1.25rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
    marginLeft: 10,
  },
  listItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filters: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: 4,
    cursor: 'pointer',
    float: 'right',
    marginTop: '-3rem',
  },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [store, setStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [user, setUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [storesList, setStoresList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Filters
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });

  // Fetch stats (only once on mount)
  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Fetch stores with filters
  const fetchStores = useCallback(async () => {
    try {
      const query = new URLSearchParams(storeFilters).toString();
      const res = await API.get(`/admin/stores?${query}`);
      setStoresList(res.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  }, [storeFilters]);

  // Fetch users with filters
  const fetchUsers = useCallback(async () => {
    try {
      const query = new URLSearchParams(userFilters).toString();
      const res = await API.get(`/admin/users?${query}`);
      setUsersList(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [userFilters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      const storePayload = {
        name: store.name,
        address: store.address,
        email: store.email,
      };
      if (store.ownerId) {
        storePayload.ownerId = Number(store.ownerId);
      }
      await API.post('/admin/stores', storePayload);
      alert('Store added successfully!');
      setStore({ name: '', email: '', address: '', ownerId: '' });
      fetchStats();
      fetchStores();
    } catch (error) {
      console.error('Failed to add store:', error);
      alert('Error adding store.');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address,
      role: user.role || 'user',
    };
    try {
      await API.post('/admin/users', userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('User added successfully!');
      setUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchStats();
      fetchUsers();
    } catch (error) {
      console.error('Failed to add user:', error.response?.data || error.message);
      alert(`Error adding user: ${error.response?.data?.error || 'Internal server error'}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchStats();
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Error deleting user.');
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      await API.delete(`/admin/stores/${storeId}`);
      alert('Store deleted successfully');
      fetchStats();
      fetchStores();
    } catch (error) {
      console.error('Failed to delete store:', error);
      alert('Error deleting store.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
  };

  return (
    <>
      <Navbar />
      <div style={styles.backgroundWrapper}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Admin Dashboard</h2>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>

          <div style={styles.stats}>
            <div>Total Users: {stats.users}</div>
            <div>Total Stores: {stats.stores}</div>
            <div>Total Ratings: {stats.ratings}</div>
          </div>

          <section style={styles.section}>
            <h3 style={styles.heading}>Add New Store</h3>
            <form style={styles.form} onSubmit={handleStoreSubmit}>
              <input
                style={styles.input}
                type="text"
                placeholder="Store Name"
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Store Email"
                value={store.email}
                onChange={(e) => setStore({ ...store, email: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Address"
                value={store.address}
                onChange={(e) => setStore({ ...store, address: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Owner User ID (optional)"
                value={store.ownerId}
                onChange={(e) => setStore({ ...store, ownerId: e.target.value })}
              />
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3498db'}
              >
                Add Store
              </button>
            </form>
          </section>

          <section style={styles.section}>
            <h3 style={styles.heading}>Add New User</h3>
            <form style={styles.form} onSubmit={handleUserSubmit}>
              <input
                style={styles.input}
                type="text"
                placeholder="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Address"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                required
              />
              <select
                style={styles.select}
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="store-owner">Store Owner</option>
              </select>
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3498db'}
              >
                Add User
              </button>
            </form>
          </section>

          <section style={styles.section}>
            <h3 style={styles.heading}>Stores</h3>
            <div style={styles.filters}>
              <input
                style={styles.input}
                type="text"
                placeholder="Filter by Name"
                value={storeFilters.name}
                onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Filter by Email"
                value={storeFilters.email}
                onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Filter by Address"
                value={storeFilters.address}
                onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
              />
              <button
                style={{ ...styles.button, flex: '0 0 auto' }}
                onClick={fetchStores}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3498db'}
              >
                Filter Stores
              </button>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {storesList.map((store) => (
                <li key={store.id} style={styles.listItem}>
                  <div>
                    <strong>{store.name}</strong> - {store.email} - {store.address} - Rating: {store.rating || 'N/A'}
                    {store.user && (
                      <>
                        <br />
                        Owner: {store.user.name} ({store.user.email})
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    style={{ ...styles.buttonDanger, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.heading}>Users</h3>
            <div style={styles.filters}>
              <input
                style={styles.input}
                type="text"
                placeholder="Filter by Name"
                value={userFilters.name}
                onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Filter by Email"
                value={userFilters.email}
                onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Filter by Address"
                value={userFilters.address}
                onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
              />
              <select
                style={styles.select}
                value={userFilters.role}
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="store-owner">Store Owner</option>
              </select>
              <button
                style={{ ...styles.button, flex: '0 0 auto' }}
                onClick={fetchUsers}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3498db'}
              >
                Filter Users
              </button>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {usersList.map((user) => (
                <li key={user.id} style={styles.listItem}>
                  <div>
                    <strong>{user.name}</strong> - {user.email} - {user.address} - Role: {user.role}
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ ...styles.buttonDanger, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
