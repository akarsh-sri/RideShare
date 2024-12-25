/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// src/components/LandingPage.jsx
import React, { useContext } from 'react';
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaWallet, FaCalendarCheck, FaThumbsUp } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import MyBookings from './MyBooking'; // Import the MyBookings component

function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext); // Access authentication status

    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleSignupClick = () => {
        navigate("/register");
    }

    const handleBookRideClick = () => {
        navigate("/book-ride");
    }

    const handleSearchRide = () => {
        navigate("/search-ride");
    }

    const handleMyBookingsClick = () => {
        navigate("/my-bookings");
    }

    return (
        <div className="page-container">
            <section className="intro-section">
                <div className="intro-hero">
                    <motion.h1
                        className="intro-title"
                        initial={{ y: -250 }}
                        animate={{ y: -10 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        Welcome to Share-Ride – Journey Together, Save Together
                    </motion.h1>
                    <motion.p
                        className="intro-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        A smarter way to travel. Connect with co-travelers, reduce your
                        travel costs, and enjoy the journey together!
                    </motion.p>
                    <div className="intro-buttons">
                        <motion.button
                            className="intro-button primary"
                            onClick={handleBookRideClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Your Journey
                        </motion.button>
                        {!isAuthenticated && (
                            <motion.button
                                className="intro-button secondary"
                                onClick={handleSignupClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Join Now
                            </motion.button>
                        )}

                        {isAuthenticated && (
                            <motion.button
                                className="intro-button primary"
                                onClick={handleSearchRide}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Search for Rides
                            </motion.button>
                        )}

                        {isAuthenticated && (
                            <motion.button
                                className="intro-button secondary"
                                onClick={handleMyBookingsClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                My Bookings
                            </motion.button>
                        )}

                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2 className="features-title">Why Choose Share-Ride?</h2>
                <div className="features-grid">
                    <motion.div
                        className="feature-item"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaWallet className="feature-icon" />
                        <h3>Cost-Saving</h3>
                        <p>
                            Reduce your travel expenses by sharing the cost with
                            co-travelers heading to the same destination.
                        </p>
                    </motion.div>
                    <motion.div
                        className="feature-item"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaCalendarCheck className="feature-icon" />
                        <h3>Flexible Options</h3>
                        <p>
                            Post a journey or join an existing one – whatever suits your
                            travel plans best.
                        </p>
                    </motion.div>
                    <motion.div
                        className="feature-item"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaThumbsUp className="feature-icon" />
                        <h3>Effortless Booking</h3>
                        <p>
                            Quickly browse available rides or post your trip details. It’s
                            simple and easy.
                        </p>
                    </motion.div>
                    <motion.div
                        className="feature-item"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaUserFriends className="feature-icon" />
                        <h3>Seamless Connections</h3>
                        <p>
                            Find travelers heading to the same place, ensuring a smooth and
                            shared experience.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="statistics-section">
                <div className="statistics-container">
                    <div className="stat-item">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Happy Travelers</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Cities Connected</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1M+</span>
                        <span className="stat-label">Rides Shared</span>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <h2 className="testimonials-title">What Our Users Say</h2>
                <div className="testimonials-grid">
                    <motion.div
                        className="testimonial-item"
                        whileHover={{ scale: 1.02 }}
                    >
                        <p>&ldquo;Share-Ride has transformed the way I travel. It's affordable and I’ve made so many new friends!"</p>
                        <h4>- Alex Johnson</h4>
                    </motion.div>
                    <motion.div
                        className="testimonial-item"
                        whileHover={{ scale: 1.02 }}
                    >
                        <p>"Booking a ride is so effortless. I love the flexibility and the seamless connections."</p>
                        <h4>- Maria Smith</h4>
                    </motion.div>
                    <motion.div
                        className="testimonial-item"
                        whileHover={{ scale: 1.02 }}
                    >
                        <p>"The cost-saving aspect is unbeatable. Share-Ride makes traveling economical and enjoyable."</p>
                        <h4>- Liam Brown</h4>
                    </motion.div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Share Your Next Ride?</h2>
                <p>
                    Sign up now and join the Share-Ride community to start saving on
                    your travel costs!
                </p>
                <div className="cta-buttons">
                    {!isAuthenticated && (
                        <motion.button
                            className="cta-button primary"
                            onClick={handleSignupClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Join Share-Ride
                        </motion.button>
                    )}
                    <motion.button
                        className="cta-button secondary"
                        onClick={handleLoginClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Learn More
                    </motion.button>
                </div>
            </section>

            {isAuthenticated && <MyBookings />} {/* Conditionally render MyBookings */}
        </div>
    )
}

export default LandingPage;
