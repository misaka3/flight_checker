import React, { useState } from "react";
import ReactMap, { AttributionControl } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { ColumnLayer } from "@deck.gl/layers/typed";
import { latLonToMGRS } from '../utils/coordinateUtils';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface MapboxProps {
  objects: Array<{
    coordinates: [number, number];
    radius: number;
    altitude: number;
  }>;
}

const Mapbox: React.FC<MapboxProps> = ({ objects = [] }) => {
  const initialViewState = {
    longitude: objects.length > 0 ? objects[0].coordinates[0] : 130.300,
    latitude: objects.length > 0 ? objects[0].coordinates[1] : 33.265,
    zoom: 14,
    pitch: 45,
    bearing: 0,
  };

  const mgrsString = latLonToMGRS(initialViewState.latitude, initialViewState.longitude);
  console.log('mgrsString');
  console.log(mgrsString);

  const [viewState, setViewState] = useState(initialViewState);

  const layers = [
    new ColumnLayer({
      id: "column-layer",
      data: objects,
      getPosition: (d) => d.coordinates,
      getFillColor: [255, 0, 0, 255],
      getRadius: (d) => d.radius,
      getHeight: (d) => d.altitude,
      pickable: true,
    }),
  ];

  // This function will be called every time the map's viewState changes
  const handleViewStateChange = ({ viewState }) => {
    setViewState(viewState);
    console.log("Center coordinates:", viewState.longitude, viewState.latitude);
  };

  return (
    <div>
      <DeckGL
        layers={layers}
        initialViewState={initialViewState}
        controller={true}
        onViewStateChange={handleViewStateChange}
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
