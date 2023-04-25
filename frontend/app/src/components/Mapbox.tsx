import React, { useEffect, useState } from "react";
import ReactMap, { AttributionControl, ViewState } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { ColumnLayer } from "@deck.gl/layers/typed";
import { latLonToMGRS } from "../utils/coordinateUtils";
import { Box, Grid, TextField, Typography } from "@mui/material";

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

  const layers = objects.length > 0 ? objects.map((obj) => {
    return new ColumnLayer({
      id: `column-layer-${obj.coordinates}`,
      data: [obj],
      getPosition: (d: ObjectType) => d.coordinates,
      getFillColor: [255, 0, 0, 255 * 0.5],
      radius: obj.radius,
      getElevation: (d: ObjectType) => d.altitude,
      pickable: true,
    });
  }) : [];

  const handleViewportChange = (viewport: ViewStateType) => {
    setViewState(viewport);
  };

  return (
    objects.length > 0 ? (
      <div style={{ width: "100%", height: "100%" }}>
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
