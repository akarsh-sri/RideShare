// src/components/Chat.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, Avatar, CircularProgress, Paper, Typography } from '@mui/material';
import axios from 'axios';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/chatt', { withCredentials: true });
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {users.map((user) => (
              <ListItem key={user._id} component={Link} to={`/chat/${user._id}`} button>
                <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Chat;
