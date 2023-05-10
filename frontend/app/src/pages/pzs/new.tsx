import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Grid, Box, SelectChangeEvent, IconButton, Typography, FormControlLabel, Switch } from '@mui/material';
import PageTitle from 'components/PageTitle';
import axios from "../../../lib/axiosInstance";
import { useRouter } from 'next/router';
import DeleteIcon from "@mui/icons-material/Delete";
import Mapbox from 'components/Mapbox';
import { mgrsToLatLon } from 'utils/coordinateUtils';

interface PzObject {
  area_id: number;
  name: string;
  pz_type: number | undefined;
  data: JSON | undefined;
}

interface PzType {
  name: string;
  value: number;
  color: [number, number, number, number]
}

interface PolygonPzData {
  contour: [number, number][];
  altitude: number;
}

const pzTypes: PzType[] = [
  { name: '円柱型PZ(レッドPZ)', value: 0, color: [255, 0, 0, 255 * 0.3] },
  { name: '多角形PZ(レッドPZ)', value: 1, color: [255, 0, 0, 255 * 0.3] },
  { name: '多角形PZ(イエローPZ)', value: 2, color: [255, 241, 0, 200]  },
  { name: '多角形PZ(ブルーPZ)', value: 3, color: [0, 0, 255, 255 * 0.3]  },
];

const App: React.FC = () => {
  const router = useRouter();
  const areaId = router.query.area_id;
  const [name, setName] = useState("PZ1");
  const [pz, setPz] = useState<PzObject>({ area_id: 0, name: '', pz_type: undefined, data: undefined });
  const [coordinates, setCoordinates] = useState<{ id: number; x: string; y: string }[]>([{ id: 0, x: '', y: '' }]);
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [utmCoordinates, setUtmCoordinates] = useState("0");
  const [radius, setRadius] = useState("0");
  const [altitude, setAltitude] = useState("0");
  const [utmEnabled, setUtmEnabled] = useState(false);

  // 各PZごとのpz変数
  const [polygonPz, setPolygonPz] = useState<PolygonPzData>({contour: [[0, 0]], altitude: 0});

  const polygonPzInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPolygonPz((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (event: any) => {
    setUtmEnabled(event.target.checked);
  };

  const polygonPzNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setPolygonPz((prev) => ({ ...prev, [e.target.name]: num }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    setPz({ ...pz, pz_type: event.target.value as number });
  };

  const handleCoordinateChange = (id: number, field: 'x' | 'y', value: string) => {
    setCoordinates(coordinates.map(coord => (coord.id === id ? { ...coord, [field]: value } : coord)));
  };

  const addNewCoordinate = () => {
    const newId = coordinates.reduce((maxId, coord) => Math.max(maxId, coord.id), -1) + 1;
    setCoordinates([...coordinates, { id: newId, x: '', y: '' }]);
  };
  
  const removeCoordinate = (id: number) => {
    setCoordinates(coordinates.filter(coord => coord.id !== id));
  };

  const submitData = async () => {
    let data;
    if (pz.pz_type === 0) {
      let currentLatitude = latitude;
      let currentLongitude = longitude;

      if (utmEnabled) {
        const coordinates = mgrsToLatLon(utmCoordinates);
        currentLongitude = coordinates[0].toString();
        currentLatitude = coordinates[1].toString();
      }

      data = {
        coordinates: [parseFloat(currentLongitude), parseFloat(currentLatitude)],
        radius: parseFloat(radius),
        altitude: parseFloat(altitude),
        grid_type: utmEnabled,
        utm_coordinates: utmCoordinates
      }
    } else if (pz.pz_type === 1 || pz.pz_type === 2 || pz.pz_type === 3) {
      const contour = coordinates.map(coord => [parseFloat(coord.x), parseFloat(coord.y)]);
      const color = pzTypes.find(pzType => pzType.value === pz.pz_type)?.color;
      data = { contour: contour, altitude: polygonPz.altitude, color: color };
    }
    try {
      const response = await axios.post('/prohibited_zones', {
        area_id: areaId,
        name: name,
        pz_type: pz.pz_type,
        data: data
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ width: "70%", margin: "auto" }}>
      <PageTitle title="PZ登録" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} style={{ marginBottom: 16 }}>
          <TextField
            label="Pz名"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          </Grid>
        </Grid>
      <FormControl fullWidth style={{ marginBottom: 16 }}>
        <InputLabel id="pz-type-select-label">PZタイプ</InputLabel>
        <Select
          labelId="pz-type-select-label"
          id="pz-type-select"
          value={pz.pz_type ?? ''}
          label="PZタイプ"
          onChange={handleSelectChange}
        >
          {pzTypes.map((pzType, index) => (
            <MenuItem key={index} value={pzType.value}>
              {pzType.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {pz.pz_type !== undefined && pz.pz_type === 0 && (
        <>
          <Box component="div" sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={utmEnabled}
                  onChange={handleSwitchChange}
                />
              }
              label="UTM座標"
            />
          </Box>
          <Box component="div">
            <Grid container spacing={2}>
              {!utmEnabled ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="緯度"
                      type="number"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="経度"
                      type="number"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="UTM座標"
                      type="text"
                      value={utmCoordinates}
                      onChange={(e) => setUtmCoordinates(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="半径(m)"
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="高さ(ft)"
                  type="number"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {pz.pz_type !== undefined && pz.pz_type > 0 && (
        <>
          {coordinates.map(coord => (
            <Box component="div" sx={{ mb: 2 }} key={coord.id}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <Typography>地点{coord.id}</Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="X 座標（経度）"
                    value={coord.x}
                    onChange={event => handleCoordinateChange(coord.id, 'x', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Y 座標（緯度）"
                    value={coord.y}
                    onChange={event => handleCoordinateChange(coord.id, 'y', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => removeCoordinate(coord.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Grid container justifyContent="flex-end" mb={2}>
            <Grid item>
              <Button variant="contained" color="error" onClick={addNewCoordinate}>
                追加
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="高さ(ft)"
              type="number"
              name="altitude"
              value={polygonPz.altitude}
              onChange={polygonPzNumChange}
              fullWidth
            />
          </Grid>
        </>
      )}
      <div style={{ flexGrow: 1, position: "relative", height: "400px", marginTop: "32px", marginBottom: "16px" }}>
        <Mapbox />
      </div>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            style={{ color: "white", backgroundColor: "#b8b8b8", border: "none", borderRadius: 20 }}
            onClick={() => router.push(`/areas/${areaId}`)}
          >
            戻る
          </Button>

          <Button variant="contained" color="primary" onClick={submitData} style={{ marginTop: 16 }}>
            登録
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

export default App;
