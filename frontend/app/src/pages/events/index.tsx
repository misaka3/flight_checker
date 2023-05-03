import React, { useEffect, useState } from "react";
import axios from "../../../lib/axiosInstance";
import { useRouter } from "next/router";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import PageTitle from "components/PageTitle";
import { format } from 'date-fns';

interface Event {
  id: number;
  name: string;
  area_id: number;
  director: string;
  start_term: string;
  end_term: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get("/events");
      setEvents(response.data);
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting area:", error);
    }
  };

  const handleNewEventClick = () => {
    router.push("/events/new");
  };

  const handleRowClick = (id: number) => {
    router.push(`/events/${id}`);
  };

  const formatDate = (date: Date) => {
    return format(date, 'yyyy/MM/dd HH:mm');
  }

  return (
    <div>
      <PageTitle title="大会一覧" />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleNewEventClick}>
          大会登録
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>大会名</TableCell>
              <TableCell>エリア</TableCell>
              <TableCell>ED</TableCell>
              <TableCell>開催期間</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id} hover onClick={() => handleRowClick(event.id)} style={{ cursor: "pointer" }}>
                  <TableCell>{event.id}</TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.area_id}</TableCell>
                  <TableCell>{event.director}</TableCell>
                  <TableCell>{formatDate(new Date(event.start_term))} ～ {formatDate(new Date(event.end_term))}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/events/${event.id}/edit`);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      編集
                    </Button>
                    <Button variant="contained" color="error" onClick={(e) => {e.stopPropagation(); handleDelete(event.id);}}>
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  大会が登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Events;
