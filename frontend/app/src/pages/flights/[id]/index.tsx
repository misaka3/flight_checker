import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from "../../../../lib/axiosInstance";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import PageTitle from 'components/PageTitle';
import { format } from 'date-fns';
import jaLocale from 'date-fns/locale/ja';

interface FlightObject {
  id: number;
  event_id: number;
  task_briefing_datetime: Date;
  order_type: boolean;
  launch_period: string;
  observer: boolean;
  next_briefing: string;
  qnh: string;
  launch_reqmts: string;
  clp: string;
  solo_flight: boolean;
  search_period: string;
  sunrise: Date;
  sunset: Date;
  notes: string;
}

const FlightPage = () => {
  const router = useRouter();
  // flight.id
  const { id } = router.query;

  const [flight, setFlight] = useState<FlightObject>();

  const getFlightData = useCallback(async () => {
    try {
      const response = await axios.get(`/flights/${id}`);
      console.log("flight response");
      console.log(response);
      setFlight(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getFlightData();
  }, [getFlightData]);
  
  if (!flight) return <div>Loading...</div>;

  return (
    <div>
      <PageTitle title={format(new Date(flight.task_briefing_datetime), 'yyyy年M月d日(E) HH時mm分', { locale: jaLocale })} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', p: 2, mb: '16px' }}>
          <Link href={`/tasks/new?flight_id=${id}`} passHref>
            <Button variant="contained" color="primary">タスク登録</Button>
          </Link>
        </Box>
        <Grid container spacing={2} style={{ border: "1px solid black" }}>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>{format(new Date(flight.task_briefing_datetime), 'EEEE')}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>{format(new Date(flight.task_briefing_datetime), 'd-MMM-yyyy')}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>{format(new Date(flight.task_briefing_datetime), "a, hhmm")}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Task</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>#1, #2, #3, #4</Typography>
          </Grid>

          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Task / Marker</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{ flight.order_type ? 'in Order' : 'in Any Order'}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>CLP</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{flight.clp}</Typography>
          </Grid>

          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Launch Period</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{flight.launch_period}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>PZ</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>All PZs in Force</Typography>
          </Grid>

          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Observer</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{ flight.observer ? 'applicable' : 'not applicable'}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Solo Flight</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{flight.solo_flight ? 'Required' : 'Not Required'}</Typography>
          </Grid>

          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Next Briefing</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{flight.next_briefing}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Search Period</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{flight.search_period}</Typography>
          </Grid>

          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>QNH</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{flight.qnh}</Typography>
          </Grid>
          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Sunrise / Sunset</Typography>
          </Grid>
          <Grid item xs={4} style={{ border: "1px solid black" }}>
            <Typography>{format(new Date(flight.sunrise), 'hhmm')} / {format(new Date(flight.sunset), 'hhmm')}</Typography>
          </Grid>

          <Grid item xs={2} style={{ border: "1px solid black" }}>
            <Typography>Launch Reqmt</Typography>
          </Grid>
          <Grid item xs={10} style={{ border: "1px solid black" }}>
            <Typography>{flight.launch_reqmts}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', p: 2 }}>
          <Link href="/events" passHref>
            <Button variant="contained" color="primary">戻る</Button>
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default FlightPage;
