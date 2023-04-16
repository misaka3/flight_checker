import * as React from 'react';
import Map from 'react-map-gl';

function App() {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MapboxAccessToken}
      initialViewState={{
        longitude: 135,
        latitude: 35,
        zoom: 15
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default App;
