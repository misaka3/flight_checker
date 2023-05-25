import { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { Box, Button, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Switch, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import styles from 'styles/components/dialog.module.css';
import axios from '../../lib/axiosInstance';
import { Waypoint } from '../../types/interface';

interface SimpleDialogProps {
  open: boolean;
  data?: FlightData;
  string: string;
  onClose: (value: string) => void;
  onSaveOption: (waypoints: Waypoint[] | [], mapStyle: string) => void;
  onAreaChange: (e: SelectChangeEvent<number>) => void;
  onAltFlgChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  altFlg: boolean;
  areaId: number;
  areas: any[];
}

interface AddWptProps {
  onWaypointsLoaded?: (waypoints: Waypoint[] | []) => void;
};

interface FlightData {
  date: string;
  flightTime: string;
  takeofftime: string;
  landingtime: string;
  maxAltitude: string;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({ open, data, string, onClose, onSaveOption, onAreaChange, onAltFlgChange, altFlg, areaId, areas }) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('md');
  const [file, setFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('mapbox://styles/mapbox/streets-v11');

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyle(event.target.value);
  };

  const createWaypoint = async (filename: string, data: string) => {
    try {
      await axios.post('/waypoints', {
        file_name: filename,
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose(string);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
  
      if (fileExtension !== 'wpt') {
        alert(".wptファイルを選択してください");
        return;
      }
      setFile(e.target.files?.[0] || null);
    }
  };

  // 引数の文字列strの前後の空白を削除して返す
  const removeSpace = (str: string) => {
    return str.replace(/^\s+|\s+$/g, '');
  };

  const saveOption = async () => {
    if (onSaveOption === undefined) return;

    let waypoints = await AddWpt();

    if (waypoints === undefined) {
      waypoints = [];
    }
    onSaveOption(waypoints, selectedStyle);
  };

  const AddWpt = () => {
    return new Promise<Waypoint[]>((resolve, reject) => {
      let waypoints: Waypoint[] = [];
      if (!file) {
        handleClose();
        resolve(waypoints);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event || !event.target) {
          alert("ファイルの読み込みに失敗しました");
          console.log(event);
          return;
        }
        const data = event.target.result;
        if (typeof data !== 'string') {
          alert("ファイルの読み込みに失敗しました");
          console.log(data);
          return;
        }

        // wptテーブルに保存する
        createWaypoint(file.name, data);

        const lines = data.split('\n');
        if (lines[0].indexOf('OziExplorer') === -1) {
          alert('OziExplorerのwptファイルのみインポート可能です');
          return;
        }

        // 最初の4行はヘッダ情報なので無視
        for (let i = 4; i < lines.length; i++) {
          const line = lines[i];
          const fields = line.split(',');
          if (fields[0] === '') break;

          const waypoint: Waypoint = {
            number: Number(removeSpace(fields[0])),
            name: removeSpace(fields[1]),
            latitude: Number(removeSpace(fields[2])),
            longitude: Number(removeSpace(fields[3])),
            made_by: removeSpace(fields[10]),
            radius: Number(removeSpace(fields[13])), // meter
            altitude: Number(removeSpace(fields[14])), // feet
          };
          waypoints.push(waypoint);
        }

        handleClose();
        resolve(waypoints);
      };
      reader.onerror = (event) => {
        console.error("File could not be read");
        reject(new Error("File could not be read"));
      }
      reader.readAsText(file);
    });
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
      <DialogTitle style={{ textAlign: "center"}}>{string}</DialogTitle>
      { string === 'フライトログ' && data && (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>フライト日時： {data.date}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>離陸時間： {data.takeofftime}</TableCell>
              <TableCell>着陸時間： {data.landingtime}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>フライト時間： {data.flightTime}</TableCell>
              <TableCell>最高高度： {data.maxAltitude}</TableCell>
            </TableRow>
          </TableBody>
          </Table>
      )}
      { string === 'オブジェクト管理' && (
        <div className={styles.dialogForm}>
          <RadioGroup name="rtoggle" value={selectedStyle} onChange={handleStyleChange} style={{ flexDirection: "row" }}>
            <FormControlLabel value="mapbox://styles/mapbox/satellite-v9" control={<Radio />} label="satellite" />
            <FormControlLabel value="mapbox://styles/mapbox/light-v10" control={<Radio />} label="light" />
            <FormControlLabel value="mapbox://styles/mapbox/dark-v10" control={<Radio />} label="dark" />
            <FormControlLabel value="mapbox://styles/mapbox/streets-v11" control={<Radio />} label="streets" />
            <FormControlLabel value="mapbox://styles/mapbox/outdoors-v11" control={<Radio />} label="outdoors" />
          </RadioGroup>

          {/* PZ表示のセレクトフォーム */}
          <FormControl fullWidth required>
            <InputLabel>PZ表示</InputLabel>
            <Select
              label="PZ表示"
              value={areaId}
              onChange={onAreaChange}
              style={{ height: '50px', backgroundColor: 'white' }}
            >
              {areas.map((area: any) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 高度補正のSwitch */}
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={altFlg} onChange={onAltFlgChange} color="default" />}
              label="高度補正"
              style={{ height: "50px", marginRight: "24px" }}
            />
          </FormGroup>

          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <input
                  id="file-upload-button"
                  type="file"
                  accept=".wpt"
                  onChange={handleFileUpload}
                  className={styles.fileUploadButton}
                />
                <label htmlFor="file-upload-button">
                  <IconButton color="default" component="span" aria-label="upload file" sx={{color: '#28282a'}}>
                    <AttachFileIcon />
                  </IconButton>
                </label>
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled
                  value={file ? file.name : '.wptファイルを選択してください'}
                  InputProps={{
                    className: styles.inputWptField,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveOption()}
              >
                保存
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </Dialog>
  );
}

export default SimpleDialog;