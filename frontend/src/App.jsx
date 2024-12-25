import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Home from './components/Home';
import SearchRide from './components/SearchRide';
import Chat from './components/Chat';
import LandingPage from './components/LandingPage';
import BookRide from './components/BookRide';
import ChatWithUser from './components/ChatWithUser'; // Import ChatWithUser component
import Notifications from './components/Notifications'; // Ensure this is created
import RideDetails from './components/RideDetails'; // Ensure this is created
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadScriptComponent from './components/LoadScriptComponent'; // Import the LoadScriptComponent
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MyBookings from './components/MyBooking';
function App() {
    return (
        <>
            <AuthProvider>
                <LoadScriptComponent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Router>
                            <div className="app-container">
                                <Navbar />
                                <ToastContainer position="top-right" autoClose={3000} />
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/notifications" element={<Notifications />} />
                                    <Route path="/home" element={<Home />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/book-ride" element={<BookRide />} />
                                    <Route path="/search-ride" element={<SearchRide />} />
                                    <Route path="/chat" element={<Chat />} />
                                    <Route path="/chat/:userId" element={<ChatWithUser />} />
                                    <Route path="/rides/:rideId/details" element={<RideDetails />} />
                                    <Route path="/ride/:rideId" element={<RideDetails />} />
                                    <Route path="/my-bookings" element={<MyBookings />} />
                                </Routes>
                                <Footer />
                            </div>
                        </Router>
                    </LocalizationProvider>
                </LoadScriptComponent>
            </AuthProvider>
        </>
    );
}

export default App;
