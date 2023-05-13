import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "../../../../lib/axiosInstance";
import { Alert, AlertColor, Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Typography, Grid, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Mapbox from "components/Mapbox";
import { createPzLayers } from "utils/layerUtils";
import PageTitle from 'components/PageTitle';

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

interface ViewStateType {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

const AreaEdit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { alert } = router.query;
  const [area, setArea] = useState<Area>();
  const [layers, setLayers] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor | null>(null);
  const [initialViewState, setInitialViewState] = useState<ViewStateType>();

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
    if (alert) {
      showAlert(alert as AlertColor);
    }
  }, [alert]);

  const getAreaData = useCallback(async () => {
    try {
      const response = await axios.get(`/areas/${id}`);
      setInitialViewState(response.data.initial_viewstate);
      setArea(response.data);

      if (response.data.prohibited_zones) {
        const pz_layers = createPzLayers(response.data.prohibited_zones);
        setLayers(pz_layers);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getAreaData();
  }, [getAreaData]);

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
      <PageTitle title={`${area.name}エリア`} />
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
                {/* <TableCell>PZタイプ</TableCell> */}
                <TableCell>座標タイプ</TableCell>
                <TableCell>コーディネート</TableCell>
                <TableCell>半径</TableCell>
                <TableCell>高さ(ft)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {area.prohibited_zones.length > 0 ? (
                area.prohibited_zones.map((pz: PzObject) => (
                  <TableRow
                    key={pz.id}
                    hover
                    onClick={() => router.push(`/pzs/${pz.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{pz.id}</TableCell>
                    <TableCell>{pz.name}</TableCell>
                    {/* <TableCell>{pz.pz_type}</TableCell> */}
                    <TableCell>{('grid_type' in pz.data && pz.data.grid_type) ? 'UTM' : 'WGS84'}</TableCell>
                    {'grid_type' in pz.data ? (
                      pz.data.grid_type ? (
                        <TableCell>{pz.data.utm_coordinates}</TableCell>
                      ) : (
                        <TableCell>{pz.data.coordinates[0]}, {pz.data.coordinates[1]}</TableCell>
                      )
                    ) : (
                      <TableCell>{JSON.stringify(pz.data.contour)}</TableCell>
                    )}
                    <TableCell>{'radius' in pz.data ? pz.data.radius : 'なし'}</TableCell>
                    <TableCell>{pz.data.altitude}</TableCell>
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
        {layers.length > 0 && initialViewState && (
          <Mapbox layers={layers} initialViewState={initialViewState} />
        )}
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
