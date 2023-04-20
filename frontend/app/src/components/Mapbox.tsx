import React, { useState } from "react";
import ReactMap, {AttributionControl} from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { ColumnLayer } from '@deck.gl/layers/typed';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface MapboxProps {
  longitude: number;
  latitude: number;
  radius: number;
  altitude: number;
  color: [number, number, number, number];
}

const Mapbox: React.FC<MapboxProps> = ({ longitude, latitude, radius, altitude, color }) => {
  const initialViewState = {
    longitude,
    latitude,
    zoom: 14,
    pitch: 45,
    bearing: 0,
  };

  const [viewState, setViewState] = useState(initialViewState);

  const layers = [
    new ColumnLayer({
      id: "column-layer",
      data: [
        {
          coordinates: [longitude, latitude],
          height: altitude
        },
      ],
      getPosition: (d) => d.coordinates,
      getFillColor: color,
      getRadius: radius,
      getHeight: (d) => d.height,
      pickable: true,
    }),
  ];

  return (
    <div>
      <DeckGL
        layers={layers}
        initialViewState={initialViewState}
        controller={true}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
      >
        <ReactMap
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          attributionControl={false}
        />
      </DeckGL>
    </div>
  );
};

export default Mapbox;
