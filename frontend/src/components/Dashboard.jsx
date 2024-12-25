// frontend/src/components/Dashboard.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/register/user`, { withCredentials: true })
      .then(res => {
        const userData = res.data.user;
        setUser(res.data.user);
        sessionStorage.setItem('userName', userData.name);
        sessionStorage.setItem('userEmail', userData.email);
      })
      .catch(() => {
        toast.error('Please log in to access the dashboard.');
        navigate('/login');
      });
  }, [navigate]);

  if (!user) return <h2>Loading...</h2>;


  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}!</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <div className="dashboard-links">
        <Link to="/profile" className="dashboard-link">Edit Profile</Link>
        <Link to="/chat" className="dashboard-link">Go to Chat</Link>
      </div>
    </div>
  );
}

export default Dashboard;
