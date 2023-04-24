import React, { useEffect, useState } from "react";
import ReactMap, { AttributionControl, ViewState } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { ColumnLayer } from "@deck.gl/layers/typed";
import { latLonToMGRS } from '../utils/coordinateUtils';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface ObjectType {
  coordinates: [number, number];
  radius: number;
  altitude: number;
}
interface MapboxProps {
  objects?: Array<ObjectType>;
}

interface ViewStateType {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const Mapbox: React.FC<MapboxProps> = ({ objects = [] }) => {
  const initialViewState: ViewStateType = {
    longitude: objects.length > 0 ? objects[0].coordinates[0] : 130.300,
    latitude: objects.length > 0 ? objects[0].coordinates[1] : 33.265,
    zoom: 12,
    pitch: objects.length > 0 ? 45 : 0,
    bearing: 0,
  };


  const [viewState, setViewState] = useState<ViewStateType>(initialViewState);

  useEffect(() => {
    const mgrsString = latLonToMGRS(viewState.latitude, viewState.longitude);
    console.log('mgrsString');
    console.log(mgrsString);
  }, [viewState]);

  const layers = objects.length > 0 ? [
    new ColumnLayer({
      id: "column-layer",
      data: objects,
      getPosition: (d: ObjectType) => d.coordinates,
      getFillColor: [255, 0, 0, 255],
      getRadius: (d: ObjectType) => d.radius,
      getHeight: (d: ObjectType) => d.altitude,
      pickable: true,
    }),
  ] : [];

  const handleViewportChange = (viewport: ViewStateType) => {
    setViewState(viewport);
    console.log("Center coordinates:", viewport.longitude, viewport.latitude);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {objects.length > 0 ? (
        <DeckGL
          layers={layers}
          initialViewState={initialViewState}
          controller={true}
          onViewStateChange={handleViewportChange}
        >
          <ReactMap
            {...viewState}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            attributionControl={false}
          />
        </DeckGL>
      ) : (
        <ReactMap
          {...viewState}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          attributionControl={false}
          onMove={evt => setViewState(evt.viewState)}
        />
      )}
    </div>
  );
};

export default Mapbox;
