import React, { useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import axios from "../../../lib/axiosInstance";
import { TextField, Button, Box, Grid, Alert, Snackbar } from "@mui/material";

const NewPz: React.FC = () => {
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
    event.preventDefault(); // ページリロードを防ぐ
  
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
        area_id: 2,
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
  

  // const exportCylinder = () => {
  const exportCylinder = async () => {
    // Create a cylindrical 3D object
    const geometry = new THREE.CylinderGeometry(parseInt(radius, 10), parseInt(radius, 10), parseInt(altitude, 10), 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.4,
    });
    const cylinder = new THREE.Mesh(geometry, material);

    // Export the 3D object in GLTF format and send it to the server
    const exporter = new GLTFExporter();
    const filename = 'pz.gltf';
    exporter.parse(
      cylinder,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: "model/gltf+json" });
        const formData = new FormData();
        formData.append("file", blob, filename);
        console.log('formData')
        console.log(formData)
        axios
          .post("/prohibited_zones/create_obj", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      (progress) => {
        console.log("Export progress:", progress);
      }
    );
    
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
              <Box display="flex" justifyContent="flex-end">
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
