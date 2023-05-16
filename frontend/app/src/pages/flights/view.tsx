import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
import Mapbox from 'components/Mapbox';
import { DOMParser } from 'xmldom';
import { gpx } from '@tmcw/togeojson';
import axios from "../../../lib/axiosInstance";
import { Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getInitialCoordinates } from 'utils/coordinateUtils';
import { createPathLayer, createPzLayers, createScatterplotLayer, layerIdChange } from 'utils/layerUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';


// const DeckGL = dynamic(() => import('@deck.gl/react/typed'), { ssr: false });

const GpxPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState<number>(1);
  const [layers, setLayers] = useState<any[]>([]);
  const [gpxLayer, setGpxLayer] = useState<any>();
  const [pzLayers, setPzLayers] = useState<any[]>([]);
  const [scatterplotLayer, setScatterplotLayer] = useState<any>();
  const [newScatterplotLayer, setNewScatterplotLayer] = useState<any>();
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number]>();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [scatterplotFlg, setScatterplotFlg] = useState(true); // true: Full display layer, false: Part display layer
  const [geoJSONData, setGeoJSONData] = useState<Array<any>>([]);

  const gpxAnimationSwitch = (flg: boolean) => {
    setPlaying(flg);
    setScatterplotFlg(false);
  };

  // gpxLayer(scatterplotLayer)'s timelapsed animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let currentFrameIndex = 0;
    if (playing && geoJSONData && currentFrameIndex < geoJSONData[0].geometry.coordinates.length) {
      timer = setInterval(() => {
        currentFrameIndex += 1;
        let geoJSONData_copy = JSON.parse(JSON.stringify(geoJSONData));
        geoJSONData_copy[0].geometry.coordinates = geoJSONData[0].geometry.coordinates.slice(0, currentFrameIndex);
        const scatterplot_layer = createScatterplotLayer(geoJSONData_copy, setHoverInfo, false);
        setNewScatterplotLayer(scatterplot_layer);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [playing, geoJSONData]);

  // Display newScatterplotLayer for gpx timelapsed animation
  useEffect(() => {
    if (pzLayers && newScatterplotLayer) {
      let new_layers = [...pzLayers];
      new_layers.push(newScatterplotLayer);
      setLayers(new_layers);
    }
  }, [newScatterplotLayer, pzLayers]);

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
    let new_layers = [];
    if (scatterplotFlg) {
      new_layers = [gpxLayer, scatterplotLayer];
    } else {
      new_layers = [newScatterplotLayer];
    }

    try {
      const response = await axios.get(`/areas/${areaId}`);

      if (response.data.prohibited_zones) {
        let pz_layers = createPzLayers(response.data.prohibited_zones);
        pz_layers = layerIdChange(pz_layers);
        setPzLayers(pz_layers);
        pz_layers.map(pz_layer => new_layers.push(pz_layer));
      }
      setLayers(new_layers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = (altitudeFlg: boolean) => {
    if (!file) return;

    const reader = new FileReader();
    let new_layers: any[] = [];
    if (pzLayers.length > 0) {
      new_layers = [...pzLayers];
    }
    reader.onload = (event) => {
      const gpxText = event.target?.result;
      if (typeof gpxText === 'string') {
        const parser = new DOMParser();
        const gpxXML = parser.parseFromString(gpxText, 'application/xml');
        const geoJSONData = gpx(gpxXML);
        setGeoJSONData(geoJSONData.features);
        const path_layer = createPathLayer(geoJSONData.features, altitudeFlg);
        setGpxLayer(path_layer);
        new_layers.push(path_layer);
        const scatterplot_layer = createScatterplotLayer(geoJSONData.features, setHoverInfo, altitudeFlg);
        setScatterplotLayer(scatterplot_layer);
        new_layers.push(scatterplot_layer);
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
      <div style={{ width: '60%', margin: 'auto' }}>
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
          <Grid item style={{ marginRight: "16px"}}>
            <Button onClick={() => handleButtonClick(true)}  variant="outlined" color="primary" >
              高度を補正して描画
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => handleButtonClick(false)}  variant="contained" color="primary" >
              航跡図を描画
            </Button>
          </Grid>
        </Grid>
        <Grid container mb={4}>
          <Grid item xs={10} style={{ height: '40px' }}>
            <FormControl fullWidth required>
              <InputLabel>エリア</InputLabel>
              <Select
                label="エリア"
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
        <Grid container mb={2}>
          <Grid item xs={6}>
            { playing ? (
              <Button onClick={() => gpxAnimationSwitch(false)} variant="contained" color="error" startIcon={<StopIcon />}>
                停止
              </Button>
            ) : (
              <Button onClick={() => gpxAnimationSwitch(true)} variant="contained" color="primary" startIcon={<PlayArrowIcon />}>
              再生
            </Button>
            )}
          </Grid>
        </Grid>
      </div>
      <div style={{ flexGrow: 1, position: "relative", height: "600px", marginBottom: "32px" }}>
        {layers.length > 0 && initialCoordinates && (
          <Mapbox layers={layers} initialCoordinates={initialCoordinates} hoverInfo={hoverInfo} />
        )}
      </div>
    </div>
  );
};

export default GpxPage;
