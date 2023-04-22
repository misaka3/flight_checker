import React, { useState } from "react";
import axios from "../../../lib/axiosInstance";
import { TextField, Button, Box, Grid, FormControlLabel, Switch } from "@mui/material";
import { useRouter } from 'next/router';

const NewPz: React.FC = () => {
  const router = useRouter();
  const areaId = router.query.area_id;
  // Pz Data
  const [name, setName] = useState("PZ1");
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [radius, setRadius] = useState("0");
  const [altitude, setAltitude] = useState("0");

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
    try {
      const response = await axios.post('/prohibited_zones', {
        area_id: areaId,
        name: name,
        pz_type: 0,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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
        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
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
                label="高さ(m)"
                type="number"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                fullWidth
              />
            </Grid>
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
