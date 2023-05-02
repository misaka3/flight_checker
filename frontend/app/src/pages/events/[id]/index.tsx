import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from "../../../../lib/axiosInstance";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import PageTitle from 'components/PageTitle';
import { format } from 'date-fns';
import jaLocale from 'date-fns/locale/ja';

interface Event {
  id: number;
  name: string;
  flights: FlightObject[];
}

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

const EventPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<Event>();

  const getEventData = useCallback(async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getEventData();
  }, [getEventData]);

  const deleteFlight = async (flightId: number) => {
    try {
      await axios.delete(`/flights/${flightId}`);
      getEventData();
    } catch (error) {
      console.error(error);
    }
  };
  
  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <PageTitle title={event.name} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Link href={`/flights/new?event_id=${id}`} passHref>
            <Button variant="contained" color="primary">フライト登録</Button>
          </Link>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ブリーフィング日時</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {event.flights.length > 0 ? (
                event.flights.map(flight => (
                  <TableRow
                    key={flight.id}
                    hover
                    onClick={() => router.push(`/flights/${flight.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{format(new Date(flight.task_briefing_datetime), 'yyyy年M月d日(E) HH時mm分', { locale: jaLocale })}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => deleteFlight(flight.id)}>
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    フライト情報が登録されていません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', p: 2 }}>
          <Link href="/events" passHref>
            <Button variant="contained" color="primary">戻る</Button>
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default EventPage;
