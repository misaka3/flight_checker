import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { Box, Button, Grid, IconButton, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import styles from 'styles/components/dialog.module.css';
import axios from '../../lib/axiosInstance';
import { Waypoint } from '../../types/interface';

interface SimpleDialogProps {
  open: boolean;
  data?: FlightData;
  string: string;
  onClose: (value: string) => void;
  onWaypointsLoaded?: (waypoints: Waypoint[]) => void;
}

interface AddWptProps {
  onWaypointsLoaded?: (waypoints: Waypoint[]) => void;
};

interface FlightData {
  date: string;
  flightTime: string;
  takeofftime: string;
  landingtime: string;
  maxAltitude: string;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({ open, data, string, onClose, onWaypointsLoaded }) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('md');
  const [file, setFile] = useState<File | null>(null);

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

  const AddWpt = ({ onWaypointsLoaded }: AddWptProps) => {
    if (!file) {
      alert(".wptファイルを選択してください");
      return;
    }

    const waypoints: Waypoint[] = [];

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
      console.log("data");
      console.log(data);

      // wptテーブルに保存する
      createWaypoint(file.name, data);

      const lines = data.split('\n');
      // lines[0]に'OziExplorer'が入っていなければalertを出してreturn
      if (lines[0].indexOf('OziExplorer') === -1) {
        alert('OziExplorerのwptファイルのみインポート可能です');
        return;
      }

      if (onWaypointsLoaded === undefined) return;

      for (let i = 4; i < lines.length; i++) { // 最初の4行はヘッダ情報なので無視
        const line = lines[i];
        const fields = line.split(','); // 各行をカンマで分割
        if (fields[0] === '') return;

        const waypoint = {
          number: fields[0],
          name: fields[1],
          latitude: fields[2],
          longitude: fields[3],
          made_by: fields[10],
          radius: fields[13], // meter
          altitude: fields[14], // feet
        };
        waypoints.push(waypoint);
        handleClose();
        // waypointsを親コンポーネントに渡す
        onWaypointsLoaded(waypoints);
      }
    };
    console.log("waypoints");
    console.log(waypoints);
    reader.readAsText(file);
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
                onClick={() => AddWpt({ onWaypointsLoaded })}
              >
                wptを描画
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </Dialog>
  );
}

export default SimpleDialog;