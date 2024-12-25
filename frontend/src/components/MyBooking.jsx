import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Ensure correct path
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';
import './MyBookings.css'; // Import the CSS file

const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.display_name || `${lat}, ${lng}`;
  } catch (error) {
    console.error('Error during Nominatim geocoding:', error.message);
    toast.error('Error retrieving address: ' + error.message);
    return `${lat}, ${lng}`; // Fallback to coordinates
  }
};

const MyBookings = () => {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides user info
  const [bookings, setBookings] = useState([]);
  const [locationNames, setLocationNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user._id) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/user/${user._id}`, {
          withCredentials: true, // If needed
        });
        setBookings(response.data);

        // Fetch location names for each booking
        const locationPromises = response.data.map(async (booking) => {
          const initialLocationName = await reverseGeocode(booking.initialLocation.lat, booking.initialLocation.lng);
          const finalLocationName = await reverseGeocode(booking.finalLocation.lat, booking.finalLocation.lng);
          return { rideId: booking.rideId, initialLocationName, finalLocationName };
        });

        const resolvedLocations = await Promise.all(locationPromises);
        const locationMap = {};
        resolvedLocations.forEach(({ rideId, initialLocationName, finalLocationName }) => {
          locationMap[rideId] = { initialLocationName, finalLocationName };
        });
        setLocationNames(locationMap);

      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Handler to remove booking when countdown is complete
  const handleCountdownComplete = (rideId) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking.rideId !== rideId));
    toast.info('Ride has started and booking has been removed.');
  };

  if (loading) {
    return <div className="my-bookings-container"><p>Loading your bookings...</p></div>;
  }

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <div className='ab'>
            <p className='no'>You have no bookings
            </p>
        </div>
        
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.rideId} className={`booking-card ${booking.status}`}>
              <h3>{booking.rideName}</h3>
              <p><strong>Host:</strong> {booking.host.username} ({booking.host.email})</p>
              <p><strong>From:</strong> {locationNames[booking.rideId]?.initialLocationName || 'Loading location...'}</p>
              <p><strong>To:</strong> {locationNames[booking.rideId]?.finalLocationName || 'Loading location...'}</p>
              <p><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
              {booking.status === 'accepted' && (
                <div className="countdown">
                  <strong>Time Remaining:</strong>
                  <Countdown
                    date={new Date(booking.startTime)}
                    onComplete={() => handleCountdownComplete(booking.rideId)}
                    renderer={({ hours, minutes, seconds, completed }) => {
                      if (completed) {
                        return <span>Ride has started!</span>;
                      } else {
                        return <span>{hours}h {minutes}m {seconds}s</span>;
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;




// // frontend/src/components/MyBookings.jsx
// import  { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext'; // Ensure correct path
// import { toast } from 'react-toastify';
// import Countdown from 'react-countdown';
// import './MyBookings.css'; // Import the CSS file

// const MyBookings = () => {
//     const { user } = useContext(AuthContext); // Assuming AuthContext provides user info
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             if (!user || !user._id) {
//                 toast.error('User not authenticated.');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.get(`http://localhost:5000/api/bookings/user/${user._id}`, {
//                     withCredentials: true, // If needed
//                 });
//                 setBookings(response.data);
//             } catch (error) {
//                 console.error('Error fetching bookings:', error);
//                 toast.error('Failed to fetch bookings.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, [user]);

//     // Handler to remove booking when countdown is complete
//     const handleCountdownComplete = (rideId) => {
//         setBookings(prevBookings => prevBookings.filter(booking => booking.rideId !== rideId));
//         toast.info('Ride has started and booking has been removed.');
//     };

//     if (loading) {
//         return <div className="my-bookings-container"><p>Loading your bookings...</p></div>;
//     }

//     return (
//         <div className="my-bookings-container">
//             <h2>My Bookings</h2>
//             {bookings.length === 0 ? (
//                 <p>You have no bookings.</p>
//             ) : (
//                 <div className="bookings-list">
//                     {bookings.map(booking => (
//                         <div key={booking.rideId} className={`booking-card ${booking.status}`}>
//                             <h3>{booking.rideName}</h3>
//                             <p><strong>Host:</strong> {booking.host.username} ({booking.host.email})</p>
//                             <p><strong>From:</strong> Lat: {booking.initialLocation.lat}, Lng: {booking.initialLocation.lng}</p>
//                             <p><strong>To:</strong> Lat: {booking.finalLocation.lat}, Lng: {booking.finalLocation.lng}</p>
//                             <p><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
//                             {booking.status === 'accepted' && (
//                                 <div className="countdown">
//                                     <strong>Time Remaining:</strong>
//                                     <Countdown
//                                         date={new Date(booking.startTime)}
//                                         onComplete={() => handleCountdownComplete(booking.rideId)}
//                                         renderer={({ hours, minutes, seconds, completed }) => {
//                                             if (completed) {
//                                                 return <span>Ride has started!</span>;
//                                             } else {
//                                                 return <span>{hours}h {minutes}m {seconds}s</span>;
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyBookings;
