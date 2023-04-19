import React, { useEffect, useState } from "react";
import axios from "../../../lib/axiosInstance";
import { useRouter } from "next/router";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

interface Area {
  id: number;
  name: string;
}

const Areas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAreas = async () => {
      const response = await axios.get("/areas");
      setAreas(response.data);
    };

    fetchAreas();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/areas/${id}`);
      setAreas(areas.filter((area) => area.id !== id));
    } catch (error) {
      console.error("Error deleting area:", error);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/areas/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {areas.map((area) => (
            <TableRow key={area.id} hover onClick={() => handleRowClick(area.id)}>
              <TableCell>{area.id}</TableCell>
              <TableCell>{area.name}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={(e) => {e.stopPropagation(); handleDelete(area.id);}}>
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Areas;
