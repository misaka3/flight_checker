import React, { useState } from "react";
import axios from "../../../lib/axiosInstance";
import { TextField, Button, Box, Grid, FormControlLabel, Switch } from "@mui/material";
import { useRouter } from 'next/router';
import { mgrsToLatLon } from "utils/coordinateUtils";
import Mapbox from "components/Mapbox";

const NewPz: React.FC = () => {
  const router = useRouter();
  const areaId = router.query.area_id;
  // Pz Data
  const [name, setName] = useState("PZ1");
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [utmCoordinates, setUtmCoordinates] = useState("0");
  const [radius, setRadius] = useState("0");
  const [altitude, setAltitude] = useState("0");
  const [utmEnabled, setUtmEnabled] = useState(false);

  const handleSwitchChange = (event: any) => {
    setUtmEnabled(event.target.checked);
  };

  const btnClick = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const result = await createPz();
  
    if (result) {
      router.push(`/areas/${areaId}?alert=info`);
    } else {
      router.push(`/areas/${areaId}?alert=error`);
    }
  };

  const createPz = async (): Promise<boolean> => {
    let currentLatitude = latitude;
    let currentLongitude = longitude;

    if (utmEnabled) {
      const latlon = mgrsToLatLon(utmCoordinates);
      currentLatitude = latlon[0].toString();
      currentLongitude = latlon[1].toString();
    }

    try { 
      const response = await axios.post('/prohibited_zones', {
        area_id: areaId,
        name: name,
        pz_type: 0,
        grid_type: utmEnabled,
        latitude: parseFloat(currentLatitude),
        longitude: parseFloat(currentLongitude),
        utm_coordinates: utmCoordinates,
        radius: parseFloat(radius),
        altitude: parseFloat(altitude),
      });

      if (response.status === 200 || response.status === 201) {
        return true;
      } else {
        console.error('Error Occured. Status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Failed request API. ', error);
      return false;
    }
  };

  return (
    <div>
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
        <form onSubmit={btnClick}>
          <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Pz名"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </Grid>
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
            <div style={{ flexGrow: 1, position: "relative", height: "400px", marginTop: "32px", marginBottom: "16px", paddingLeft: "16px" }}>
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
                <Button 
                  variant="contained"
                  type="submit"
                  onClick={() => router.push(`/areas/${areaId}`)}
                >
                  登録
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default NewPz;
