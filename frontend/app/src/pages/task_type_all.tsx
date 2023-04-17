// pages/task-types.tsx
import React, { useEffect, useState } from "react";
import axios from "../../lib/axiosInstance";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface TaskType {
  id: number;
  name: string;
  description: string;
}

const TaskTypes: React.FC = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);

  useEffect(() => {
    axios
      .get("/task_types")
      .then((response) => {
        console.log('response.data:', response.data);
        setTaskTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskTypes.map((taskType) => (
            <TableRow key={taskType.id}>
              <TableCell component="th" scope="row">
                {taskType.id}
              </TableCell>
              <TableCell>{taskType.name}</TableCell>
              <TableCell>{taskType.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTypes;
