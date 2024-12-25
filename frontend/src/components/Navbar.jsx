// src/components/Navbar.jsx
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa'; // Import the bell icon

function Navbar() {
    const [user, setUser] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0); // State for notification count
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotificationCount();
        }
    }, [user]);

    const fetchUserData = () => {
        axios.get('http://localhost:5000/api/register/user', { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
            })
            .catch(() => {
                setUser(null);
            });
    };

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/notifications/${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on how you store tokens
                },
                withCredentials: true,
            });
            setNotificationCount(response.data.length); // Assuming all fetched notifications are pending
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications.');
        }
    };

    const handleLogout = () => {
        axios.post('http://localhost:5000/api/register/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                toast.success('Logged out successfully!');
                setIsAuthenticated(false);
                navigate('/');
            })
            .catch(err => {
                console.error('Logout error:', err);
                toast.error('Error logging out. Please try again.');
            });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Add this function to force a re-fetch of user data
    const refreshUserData = () => {
        fetchUserData();
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" onClick={closeMenu}>
                    <div className='imgg'>
                        <img src="./img.png" alt="RideShareBuddy Logo" className="logo-image" />
                    </div>
                    <span className="logo-text">
                        <span>R</span>ide<span>S</span><span className="share">hare</span><span>B</span>uddy
                    </span>
                </Link>
            </div>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                        <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
                        <li><Link to="/chat" onClick={closeMenu}>Chat</Link></li>
                        <li>
                            <Link to="/notifications" onClick={closeMenu} className="notification-link">
                                <FaBell className="notification-icon" />
                                {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => { handleLogout(); closeMenu(); }}
                                className="nav-button"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/register" onClick={closeMenu}>
                                <button className="nav-button">Register</button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" onClick={() => { closeMenu(); refreshUserData(); }}>
                                <button className="nav-button">Login</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
            {/* Hamburger Menu */}
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </nav>
    );
}

export default Navbar;
