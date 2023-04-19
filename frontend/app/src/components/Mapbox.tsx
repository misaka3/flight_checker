import React, { useState } from "react";
import ReactMap from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { Tile3DLayer } from "@deck.gl/geo-layers/typed";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";


const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface MapboxProps {
  longitude: number;
  latitude: number;
  radius: number;
  altitude: number;
  url: string;
}

const Mapbox: React.FC<MapboxProps> = ({ longitude, latitude, radius, altitude, url }) => {
  const initialViewState = {
    longitude,
    latitude,
    zoom: 14,
    pitch: 45,
    bearing: 0,
  };

  const [viewState, setViewState] = useState({
    ...initialViewState,
    activeViewports: { default: initialViewState },
  });

  const layers = [
    // ...既存のレイヤー定義
    new ScenegraphLayer({
      id: "scenegraph-layer",
      data: [
        {
          position: [longitude, latitude],
          url,
        },
      ],
      getPosition: (d) => d.position,
      scenegraph: (d) => d.url,
      sizeScale: 10,
      getMaterial: (d) => ({
        ...d.material,
        diffuse: [1, 0, 0]
      })
    })
  ];

  return (
    <DeckGL
      layers={layers}
      initialViewState={initialViewState}
      controller={true}
      onViewStateChange={({ viewState }) =>
        setViewState((prevViewState) => ({
          ...viewState,
          activeViewports: { ...prevViewState.activeViewports, default: viewState },
        }))
      }
    >
      <ReactMap mapboxAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle="mapbox://styles/mapbox/streets-v11" />
    </DeckGL>
  );
};

export default Mapbox;
