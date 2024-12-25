/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapVisualization = ({ start, end }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const map = L.map('map').setView([start.lat, start.lng], 14);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Function to fetch the route data from your API
    const handleFetchRoute = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/path/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            
          },
          
            credentials: 'include',
          body: JSON.stringify({ start, end }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setRoute(data.route);
        drawRouteOnMap(data.route, map);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    // Call the fetch route function
    handleFetchRoute();

    // Add markers for the start and end locations
    const startMarker = L.marker([start.lat, start.lng]).addTo(map);
    const endMarker = L.marker([end.lat, end.lng]).addTo(map);

    // Fit map to bounds of start and end points
    const bounds = L.latLngBounds([start.lat, start.lng], [end.lat, end.lng]);
    map.fitBounds(bounds);

    return () => {
      map.remove(); // Cleanup map when component is unmounted
    };
  }, [start, end]);

  // Function to draw the route on the map
  const drawRouteOnMap = (route, map) => {
    const latLngs = route.map(point => [point.lat, point.lng]);
    L.polyline(latLngs, { color: 'blue' }).addTo(map);

    // Add small dots for each coordinate
    route.forEach(point => {
      L.circleMarker([point.lat, point.lng], {
        radius: 3,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1
      }).addTo(map);
    });

    // Adjust the view to fit all markers
    map.fitBounds(latLngs);
  };

  return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default MapVisualization;
