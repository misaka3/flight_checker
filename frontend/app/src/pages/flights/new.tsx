import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, FormControlLabel, Checkbox, Grid, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "../../../lib/axiosInstance";
import DateTimePicker from 'components/DateTimePicker';
import TimePicker from 'components/TimePicker';
import PageTitle from 'components/PageTitle';
import dayjs, { Dayjs } from 'dayjs';

export default function NewFlight() {
  const router = useRouter();
  const { event_id } = router.query;

  const [flight, setFlight] = useState({
    event_id: event_id,
    task_briefing_datetime: dayjs(),
    order_type: 'in Order',
    launch_period: 'Green Flag + 30 min.',
    observer: '',
    next_briefing: '0600, at Place',
    qnh: '1013hPa',
    launch_reqmts: 'Common Launch Area',
    clp: 'CLP 0000 - 0000',
    solo_flight: '指定しない',
    search_period: 'not applied',
    sunrise: dayjs(),
    sunset: dayjs(),
    notes: '',
    pz: 'All PZs in Force',
  });

  const handleInputChange = (event) => {
    console.log("event.target.name, event.target.value");
    console.log(event.target.name, event.target.value);
    setFlight({ ...flight, [event.target.name]: event.target.value });
  };

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    console.log(newValue);
    if (newValue !== null) {
      setFlight({ ...flight, task_briefing_datetime: newValue });
    }
  };

  const handleTimeChange = (field: string) => (newValue: Dayjs | null) => {
    console.log(newValue);
    if (newValue !== null) {
      setFlight({ ...flight, [field]: newValue });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/flights', flight);
      router.push(`/events/${event_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ width: "60%", margin: "auto"  }}>
      <PageTitle title="フライト登録" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DateTimePicker
            label="ブリーフィング日時"
            value={flight.task_briefing_datetime}
            onChange={handleDateTimeChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Order Type</InputLabel>
            <Select
              name="order_type"
              label="Order Type"
              value={flight.order_type}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="in Order">in Order</MenuItem>
              <MenuItem value="in Any Order">in Any Order</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Observer</InputLabel>
            <Select
              name="observer"
              label="Observer"
              value={flight.observer}
              onChange={handleInputChange}
            >
              <MenuItem value="false">not applicable</MenuItem>
              <MenuItem value="true">applicable</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Solo Flight</InputLabel>
            <Select
              name="solo_flight"
              label="Solo Flight"
              value={flight.solo_flight}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="true">指定する</MenuItem>
              <MenuItem value="false">指定しない</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>PZ</InputLabel>
            <Select
              name="pz"
              label="PZ"
              value={flight.pz}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="All PZs in Force">All PZs in Force</MenuItem>
              <MenuItem value="個別に選択する">個別に選択する</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField name="launch_period" label="Launch Period" value={flight.launch_period} onChange={handleInputChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField name="next_briefing" label="Next Briefing" value={flight.next_briefing} onChange={handleInputChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField name="qnh" label="QNH" value={flight.qnh} onChange={handleInputChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField name="launch_reqmts" label="Launch Requirements" value={flight.launch_reqmts} onChange={handleInputChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField name="clp" label="CLP" value={flight.clp} onChange={handleInputChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField name="search_period" label="Search Period" value={flight.search_period} onChange={handleInputChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TimePicker
            label="日の出"
            value={flight.sunrise}
            onChange={handleTimeChange('sunrise')}
          />
        </Grid>
        <Grid item xs={12}>
          <TimePicker
            label="日の入り"
            value={flight.sunrise}
            onChange={handleTimeChange('sunset')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField name="notes" label="Notes" value={flight.notes} onChange={handleInputChange} multiline fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => router.push(`/events/${event_id}/index.tsx`)}>
              戻る
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              登録
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
