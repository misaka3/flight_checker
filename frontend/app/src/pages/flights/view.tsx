import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Mapbox from 'components/Mapbox';
import { DOMParser } from 'xmldom';
import { gpx } from '@tmcw/togeojson';
import axios from "../../../lib/axiosInstance";
import { Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getInitialCoordinates } from 'utils/coordinateUtils'
import { createColumnLayer, createPathLayer, createPolygonLayer } from 'utils/layerUtils';

const DeckGL = dynamic(() => import('@deck.gl/react/typed'), { ssr: false });

interface GPXType {
  type: string;
  features: any[];
}
interface Area {
  id: number;
  name: string;
  prohibited_zones: PzObject[];
}

interface PzObject {
  id: number;
  area_id: number;
  name: string;
  pz_type: number;
  data: ColumnLayerObject | PolygonLayerObject;
}

interface ColumnLayerObject {
  coordinates: [number, number];
  radius: number;
  altitude: number;
  grid_type: boolean;
  utm_coordinates: string;
}

interface PolygonLayerObject {
  contour: [number, number][];
  altitude: number;
  color: [number, number, number, number];
}

interface PzArrayObject {
  coordinates: [number, number];
  radius: number;
  altitude: number;
}

const GpxPage = () => {
  const [gpxData, setGpxData] = useState<GPXType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState<number>(0);
  const [area, setArea] = useState<Area>();
  const [pzs, setPzs] = useState([]);
  const [layers, setLayers] = useState([]);
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
    console.log("e.target");
    console.log(e.target);
    setAreaId(Number(e.target.value));
  };

  const displayLayers = async () => {
    try {
      const response = await axios.get(`/areas/${areaId}`);
      // setArea(response.data);

      let pz_array: any[] = []
      if (response.data.prohibited_zones) {
        response.data.prohibited_zones.forEach((pz: PzObject) => {
          let layer;
          if (pz.pz_type === 0) {
            layer = createColumnLayer(pz.data as ColumnLayerObject);
          } else if (pz.pz_type === 1 || pz.pz_type === 2) {
            layer = createPolygonLayer(pz.data);
          } else if (pz.pz_type === 3) {
            layer = createPolygonLayer(pz.data);
          }
          pz_array.push(layer);
        })
        setPzs(pz_array);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log("layers");
    console.log(layers);
    const new_layers = []
    new_layers.push(layers[0]);
    pzs.map(pz => (new_layers.push(pz)));
    setLayers(new_layers);
  }, [pzs]);

  const handleButtonClick = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const gpxText = event.target?.result;
      if (typeof gpxText === 'string') {
        const parser = new DOMParser();
        const gpxXML = parser.parseFromString(gpxText, 'application/xml');
        const geoJSONData = gpx(gpxXML);
        // setGpxData(geoJSONData);
        const layer = createPathLayer(geoJSONData.features);
        setLayers([layer]);
        setInitialCoordinates(getInitialCoordinates(geoJSONData.features));
      }
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
          <Button onClick={displayLayers} variant="contained" color="primary">
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
