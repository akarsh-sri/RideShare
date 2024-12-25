// frontend/src/components/Profile.jsx

import  { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    age: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/register/user`, { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
        setForm({
          name: res.data.user.name,
          age: res.data.user.age,
        });
      })
      .catch(() => {
        toast.error('Unauthorized access. Please log in.');
        navigate('/login');
      });
  }, [navigate]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/register/profile`, form, { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
      })
      .catch(err => {
        toast.error(err.response.data.message || 'Update failed.');
      });
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={user.email} disabled />
        </div>
        <div className="input-group">
          <label htmlFor="age">Age:</label>
          <input type="number" name="age" value={form.age} onChange={onChange} required />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
