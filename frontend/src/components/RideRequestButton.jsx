/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RideRequestButton = ({ rideId }) => {
    const [requested, setRequested] = useState(false);

    const sendRequest = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/rides/${rideId}/request` ,{}, { withCredentials: true });
            
            setRequested(true);
            toast.success('Request sent successfully!');
        } catch (error) {
            toast.error('Failed to send request.');
            console.error('Request error:', error);
        }
    };

    return (
        <button onClick={sendRequest} disabled={requested}>
            {requested ? 'Request Sent' : 'Request Ride'}
        </button>
    );
};

export default RideRequestButton;
