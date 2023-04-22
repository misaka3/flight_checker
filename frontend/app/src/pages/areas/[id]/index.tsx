import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../../../../lib/axiosInstance";
import { Alert, AlertColor, Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Typography, Grid, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Mapbox from "components/Mapbox";

const AreaEdit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { alert } = router.query;
  const [area, setArea] = useState(null);
  const [pzs, setPzs] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor | null>(null);

  const showAlert = (severity: AlertColor) => {
    setAlertSeverity(severity);
    setAlertOpen(true);
  
    setTimeout(() => {
      setAlertOpen(false);
    }, 3000);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    if (id) {
      getAreaData();
    }
  }, [id]);

  useEffect(() => {
    console.log('alert1');
    console.log(alert);
    if (alert) {
      showAlert(alert as AlertColor);
    }
  }, [alert]);

  const getAreaData = async () => {
    try {
      const response = await axios.get(`/areas/${id}`);
      setArea(response.data);

      let pz_array = []
      if (response.data.prohibited_zones) {
        response.data.prohibited_zones.forEach((pz) => {
          pz_array.push({
            coordinates: [parseFloat(pz.longitude), parseFloat(pz.latitude)],
            radius: pz.radius,
            altitude: pz.altitude
          })
        })
        setPzs(pz_array);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (pzId: number) => {
    try {
      await axios.delete(`/prohibited_zones/${pzId}`);
      getAreaData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!area) return <div>Loading...</div>;

  return (
    <div>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: 'darkgray' }}>
          {area.name}エリア
        </Typography>
      </Box>
      <Grid container justifyContent="flex-end" mb={4}>
        <Grid item>
          <Button
            variant="contained"
            style={{ borderRadius: 20 }}
            onClick={() => router.push(`/pzs/new?area_id=${id}`)}
          >
            PZ登録
          </Button>
        </Grid>
      </Grid>
      <Box mb={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>PZ名</TableCell>
                <TableCell>PZタイプ</TableCell>
                <TableCell>緯度</TableCell>
                <TableCell>経度</TableCell>
                <TableCell>半径</TableCell>
                <TableCell>高さ</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {area.prohibited_zones.length > 0 ? (
                area.prohibited_zones.map((pz) => (
                  <TableRow
                    key={pz.id}
                    hover
                    onClick={() => router.push(`/pzs/${pz.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{pz.id}</TableCell>
                    <TableCell>{pz.name}</TableCell>
                    <TableCell>{pz.pz_type}</TableCell>
                    <TableCell>{pz.latitude}</TableCell>
                    <TableCell>{pz.longitude}</TableCell>
                    <TableCell>{pz.radius}</TableCell>
                    <TableCell>{pz.altitude}</TableCell>
                    <TableCell>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pz.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    PZが登録されていません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <div style={{ flexGrow: 1, position: "relative", height: "400px", marginBottom: "32px" }}>
        <Mapbox objects={pzs} />
      </div>
      <Grid container justifyContent="flex-start">
        <Grid item>
          <Button
            variant="outlined"
            style={{ color: "white", backgroundColor: "#b8b8b8", border: "none", borderRadius: 20 }}
            onClick={() => router.push('/areas')}
          >
            戻る
          </Button>
        </Grid>
      </Grid>
      {alertSeverity && (
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
      )}
    </div>
  );
};

export default AreaEdit;
