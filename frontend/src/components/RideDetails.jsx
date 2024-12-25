import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RideDetails.css'; // Import the CSS file

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

const RideDetails = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startLocationName, setStartLocationName] = useState('');
  const [endLocationName, setEndLocationName] = useState('');

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rides/${rideId}`, {
          withCredentials: true,
        });
        setRide(response.data);

        // Fetch the readable location names for initial and final locations
        const initialLocationName = await reverseGeocode(response.data.initialLocation.lat, response.data.initialLocation.lng);
        const finalLocationName = await reverseGeocode(response.data.finalLocation.lat, response.data.finalLocation.lng);
        setStartLocationName(initialLocationName);
        setEndLocationName(finalLocationName);

        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch ride details.');
        console.error('Error fetching ride details:', error);
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const handleDecision = async (userId, decision) => {
    try {
      await axios.post(
        `http://localhost:5000/api/rides/${rideId}/handle-decision`,
        { userId, decision },
        { withCredentials: true }
      );
      setRide((prevRide) => ({
        ...prevRide,
        bookedBy: prevRide.bookedBy.map((booking) =>
          booking.user._id === userId ? { ...booking, status: decision } : booking
        ),
      }));
      toast.success(`Request ${decision}.`);
    } catch (error) {
      toast.error(`Failed to ${decision} request.`);
      console.error('Decision error:', error);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  if (!ride) return <p className="not-found">Ride not found.</p>;

  return (
    <div className="ride-details-container">
      <h1>Ride Details</h1>
      <h2>{ride.name} - {ride.status}</h2>
      <p>Host: {ride.userId.username} ({ride.userId.email})</p>
      <p>Start Time: {new Date(ride.startTime).toLocaleString()}</p>
      <p>From: {startLocationName || 'Loading location...'}</p>
      <p>To: {endLocationName || 'Loading location...'}</p>
      <h3>Booked By:</h3>
      <ul>
        {ride.bookedBy.map((booking) => (
          <li key={booking.user._id} className="booking-item">
            <p>User: {booking.user.username} ({booking.user.email})</p>
            <p>Status: {booking.status}</p>
            {booking.status === 'pending' && (
              <div>
                <button onClick={() => handleDecision(booking.user._id, 'accepted')}>Accept</button>
                <button onClick={() => handleDecision(booking.user._id, 'rejected')}>Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RideDetails;




// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './RideDetails.css'; // Import the CSS file

// const RideDetails = () => {
//     const { rideId } = useParams();
//     const [ride, setRide] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchRideDetails = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/rides/${rideId}`, {
//                     withCredentials: true,
//                 });
//                 setRide(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 toast.error('Failed to fetch ride details.');
//                 console.error('Error fetching ride details:', error);
//                 setLoading(false);
//             }
//         };
//         fetchRideDetails();
//     }, [rideId]);

//     const handleDecision = async (userId, decision) => {
//         try {
//             await axios.post(
//                 `http://localhost:5000/api/rides/${rideId}/handle-decision`,
//                 { userId, decision },
//                 { withCredentials: true }
//             );
//             setRide((prevRide) => ({
//                 ...prevRide,
//                 bookedBy: prevRide.bookedBy.map((booking) =>
//                     booking.user._id === userId ? { ...booking, status: decision } : booking
//                 ),
//             }));
//             toast.success(`Request ${decision}.`);
//         } catch (error) {
//             toast.error(`Failed to ${decision} request.`);
//             console.error('Decision error:', error);
//         }
//     };

//     if (loading) return <p className="loading">Loading...</p>;

//     if (!ride) return <p className="not-found">Ride not found.</p>;

//     return (
//         <div className="ride-details-container">
//             <h1>Ride Details</h1>
//             <h2>{ride.name} - {ride.status}</h2>
//             <p>Host: {ride.userId.username} ({ride.userId.email})</p>
//             <p>Start Time: {new Date(ride.startTime).toLocaleString()}</p>
//             <p>From: {ride.initialLocation.lat}, {ride.initialLocation.lng}</p>
//             <p>To: {ride.finalLocation.lat}, {ride.finalLocation.lng}</p>
//             <h3>Booked By:</h3>
//             <ul>
//                 {ride.bookedBy.map((booking) => (
//                     <li key={booking.user._id} className="booking-item">
//                         <p>User: {booking.user.username} ({booking.user.email})</p>
//                         <p>Status: {booking.status}</p>
//                         {booking.status === 'pending' && (
//                             <div>
//                                 <button onClick={() => handleDecision(booking.user._id, 'accepted')}>Accept</button>
//                                 <button onClick={() => handleDecision(booking.user._id, 'rejected')}>Reject</button>
//                             </div>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default RideDetails;