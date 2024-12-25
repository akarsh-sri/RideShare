import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Ensure correct path
import { Link } from 'react-router-dom';
import './Notification.css'; // Import the CSS file

function Notifications() {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) { // Ensure user and user._id exist
      fetchNotifications(user._id);
    } else {
      setLoading(false);
      console.error('User ID is undefined');
    }
  }, [user]);

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`, { withCredentials: true });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p className='no'>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <p>{notification.text}</p>
            <Link to={`/rides/${notification.rideId}/details`}>View</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;