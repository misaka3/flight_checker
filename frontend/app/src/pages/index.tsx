import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Button, Grid, IconButton, SelectChangeEvent, TextField } from '@mui/material';
import RootMapbox from 'components/RootMapbox';
import styles from 'styles/pages/index.module.css';
import axios from '../../lib/axiosInstance';
import { gpx } from '@tmcw/togeojson';
import { createPzLayers, createScatterplotLayer, createWptLayer, layerIdChange } from 'utils/layerUtils';
import { getInitialCoordinates } from 'utils/coordinateUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Dialog from 'components/Dialog';
import CachedIcon from '@mui/icons-material/Cached';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import { Waypoint } from '../../types/interface';

const RootPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState<number>(1);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number]>();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [scatterplotFlg, setScatterplotFlg] = useState(true); // true: Full display layer, false: Part display layer
  const [geoJSONData, setGeoJSONData] = useState<Array<any>>([]);
  const [open, setOpen] = useState(false);
  const [altFlg, setAltFlg] = useState(false);
  const [firstAltitude, setFirstAltitude] = useState(); // geoJSONData.features[0].geometry.coordinates[0][2]
  const [minAltitude, setMinAltitude] = useState(0);
  const [maxAltitude, setMaxAltitude] = useState(0);
  // layer
  const [layers, setLayers] = useState<any[]>([]);
  const [pzLayers, setPzLayers] = useState<any[]>([]);
  const [wptLayers, setWptLayers] = useState<any[]>([]);
  const [scatterplotAltOffLayer, setScatterplotAltOffLayer] = useState<any>();
  const [scatterplotAltOnLayer, setScatterplotAltOnLayer] = useState<any>();
  const [newScatterplotLayer, setNewScatterplotLayer] = useState<any>();

  const handleAltFlgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const flg = event.target.checked;
    setAltFlg(flg);
  };

  const gpxAnimationSwitch = (flg: boolean) => {
    setPlaying(flg);
    setScatterplotFlg(false);
  };

  const displayGpxFullPath = () => {
    setPlaying(false);
    setScatterplotFlg(true);
    setCurrentFrameIndex(0);

    let new_layers: any[] = [];
    if (pzLayers.length > 0) {
      new_layers = [...pzLayers];
    }
    if (wptLayers.length > 0) {
      wptLayers.map(wpt_layer => new_layers.push(wpt_layer));
    }
    if (altFlg) {
      new_layers.unshift(scatterplotAltOnLayer);
    } else {
      new_layers.unshift(scatterplotAltOffLayer);
    }
    setNewScatterplotLayer(undefined);
    setLayers(new_layers);
  };

  // gpxLayer(scatterplotLayer)'s timelapsed animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let frameIndex = currentFrameIndex;
    if (playing && geoJSONData && firstAltitude && frameIndex < geoJSONData[0].geometry.coordinates.length) {
      let geoJSONData_copy = JSON.parse(JSON.stringify(geoJSONData));
      const firstAlt = altFlg ? firstAltitude : 0;
      timer = setInterval(() => {
        frameIndex += 1;
        setCurrentFrameIndex(frameIndex);
        geoJSONData_copy[0].geometry.coordinates = geoJSONData[0].geometry.coordinates.slice(0, frameIndex);
        const scatterplot_layer = createScatterplotLayer(geoJSONData_copy, setHoverInfo, altFlg, minAltitude - firstAlt, maxAltitude - firstAlt);
        setNewScatterplotLayer(scatterplot_layer);
      }, 100);
    }
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, geoJSONData]);

  // Display newScatterplotLayer for gpx timelapsed animation
  useEffect(() => {
    if (pzLayers && newScatterplotLayer) {
      let new_layers = [...pzLayers];
      new_layers.push(newScatterplotLayer);
      if (wptLayers.length > 0) {
        wptLayers.map(wpt_layer => new_layers.push(wpt_layer));
      }
      setLayers(new_layers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSaveOption = async (waypoints: Waypoint[] | []) => {
    let new_layers: any[] = [];
    try {
      // create scatterplot_layer
      if (altFlg) {
        new_layers = [scatterplotAltOnLayer];
      } else {
        new_layers = [scatterplotAltOffLayer];
      }

      // create pz_layers
      const response = await axios.get(`/areas/${areaId}`);

      if (response.data.prohibited_zones) {
        let pz_layers = createPzLayers(response.data.prohibited_zones);
        pz_layers = layerIdChange(pz_layers);
        setPzLayers(pz_layers);
        pz_layers.map(pz_layer => new_layers.push(pz_layer));
      }

      // create wpt_layers
      if (waypoints && waypoints.length > 0) {
        let wpt_layers = createWptLayer(waypoints);
        wpt_layers = layerIdChange(wpt_layers);
        setWptLayers(wpt_layers);
        wpt_layers.map(wpt_layer => new_layers.push(wpt_layer));
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
  
  const getMinMaxAltitude = (geometry: any) => {
    const coordinates = geometry.coordinates;
    const firstAltitude = coordinates[0][2];
    let minAltitude = firstAltitude;
    let maxAltitude = firstAltitude;
    coordinates.map((coordinate: any) => {
      if (coordinate[2] < minAltitude) {
        minAltitude = coordinate[2];
      }
      if (maxAltitude < coordinate[2]) {
        maxAltitude = coordinate[2];
      }
    });

    return [firstAltitude, minAltitude, maxAltitude];
  };

  const flatGeoJSON = (geoJSONData: any) => {
    geoJSONData.features.forEach((d: any) => {
      if (d.geometry.type === "MultiLineString") {
        d.geometry.type = "LineString";
        d.geometry.coordinates = d.geometry.coordinates.flat();
        d.properties.coordinateProperties.times = d.properties.coordinateProperties.times.flat();
      }
    });
    return geoJSONData;
  };

  const handleButtonClick = (altitudeFlg: boolean) => {
    if (!file) {
      alert(".gpxファイルを選択してください");
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
        const flatGeoJsonData = flatGeoJSON(geoJSONData);

        setGeoJSONData(flatGeoJsonData.features);
        const [firstAltitude, minAltitude, maxAltitude] = getMinMaxAltitude(flatGeoJsonData.features[0].geometry);
        setFirstAltitude(firstAltitude);
        setMinAltitude(minAltitude);
        setMaxAltitude(maxAltitude);
        const scatterplot_off_layer = createScatterplotLayer(flatGeoJsonData.features, setHoverInfo, false, minAltitude, maxAltitude);
        setScatterplotAltOffLayer(scatterplot_off_layer);
        const scatterplot_on_layer = createScatterplotLayer(flatGeoJsonData.features, setHoverInfo, true, minAltitude, maxAltitude);
        setScatterplotAltOnLayer(scatterplot_on_layer);
        new_layers.unshift(scatterplot_off_layer);
        setInitialCoordinates(getInitialCoordinates(flatGeoJsonData.features));
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
              <></>
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={handleClickOpen} startIcon={<AddLocationAltOutlinedIcon />} style={{backgroundColor: "#e0e0e0", color: "black", height: "50px", marginRight: "16px", borderRadius: "30px"}}>
                  option
                </Button>
                <Dialog
                  open={open}
                  // data={{ date: "2019-10-31", takeofftime: "06:00:00", landingtime: "06:29:54", flightTime: "29m54s", maxAltitude: "2532ft" }}
                  string={'オブジェクト管理'}
                  onClose={handleClose}
                  onSaveOption={handleSaveOption}
                  onAreaChange={handleAreaChange}
                  onAltFlgChange={handleAltFlgChange}
                  altFlg={altFlg}
                  areaId={areaId}
                  areas={areas}
                />
              </div>
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
