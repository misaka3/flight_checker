import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import RootMapbox from 'components/RootMapbox';
import styles from 'styles/pages/index.module.css';
import axios from '../../lib/axiosInstance';
import { gpx } from '@tmcw/togeojson';
import { createPathLayer, createPzLayers, createScatterplotLayer, layerIdChange } from 'utils/layerUtils';
import { getInitialCoordinates } from 'utils/coordinateUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Dialog from 'components/Dialog';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CachedIcon from '@mui/icons-material/Cached';

const RootPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState<number>(1);
  const [layers, setLayers] = useState<any[]>([]);
  const [gpxLayer, setGpxLayer] = useState<any>();
  const [pzLayers, setPzLayers] = useState<any[]>([]);
  const [scatterplotLayer, setScatterplotLayer] = useState<any>();
  const [newScatterplotLayer, setNewScatterplotLayer] = useState<any>();
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number]>();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [scatterplotFlg, setScatterplotFlg] = useState(true); // true: Full display layer, false: Part display layer
  const [geoJSONData, setGeoJSONData] = useState<Array<any>>([]);
  const [open, setOpen] = useState(false);

  const gpxAnimationSwitch = (flg: boolean) => {
    setPlaying(flg);
    setScatterplotFlg(false);
  };

  const displayGpxFullPath = () => {
    setPlaying(false);
    setScatterplotFlg(true);
    setCurrentFrameIndex(0);

    let new_layers = [...pzLayers];
    // new_layers.push(gpxLayer);
    new_layers.push(scatterplotLayer);
    setLayers([new_layers]);
  };

  // gpxLayer(scatterplotLayer)'s timelapsed animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let frameIndex = currentFrameIndex;
    if (playing && geoJSONData && frameIndex < geoJSONData[0].geometry.coordinates.length) {
      timer = setInterval(() => {
        frameIndex += 1;
        setCurrentFrameIndex(frameIndex);
        let geoJSONData_copy = JSON.parse(JSON.stringify(geoJSONData));
        geoJSONData_copy[0].geometry.coordinates = geoJSONData[0].geometry.coordinates.slice(0, frameIndex);
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
    if (e.target.files !== null && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
  
      if (fileExtension !== 'gpx') {
        alert(".gpxファイルを選択してください");
        return;
      }
    }
    setFile(e.target.files?.[0] || null);
  };
  
  const handleAreaChange = (e: SelectChangeEvent<number>) => {
    setAreaId(Number(e.target.value));
  };

  useEffect(() => {
    displayPzLayers();
  }, [areaId]);

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
  
  const createGpxLog = async (filename: string) => {
    try {
      await axios.post('/gpx_logs', {
        file_name: filename
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = (altitudeFlg: boolean) => {
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    createGpxLog(file.name);

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
        new_layers.unshift(path_layer);
        const scatterplot_layer = createScatterplotLayer(geoJSONData.features, setHoverInfo, altitudeFlg);
        setScatterplotLayer(scatterplot_layer);
        new_layers.unshift(scatterplot_layer);
        setInitialCoordinates(getInitialCoordinates(geoJSONData.features));
      }
      setLayers([new_layers]);
    };
    reader.readAsText(file);
  };

  const handleFlightLogClick = () => {
    console.log('Flight log button clicked');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    layers.length > 0 && initialCoordinates ? (
      <div className={styles.mapBackground}>
        <div className={styles.mapboxArea}>
          <RootMapbox layers={layers} initialCoordinates={initialCoordinates} hoverInfo={hoverInfo} />
        </div>
        <Box className={styles.container}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                className={styles.backRootButton}
                onClick={() => router.reload()}
              >
                選択画面に戻る
              </Button>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth required>
                <InputLabel>PZ表示</InputLabel>
                <Select
                  label="PZ表示"
                  value={areaId}
                  onChange={handleAreaChange}
                  style={{ height: '50px', backgroundColor: 'white' }}
                >
                  {areas.map((area: any) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <div style={{ textAlign: "center" }}>
                { playing ? (
                  <Button onClick={() => gpxAnimationSwitch(false)} variant="contained" color="error" startIcon={<StopIcon />} className={styles.gpxAnimateButton}>
                    停止
                  </Button>
                ) : (
                  <Button onClick={() => gpxAnimationSwitch(true)} variant="contained" color="primary" startIcon={<PlayArrowIcon />} className={styles.gpxAnimateButton}>
                  再生
                </Button>
                )}
              </div>
            </Grid>
            <Grid item xs={2}>
              { !scatterplotFlg ? (
                <Button onClick={displayGpxFullPath} variant="outlined" color="error" startIcon={<CachedIcon />} className={styles.gpxClearButton}>
                  クリア
                </Button>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={3}>
              <></>
              {/* <div style={{ textAlign: "right" }}>
                <Button
                  variant="outlined"
                  style={{backgroundColor: "#fff", color: "black", height: "50px", marginRight: "16px"}}
                  onClick={() => handleButtonClick(true)}
                >
                  高度補正
                </Button>
                <Button variant="outlined" onClick={handleClickOpen} startIcon={<SportsScoreIcon />} style={{backgroundColor: "#fff", color: "black", height: "50px", marginRight: "16px"}}>
                  フライトログ
                </Button>
                <Dialog
                  open={open}
                  // TODO: Change data to flight log data
                  data={{ date: "2019-10-31", takeofftime: "06:00:00", landingtime: "06:29:54", flightTime: "29m54s", maxAltitude: "2532ft" }}
                  string={'フライトログ'}
                  onClose={handleClose}
                />
                </div> */}
            </Grid>
          </Grid>
        </Box>
      </div>
    ) : (
      <div className={styles.rootImg}>
        <div className={styles.gpxForm}>
          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <input
                  id="file-upload-button"
                  type="file"
                  accept=".gpx"
                  onChange={handleFileUpload}
                  className={styles.fileUploadButton}
                />
                <label htmlFor="file-upload-button">
                  <IconButton color="default" component="span" aria-label="upload file" sx={{color: 'white'}}>
                    <AttachFileIcon />
                  </IconButton>
                </label>
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  disabled
                  value={file ? file.name : '.gpxファイルを選択してください'}
                  fullWidth
                  InputProps={{
                    className: styles.inputGpxField,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <Button
                onClick={() => handleButtonClick(false)}
                className={styles.gradient}
              >
                航跡図を描画
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  )
}

export default RootPage;
