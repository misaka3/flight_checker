import React, { useEffect, useState } from "react";
import ReactMap, { AttributionControl, ViewState } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { latLonToMGRS } from "../utils/coordinateUtils";
import { Box, Grid, TextField, Typography } from "@mui/material";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MapboxAccessToken;

interface MapboxProps {
  layers?: any[];
  initialCoordinates?: number[];
}

interface ViewStateType {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const Mapbox: React.FC<MapboxProps> = ({ layers = [], initialCoordinates = [] }) => {
  const initialViewState: ViewStateType = {
    longitude: initialCoordinates.length > 0 ? initialCoordinates[0] : 130.300,
    latitude: initialCoordinates.length > 0 ? initialCoordinates[1] : 33.265,
    zoom: 14,
    pitch: layers.length > 0 ? 60 : 0,
    bearing: 0,
  };

  const [viewState, setViewState] = useState<ViewStateType>(initialViewState);

  useEffect(() => {
    const mgrsString = latLonToMGRS(viewState.latitude, viewState.longitude);
  }, [viewState]);

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
    layers.length > 0 ? (
      <div style={{ width: "100%", height: "100%" }}>
        <DeckGL
          layers={layers}
          initialViewState={initialViewState}
          controller={true}
          onViewStateChange={handleViewportChange as any}
        >
          <ReactMap
            {...viewState}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            attributionControl={false}
          />
        </DeckGL>
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

    )
  );
};

export default Mapbox;
