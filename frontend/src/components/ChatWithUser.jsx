// src/components/ChatWithUser.js
import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import ReplyIcon from '@mui/icons-material/Reply'; // Import the reply icon

const socket = io('http://localhost:5000', { withCredentials: true });

const ChatWithUser = () => {
  const { userId } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [userBio, setUserBio] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // State to hold the message being replied to
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to view this page.');
      return;
    }

    const fetchUserBio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/user/${userId}`, { withCredentials: true });
        setUserBio(res.data);
      } catch (error) {
        console.error('Error fetching user bio:', error);
        toast.error('Failed to load user bio.');
      }
    };

    const createOrGetChat = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/chat/create-or-get', { recipientId: userId }, { withCredentials: true });
        setChatId(res.data._id);
        socket.emit('joinChat', res.data._id);
      } catch (error) {
        console.error('Error creating/getting chat:', error);
        toast.error('Failed to create or get chat.');
      }
    };

    fetchUserBio();
    createOrGetChat();

    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${chatId}/messages`, { withCredentials: true });
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (chatId) {
        socket.emit('leaveChat', chatId);
      }
    };
  }, [isAuthenticated, userId, chatId]);

  useEffect(() => {
    if (chatId) {
      socket.on('messageReceived', (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });
    }

    return () => {
      socket.off('messageReceived');
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    try {
      // Send the message with reply info if there is any
      const messageData = {
        text: input,
        replyTo: replyingTo ? replyingTo._id : null, // Include replyTo message ID if replying
      };

      const res = await axios.post(`http://localhost:5000/api/chat/${chatId}/messages`, messageData, { withCredentials: true });
      socket.emit('sendMessage', { chatId, sender: user._id, text: res.data.text, replyTo: res.data.replyTo });

      setInput('');
      setReplyingTo(null); // Clear the reply state after sending
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
    }
  };

  // Function to set a message as being replied to
  const handleReply = (message) => {
    setReplyingTo(message);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        {userBio ? (
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 ,backgroundColor:'#aaa'}}>
            <Avatar>{userBio.name.charAt(0).toUpperCase()}</Avatar>
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="h5">{userBio.name}</Typography>
              <Typography variant="subtitle1">{userBio.email}</Typography>
            </Box>
          </Box>
        ) : (
          <CircularProgress />
        )}

        <Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                    marginBottom: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: msg.sender._id === user._id ? '#1976d2' : '#e0e0e0',
                      color: msg.sender._id === user._id ? '#fff' : '#000',
                      padding: 1,
                      borderRadius: 2,
                    }}
                  >
                    {/* If the message is a reply, display the original message */}
                    {msg.replyTo && (
                      <Typography variant="caption" sx={{ fontStyle: 'italic', marginBottom: 1 }}>
                        Replying to: {msg.replyTo.text}
                      </Typography>
                    )}
                    <Typography>{msg.text}</Typography>
                    <Typography variant="caption" align="right" display="block">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                    <IconButton size="small" onClick={() => handleReply(msg)}>
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          )}

          {/* If replying to a message, display the message being replied to */}
          {replyingTo && (
            <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2, marginBottom: 2 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Replying to: {replyingTo.text}
              </Typography>
              <Button size="small" onClick={() => setReplyingTo(null)}>
                Cancel Reply
              </Button>
            </Box>
          )}

          <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: 2 }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatWithUser;
