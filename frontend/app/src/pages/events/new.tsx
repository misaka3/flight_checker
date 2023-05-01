import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "../../../lib/axiosInstance";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import DatePicker from "components/DatePicker";
import PageTitle from "components/PageTitle";
import dayjs from "dayjs";

interface NewEvent {
  name: string;
  area_id: number;
  director: string;
  start_term: Date | null;
  end_term: Date | null;
}

const initialFormData: NewEvent = {
  name: "",
  area_id: 0,
  director: "",
  start_term: null,
  end_term: null,
};

const EventsNew = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [areas, setAreas] = useState([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (e: SelectChangeEvent<number>) => {
    const areaId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, area_id: areaId }));
  };

  const handleStartDateChange = (date: Date | null) => {
    console.log("start_date");
    console.log(date);
    setFormData((prev) => ({ ...prev, start_term: date }));
  };

  const handleEndDateChange = (date: Date | null) => {
    console.log("end_date");
    console.log(date);
    setFormData((prev) => ({ ...prev, end_term: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const convertedFormData = {
      ...formData,
      start_term: dayjs(formData.start_term).format('YYYY-MM-DD HH:mm:ss'),
      end_term: dayjs(formData.end_term).format('YYYY-MM-DD HH:mm:ss')
    };

    try {
      await axios.post("/events", convertedFormData);
      router.push(`/events?alert=info`);
    } catch (error) {
      router.push(`/events?alert=error`);
      console.error("Error creating event:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get("/areas");
      setAreas(response.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  React.useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <div style={{ width: "60%", margin: "auto"  }}>
      <PageTitle title="大会登録" />
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="name"
                label="大会名"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>エリア</InputLabel>
                <Select
                  name="area_id"
                  value={formData.area_id}
                  onChange={handleAreaChange}
                >
                  {areas.map((area: any) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="director"
                label="イベントディレクター"
                variant="outlined"
                value={formData.director}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5}>
              <DatePicker label="開始日" value={formData.start_term} onChange={handleStartDateChange} />
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography>〜</Typography>
            </Grid>
            <Grid item xs={5}>
              <DatePicker label="終了日" value={formData.end_term} onChange={handleEndDateChange} />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                  登録
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

export default EventsNew;
