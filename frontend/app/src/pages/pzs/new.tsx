import React, { useState } from "react";
import axios from "../../../lib/axiosInstance";
import { TextField, Button, Box, Grid, Alert, Snackbar } from "@mui/material";
import { useRouter } from 'next/router';

const NewPz: React.FC = () => {
  const router = useRouter();
  const areaId = router.query.area_id;
  // Pz Data
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [radius, setRadius] = useState("0");
  const [altitude, setAltitude] = useState("0");
  // Basic Alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const btnClick = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const result = await createPz();
  
    if (result) {
      setAlertSeverity("info");
    } else {
      setAlertSeverity("error");
    }
    // アラートを表示する
    setAlertOpen(true);

    // アラートを3秒後に自動的に閉じる
    setTimeout(() => {
      setAlertOpen(false);
    }, 3000);
  };

  const createPz = async (): Promise<boolean> => {
    try {
      const response = await axios.post('/prohibited_zones', {
        area_id: areaId,
        name: "test",
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
      <Box component="div">
        <form onSubmit={btnClick}>
          <Grid container spacing={2}>
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
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  style={{ color: "white", backgroundColor: "#b8b8b8", border: "none", borderRadius: 20 }}
                  onClick={() => router.push(`/areas/${areaId}`)}
                >
                  戻る
                </Button>
                <Button variant="contained" type="submit">
                  登録
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertSeverity === "info"
            ? "Pz was successfully created."
            : "Failed to create Pz."}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewPz;
