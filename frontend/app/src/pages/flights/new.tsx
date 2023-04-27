import { useState } from 'react';
import dynamic from 'next/dynamic';
import Mapbox from 'components/Mapbox';
import { DOMParser } from 'xmldom';
import { gpx } from '@tmcw/togeojson';
import { Box, Button, TextField, Grid } from '@mui/material';
import { getInitialCoordinates } from 'utils/coordinateUtils'
import { createPathLayer } from 'utils/layerUtils';

const DeckGL = dynamic(() => import('@deck.gl/react/typed'), { ssr: false });

interface GPXType {
  type: string;
  features: any[];
}

const GpxPage = () => {
  const [gpxData, setGpxData] = useState<GPXType | null>(null);
  const [file, setFile] = useState<File | null>(null);

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

  const initialCoordinates = gpxData ? getInitialCoordinates(gpxData.features) : null;

  const layers = gpxData ? [createPathLayer(gpxData.features)] : [];

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
