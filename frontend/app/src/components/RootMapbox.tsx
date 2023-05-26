import React, { useState } from "react";
import ReactMap, { ViewState } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface MapboxProps {
  layers?: any[];
  initialCoordinates?: number[];
  initialViewState?: ViewStateType;
  hoverInfo?: any;
  selectedStyle?: string;
}

interface ViewStateType {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const Mapbox: React.FC<MapboxProps> = ({ layers = [], initialCoordinates = [], initialViewState, hoverInfo, selectedStyle }) => {
  const defaultViewState: ViewStateType = {
    longitude: initialCoordinates.length > 0 ? initialCoordinates[0] : 130.300,
    latitude: initialCoordinates.length > 0 ? initialCoordinates[1] : 33.265,
    zoom: 14,
    pitch: layers.length > 0 ? 60 : 0,
    bearing: 0,
  };
  const initViewState = initialViewState !== undefined ? initialViewState : defaultViewState;

  const [viewState, setViewState] = useState<ViewStateType>(initViewState);

  const handleViewportChange = (params: { viewState: ViewState; viewId: string }) => {
    const viewport: ViewStateType = {
      longitude: params.viewState.longitude,
      latitude: params.viewState.latitude,
      zoom: params.viewState.zoom,
      pitch: params.viewState.pitch,
      bearing: params.viewState.bearing,
    };

    setViewState(viewport);
  };

  return (
    <div>
      { layers.length > 0 && (
        <div style={{ width: "100%", height: "580px", position: "absolute", top: 0, left: 0, right: 0 }}>
          <DeckGL
            layers={layers}
            initialViewState={initViewState}
            controller={true}
            onViewStateChange={handleViewportChange as any}
            getTooltip={({object}) => object && {
              html: `
                ${hoverInfo?.jstDatetime}<br />
                緯度: ${hoverInfo?.coordinate[1]}<br />
                経度: ${hoverInfo?.coordinate[0]}<br />
                高度: ${(hoverInfo?.coordinate[2]).toFixed(2)}m / ${(hoverInfo?.coordinate[2] * 3.28084).toFixed(2)}ft
              `,
              style: {
                color: 'white',
                backgroundColor: '#28282a',
                fontSize: '0.8em'
              }
            }}
          >
            <ReactMap
              {...viewState}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
              mapStyle={selectedStyle}
              attributionControl={false}
            />
          </DeckGL>
        </div>
      )}
    </div>
  );
};

export default Mapbox;
