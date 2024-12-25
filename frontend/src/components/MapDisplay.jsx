// src/components/MapDisplay.js
import  { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const MapDisplay = ({ initialLocation, finalLocation, pathSubmitted }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const initialMarker = useRef(null);
  const finalMarker = useRef(null);
  const travelPath = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.google) {
        console.error('Google Maps API not loaded.');
        return;
      }

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 37.1, lng: -95.7 }, // Center of USA
        disableDefaultUI: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
        ],
      });
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers and paths
    if (initialMarker.current) initialMarker.current.setMap(null);
    if (finalMarker.current) finalMarker.current.setMap(null);
    if (travelPath.current) travelPath.current.setMap(null);

    // Add Initial Marker
    if (initialLocation) {
      initialMarker.current = new window.google.maps.Marker({
        map: mapInstance.current,
        position: initialLocation,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        title: 'Initial Location',
      });
    }

    // Add Final Marker
    if (finalLocation) {
      finalMarker.current = new window.google.maps.Marker({
        map: mapInstance.current,
        position: finalLocation,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        title: 'Final Location',
      });
    }

    // Draw Path if Submitted
    if (pathSubmitted && initialLocation && finalLocation) {
      travelPath.current = new window.google.maps.Polyline({
        path: [initialLocation, finalLocation],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: mapInstance.current,
      });

      // Adjust map bounds to fit markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(initialLocation);
      bounds.extend(finalLocation);
      mapInstance.current.fitBounds(bounds);
    }
  }, [initialLocation, finalLocation, pathSubmitted]);

  return (
    <Box
      ref={mapRef}
      sx={{
        height: { xs: '300px', md: '500px' },
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
      }}
    />
  );
};

MapDisplay.propTypes = {
  initialLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  finalLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  pathSubmitted: PropTypes.bool.isRequired,
};

MapDisplay.defaultProps = {
  initialLocation: null,
  finalLocation: null,
};

export default MapDisplay;
