// src/components/LoadScriptComponent.js

import { LoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';

const LoadScriptComponent = ({ children }) => {
  const googleMapsApiKey ='AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg';

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
      {children}
    </LoadScript>
  );
};

LoadScriptComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoadScriptComponent;
