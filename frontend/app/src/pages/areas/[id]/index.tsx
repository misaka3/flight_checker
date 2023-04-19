import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../../../../lib/axiosInstance";
import { TextField, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import Link from "next/link";

const AreaEdit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [area, setArea] = useState(null);

  useEffect(() => {
    if (id) {
      getAreaData();
    }
  }, [id]);

  const getAreaData = async () => {
    try {
      const response = await axios.get(`/areas/${id}`);
      setArea(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (pzId: number) => {
    try {
      await axios.delete(`/prohibited_zones/${pzId}`);
      getAreaData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!area) return <div>Loading...</div>;

  return (
    <div>
      <Box>
        <TextField label="ID" value={area.id} InputProps={{ readOnly: true }} />
        <TextField label="Name" value={area.name} InputProps={{ readOnly: true }} />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Radius</TableCell>
              <TableCell>Altitude</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {area.prohibited_zones.map((pz) => (
              <TableRow
                key={pz.id}
                hover
                onClick={() => router.push(`/pzs/${pz.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{pz.id}</TableCell>
                <TableCell>{pz.name}</TableCell>
                <TableCell>{pz.pz_type}</TableCell>
                <TableCell>{pz.longitude}</TableCell>
                <TableCell>{pz.latitude}</TableCell>
                <TableCell>{pz.radius}</TableCell>
                <TableCell>{pz.altitude}</TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(pz.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AreaEdit;
