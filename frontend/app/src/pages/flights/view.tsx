import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Mapbox from 'components/Mapbox';
import { DOMParser } from 'xmldom';
import { gpx } from '@tmcw/togeojson';
import axios from "../../../lib/axiosInstance";
import { Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getInitialCoordinates } from 'utils/coordinateUtils';
import { createPathLayer, createPzLayers } from 'utils/layerUtils';

// const DeckGL = dynamic(() => import('@deck.gl/react/typed'), { ssr: false });

const GpxPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState<number>(0);
  const [layers, setLayers] = useState<any[]>([]);
  const [gpxLayer, setGpxLayer] = useState<any>();
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number]>();

  const fetchAreas = async () => {
    try {
      const response = await axios.get("/areas");
      setAreas(response.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };
  
  const handleAreaChange = (e: SelectChangeEvent<number>) => {
    setAreaId(Number(e.target.value));
  };

  const displayPzLayers = async () => {
    let new_layers = [gpxLayer];

    try {
      const response = await axios.get(`/areas/${areaId}`);

      if (response.data.prohibited_zones) {
        const pz_layers = createPzLayers(response.data.prohibited_zones);
        pz_layers.map(pz_layer => new_layers.push(pz_layer));
      }
      setLayers(new_layers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    if (!file) return;

    const reader = new FileReader();
    const old_layers = layers;
    let new_layers: any[] = [];
    reader.onload = (event) => {
      const gpxText = event.target?.result;
      if (typeof gpxText === 'string') {
        const parser = new DOMParser();
        const gpxXML = parser.parseFromString(gpxText, 'application/xml');
        const geoJSONData = gpx(gpxXML);
        const layer = createPathLayer(geoJSONData.features);
        setGpxLayer(layer);
        new_layers.push(layer);
        new_layers = new_layers.concat(old_layers.slice(1));
        setInitialCoordinates(getInitialCoordinates(geoJSONData.features));
      }
      setLayers([new_layers]);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

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
      <Grid container mb={4}>
        <Grid item xs={10} style={{ height: '40px' }}>
          <FormControl fullWidth required>
            <InputLabel>エリア</InputLabel>
            <Select
              name="area_id"
              value={areaId}
              onChange={handleAreaChange}
              style={{ height: '40px' }}
            >
              {areas.map((area: any) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={displayPzLayers} variant="contained" color="primary">
            PZを描画
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
