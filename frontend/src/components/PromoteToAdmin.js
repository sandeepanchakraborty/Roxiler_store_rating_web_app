import React, { useState } from 'react';
import API from '../services/api';

export default function PromoteToAdmin() {
  const [email, setEmail] = useState('');

  const makeAdmin = async () => {
    try {
      await API.put('/admin/make-admin', { email });
      alert(`${email} promoted to admin.`);
      setEmail('');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h3>Promote User to Admin</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="User Email"
        required
      />
      <button onClick={makeAdmin}>Make Admin</button>
    </div>
  );
}
