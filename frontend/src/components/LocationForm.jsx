// src/components/LocationForm.js
import  { useRef, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationForm = ({ onUpdateLocation }) => {
  const initialInputRef = useRef(null);
  const finalInputRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsAutocomplete = (inputRef, locationType) => {
      if (!window.google) {
        console.error('Google Maps API not loaded.');
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.error(`No details available for input: '${place.name}'`);
          alert('No details available for the entered location.');
          return;
        }

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        onUpdateLocation(location, locationType);
      });
    };

    loadGoogleMapsAutocomplete(initialInputRef, 'initial');
    loadGoogleMapsAutocomplete(finalInputRef, 'final');
  }, [onUpdateLocation]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" color="#007BFF">
        <FaMapMarkerAlt /> Initial Location
      </Typography>
      <TextField
        id="initial-location"
        label="Enter Initial Location"
        variant="outlined"
        inputRef={initialInputRef}
        required
      />
      <Typography variant="h6" color="#007BFF">
        <FaMapMarkerAlt /> Final Location
      </Typography>
      <TextField
        id="final-location"
        label="Enter Final Location"
        variant="outlined"
        inputRef={finalInputRef}
        required
      />
    </Box>
  );
};

LocationForm.propTypes = {
  onUpdateLocation: PropTypes.func.isRequired,
};

export default LocationForm;
