import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PathLayer } from '@deck.gl/layers/typed';
import { PathStyleExtension } from '@deck.gl/extensions/typed';
import Mapbox from 'components/Mapbox';
import { DOMParser } from 'xmldom';
import { gpx } from 'togeojson';
import { Box, Button, TextField, Grid } from '@mui/material';

const DeckGL = dynamic(() => import('@deck.gl/react/typed'), { ssr: false });

interface GPXType {
  type: string;
  features: any[];
}

const GpxPage = () => {
  const [gpxData, setGpxData] = useState<GPXType | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const altitudeToColor = (altitude: number): [number, number, number] => {
    const minAltitude = 0;
    const maxAltitude = 4000;
  
    const t = (altitude - minAltitude) / (maxAltitude - minAltitude);
    const r = t * 255;
    const g = 0;
    const b = (1 - t) * 255;
  
    return [r, g, b];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleButtonClick = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const gpxText = event.target?.result;
      if (typeof gpxText === 'string') {
        const parser = new DOMParser();
        const gpxXML = parser.parseFromString(gpxText, 'application/xml');
        const geoJSONData = gpx(gpxXML);
        setGpxData(geoJSONData);
      }
    };
    reader.readAsText(file);
  };

  // Get the first set of coordinates.
  const getInitialCoordinates = (features: any[]) => {
    if (features.length === 0) return null;
    const firstFeature = features[0];
    const coordinates = firstFeature.geometry.coordinates;
    if (coordinates.length === 0) return null;
    return coordinates[0]; // [longitude(number), latitude(number), altitude(number)]
  };

  const initialCoordinates = gpxData ? getInitialCoordinates(gpxData.features) : null;

  const layers = gpxData
    ? [
        new PathLayer({
          id: 'path-layer',
          data: gpxData.features,
          getPath: (d: any) => d.geometry.coordinates,
          getColor: (d: any) => d.geometry.coordinates.map((coordinate: any) => altitudeToColor(coordinate[2] * 3.28084)), // meters to feet
          getWidth: 20,
          extensions: [new PathStyleExtension({ dash: true })],
          getDashArray: (d: any) => [0, 0],
        }),
      ]
    : [];

  return (
    <div>
      <Box mb={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <input
              id="file-upload-button"
              type="file"
              accept=".gpx"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload-button">
              <Button component="span" variant="outlined" color="primary" sx={{ height: '40px' }}>
                ファイルを選択
              </Button>
            </label>
          </Grid>
          <Grid item xs>
            <TextField
              variant="outlined"
              disabled
              value={file ? file.name : 'ファイルを選択してください'}
              fullWidth
              InputProps={{
                style: {
                  height: '40px',
                  padding: '0 12px',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container justifyContent="flex-end" mb={4}>
        <Grid item>
          <Button onClick={handleButtonClick} variant="contained" color="primary" >
            航跡図を描画
          </Button>
        </Grid>
      </Grid>
      <div style={{ flexGrow: 1, position: "relative", height: "600px", marginBottom: "32px" }}>
        {layers.length > 0 && initialCoordinates && (
          <Mapbox layers={layers} initialCoordinates={initialCoordinates} />
        )}
      </div>
    </div>
  );
};

export default GpxPage;
