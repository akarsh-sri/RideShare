import { useState, useContext } from 'react';
import axios from 'axios';
import './Form.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx'; // Assume you have this context

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // Use the AuthContext

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/register/login`, user, { withCredentials: true });
      setIsAuthenticated(true); // Update the auth state
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Log In</h2>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;