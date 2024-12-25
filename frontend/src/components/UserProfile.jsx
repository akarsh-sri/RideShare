import  { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, Avatar, Button } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { id } = useParams(); // User ID from URL
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error('Fetch user error:', error.response?.data?.message || error.message);
        toast.error('Failed to fetch user profile');
      }
    };

    fetchUser();
  }, [id, token]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4, minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Paper elevation={3} sx={{ padding: 4, width: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={user.profile.avatar} sx={{ width: 100, height: 100, marginBottom: 2 }} />
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="subtitle1">{user.email}</Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>{user.profile.bio}</Typography>
          <Button variant="contained" component={Link} to={`/chat/${id}`} sx={{ marginTop: 2 }}>
            Chat
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
