import React, { useEffect, useState } from "react";
import ReactMap, { AttributionControl, ViewState } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { latLonToMGRS } from "../utils/coordinateUtils";
import { Box, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface MapboxProps {
  layers?: any[];
  initialCoordinates?: number[];
  initialViewState?: ViewStateType;
}

interface ViewStateType {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const Mapbox: React.FC<MapboxProps> = ({ layers = [], initialCoordinates = [], initialViewState }) => {
  const [selectedStyle, setSelectedStyle] = useState('mapbox://styles/mapbox/streets-v11');
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

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event.target.value");
    console.log(event.target.value);
    setSelectedStyle(event.target.value);
  };

  return (
    <div>
      { layers.length > 0 ? (
        <div style={{ width: "100%", height: "100%" }}>
          <div style={{ height: "10%", position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1 }}>
            <RadioGroup name="rtoggle" value={selectedStyle} onChange={handleStyleChange} style={{ flexDirection: "row" }}>
              <FormControlLabel value="mapbox://styles/mapbox/satellite-v9" control={<Radio />} label="satellite" />
              <FormControlLabel value="mapbox://styles/mapbox/light-v10" control={<Radio />} label="light" />
              <FormControlLabel value="mapbox://styles/mapbox/dark-v10" control={<Radio />} label="dark" />
              <FormControlLabel value="mapbox://styles/mapbox/streets-v11" control={<Radio />} label="streets" />
              <FormControlLabel value="mapbox://styles/mapbox/outdoors-v11" control={<Radio />} label="outdoors" />
            </RadioGroup>
          </div>
          <div style={{ height: "90%", position: "absolute", top: 60, left: 0, right: 0 }}>
            <DeckGL
              layers={layers}
              initialViewState={initViewState}
              controller={true}
              onViewStateChange={handleViewportChange as any}
            >
              <ReactMap
                {...viewState}
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                mapStyle={selectedStyle}
                attributionControl={false}
              />
            </DeckGL>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          <Box component="div" sx={{ marginBottom: "16px"}}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center", color: "darkgray" }}>
              Mapの中心地の座標
            </Typography>
          </Box>
          <Box component="div" sx={{ marginBottom: "16px"}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="緯度"
                  type="number"
                  value={viewState.latitude}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="経度"
                  type="number"
                  value={viewState.longitude}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="UTM座標"
                  type="string"
                  value={latLonToMGRS(viewState.latitude, viewState.longitude)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <div style={{ flexGrow: 1 }}>
            <ReactMap
              {...viewState}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              attributionControl={false}
              onMove={evt => setViewState(evt.viewState)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Mapbox;
