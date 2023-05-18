import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '~/styles/pages/index.module.css';

const RootPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleButtonClick = () => {
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    // /flights/view.tsxへ遷移し、fileを引数(file)として渡す
    router.push({
      pathname: '/flights/view'
    });
  };

  return (
    <div style={{
      backgroundImage: "url('/sky_00136.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      width: "100vw",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{ width: "60%", maxWidth: "550px", margin: "auto" }}>
        <Box mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <input
                id="file-upload-button"
                type="file"
                accept=".gpx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
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
                  style: {
                    height: '40px',
                    padding: '0 12px',
                    backgroundColor: 'white',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <Button
              onClick={() => handleButtonClick()}
              className={styles.gradient}
            >
              航跡図を描画
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default RootPage;
