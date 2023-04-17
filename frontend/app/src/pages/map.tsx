import React, { useState } from 'react';
import ReactMap from 'react-map-gl';
import DeckGL from '@deck.gl/react/typed';
import { ColumnLayer } from '@deck.gl/layers/typed';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

const initialViewState = {
  longitude: 139.7670,
  latitude: 35.6812,
  zoom: 14,
  pitch: 45,
  bearing: 0,
};

const MapPage = () => {
  const [viewState, setViewState] = useState(initialViewState);

  const layers = [
    new ColumnLayer({
      id: 'column-layer',
      data: [
        {
          coordinates: [139.7670, 35.6812],
          height: 100,
        },
      ],
      getPosition: d => d.coordinates,
      getFillColor: [255, 0, 0, 255],
      getRadius: 30,
      getHeight: d => d.height,
      pickable: true,
    }),
  ];

  return (
    <DeckGL
      layers={layers}
      initialViewState={initialViewState}
      controller={true}
      onViewStateChange={({ viewState }) => setViewState(viewState)}
    >
      <ReactMap
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      />
    </DeckGL>
  );
};

export default MapPage;
