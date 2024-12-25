// frontend/src/components/Register.jsx

import  { useState } from 'react';
import axios from 'axios';
import './Form.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
  });
  const navigate = useNavigate();

  const { name, email, age, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    axios.post(`http://localhost:5000/api/register/register`, user, { withCredentials: true })
      .then(() => {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      })
      .catch(err => {
        toast.error(err.response.data.message || 'Registration failed.');
      });
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
        </div>
        <div className="input-group">
          <label htmlFor="age">Age:</label>
          <input type="number" name="age" value={age} onChange={onChange} placeholder="Age" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
