import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from "../../../../lib/axiosInstance";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import PageTitle from 'components/PageTitle';
import { format } from 'date-fns';
import jaLocale from 'date-fns/locale/ja';
import TaskForm from 'components/TaskForm'
import Mapbox from "components/Mapbox";
import { mgrsToLatLon } from 'utils/coordinateUtils';
import { createIconLayer, createPzLayers } from 'utils/layerUtils';
import { IconLayer } from '@deck.gl/layers/typed';

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
  tasks:TaskObject[];
  area: AreaObject;
  event: EventObject;
}

interface AreaObject {
  id: number;
  name: string;
  utm_zone: string;
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

interface EventObject {
  id: number;
  area_id: number;
  director: string;
  name: string;
  start_term: string;
  end_term: string;
}

interface TaskObject {
  id: number;
  task_type_id: number;
  flight_id: number;
  task_num: number;
  rule: string;
  marker_color: string;
  marker_drop: string;
  mma: string;
  logger_marker: string;
  description: string;
  scoring_period: string;
  scoring_area: string;
}

const FlightPage = () => {
  const router = useRouter();
  // flight.id
  const { id } = router.query;
  const [layers, setLayers] = useState<IconLayer[]>([]);
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number]>();
  const [flight, setFlight] = useState<FlightObject>();

  const getLatLon = (utm_zone: string, clp_coordinates: string): (number[] | undefined) => {
    const regex = /(\d{4}).+(\d{4})/;
    const result = clp_coordinates.match(regex);
    if (result !== null) {
      const [_, firstFourDigits, secondFourDigits] = result;
      const utm_coordinates = `${utm_zone}${firstFourDigits}0${secondFourDigits}0`;
      const wgs_coordinates = mgrsToLatLon(utm_coordinates);
      return wgs_coordinates;
    } else {
      return undefined;
    }
  };

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

  // create layers for mapbox
  useEffect(() => {
    if (flight !== undefined) {
      let new_layers = []
      const coordinates = getLatLon(flight.area.utm_zone, flight.clp);
      if (coordinates !== undefined && coordinates.length === 2) {
        // createIconLayer
        const coordinatesTuple: [number, number] = [coordinates[1], coordinates[0]];
        setInitialCoordinates(coordinatesTuple);
        const iconLayer = createIconLayer({ coordinates: coordinatesTuple });
        new_layers.push(iconLayer);
        const pzs = flight.area.prohibited_zones;
        if (pzs.length > 0) {
          const pz_layers = createPzLayers(pzs);
          pz_layers.map(pz_layer => new_layers.push(pz_layer));
        }
        setLayers(new_layers);
      }
    }
  }, [flight]);
  
  if (!flight) return <div>Loading...</div>;

  return (
    <div>
      <PageTitle title={format(new Date(flight.task_briefing_datetime), 'yyyy年M月d日(E) HH時mm分', { locale: jaLocale })} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '20px' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', p: 2, mb: '16px' }}>
          <Link href={`/tasks/new?flight_id=${id}`} passHref>
            <Button variant="contained" color="primary">タスク登録</Button>
          </Link>
        </Box>
        <Grid container spacing={1} style={{ border: "1px solid black" }}>
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
            {flight.tasks.map((task, index) => `#${task.task_num}${index === flight.tasks.length - 1 ? "" : ", "}`)}
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
      </Box>
      {flight.tasks.length > 0 && (
        flight.tasks.map((task: TaskObject) => (
          <TaskForm key={task.id} task_id={task.id.toString()} />
        ))
      )}
      <div style={{ flexGrow: 1, position: "relative", height: "400px", marginBottom: "32px" }}>
        {layers.length > 0 && initialCoordinates && (
          <Mapbox layers={layers} initialCoordinates={initialCoordinates} />
        )}
      </div>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', p: 2 }}>
        <Link href="/events" passHref>
          <Button variant="contained" color="primary">戻る</Button>
        </Link>
      </Box>
    </div>
  );
};

export default FlightPage;
