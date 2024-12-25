/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import MapVisualization from './MapVisualization'; // Assuming this component exists

const MatchedRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [initialLocation, setInitialLocation] = useState(null);
  const [finalLocation, setFinalLocation] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [matchedRides, setMatchedRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchMatchedRoutes = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to fetch matched rides.');
      return;
    }

    if (!initialLocation || !finalLocation || !selectedDateTime) {
      toast.error('Please provide all required fields.');
      return;
    }

    setLoading(true);
    const payload = {
      initialLocation2: initialLocation,
      finalLocation2: finalLocation,
      startTime2: new Date(selectedDateTime).toISOString(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/find-matching-rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMatchedRides(data);
      toast.success('Matched rides fetched successfully!');
    } catch (error) {
      console.error('Error fetching matched rides:', error.message);
      toast.error('Failed to fetch matched rides: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This effect could be triggered by changes in initialLocation, finalLocation, or selectedDateTime.
    if (initialLocation && finalLocation && selectedDateTime) {
      handleFetchMatchedRoutes();
    }
  }, [initialLocation, finalLocation, selectedDateTime]);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom color="#20c997">
        Matched Routes
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={handleFetchMatchedRoutes}>
          Fetch Matched Rides
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {matchedRides.length > 0 ? (
            matchedRides.map((ride, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                <ListItemText
                  primary={`Ride from ${ride.initialLocation.name} to ${ride.finalLocation.name}`}
                  secondary={`User: ${ride.name}, Email: ${ride.email}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" align="center">
              No matched rides found.
            </Typography>
          )}
        </List>
      )}

      {matchedRides.length > 0 && (
        <MapVisualization
          start={initialLocation}
          end={finalLocation}
          matchedRides={matchedRides} // Pass matched rides for visualization
        />
      )}
    </Box>
  );
};

export default MatchedRoutes;
