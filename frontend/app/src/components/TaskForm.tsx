import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from '../../lib/axiosInstance';
import { useCallback, useEffect, useState } from 'react';

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
  task_type: TaskTypeObject;
}

interface TaskTypeObject {
  id: number;
  name: string;
  short_name: string;
  description: string;
}

interface Props {
  task_id: string;
}

const TaskForm = ({task_id}: Props) => {
  const [task, setTask] = useState<TaskObject>();

  const getTaskData = useCallback(async () => {
    try {
      const response = await axios.get(`/tasks/${task_id}`);
      console.log("Task response");
      console.log(response);
      setTask(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [task_id]);

  useEffect(() => {
    getTaskData();
  }, [getTaskData]);

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid container spacing={1} style={{ border: "2px solid black", marginBottom: "20px" }}>
          <Grid item xs={1} style={{ padding: '0'}}>
            <Typography>Task  {task_id}</Typography>
          </Grid>
          <Grid item xs={1} style={{ padding: '0'}}>
            <Typography>{task.task_type.short_name}</Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: '0'}}>
            <Typography>{task.task_type.name}</Typography>
          </Grid>
          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>{task.rule}</Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: '0'}}>
            <Typography>Marker Colour  {task.marker_color}</Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography />
          </Grid>
          <Grid item xs={4} style={{ padding: '0'}}>
            <Typography>Marker Drop  {task.marker_drop}</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography />
          </Grid>
          <Grid item xs={10} style={{ padding: '0', height: '100px' }}>
            <Typography whiteSpace="pre-line">{task.description}</Typography>
          </Grid>

          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>Scoring Period</Typography>
          </Grid>
          <Grid item xs={6} style={{ padding: '0'}}>
            <Typography>{task.scoring_period}</Typography>
          </Grid>
          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>MMA</Typography>
          </Grid>
          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>{task.mma}</Typography>
          </Grid>

          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>Scoring Area</Typography>
          </Grid>
          <Grid item xs={6} style={{ padding: '0'}}>
            <Typography>{task.scoring_area}</Typography>
          </Grid>
          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>Logger Marker</Typography>
          </Grid>
          <Grid item xs={2} style={{ padding: '0'}}>
            <Typography>{task.logger_marker}</Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default TaskForm;
