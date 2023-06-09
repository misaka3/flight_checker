import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Grid, Box, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import axios from "../../../lib/axiosInstance";
import PageTitle from 'components/PageTitle';

interface TaskTypeObject {
  id: number;
  name: string;
  short_name: string;
  description: string;
  rule_num: string;
  task_rules: Array<{
    rule_num: string;
    content: string;
  }>;
}

interface Task {
  task_type_id: number;
  flight_id: number;
  task_num: number;
  rule: string;
  marker_color?: string;
  marker_drop?: string;
  mma?: string;
  logger_marker?: string;
  description?: string;
  scoring_period: string;
  scoring_area: string;
}

export default function NewTask() {
  const router = useRouter();
  const { flight_id } = router.query;
  const [taskTypes, setTaskTypes] = useState<TaskTypeObject[]>([]);

  const initialTask = {
    task_type_id: 0,
    flight_id: Number(flight_id),
    task_num: 1,
    rule: '',
    marker_color: '',
    marker_drop: '',
    mma: '',
    logger_marker: '',
    description: '',
    scoring_period: '',
    scoring_area: ''
  };
  const [task, setTask] = useState<Task>(initialTask);

  useEffect(() => {
    const getTaskTypes = async () => {
      try {
        const response = await axios.get('/task_types');
        setTaskTypes(response.data.sort((a: TaskTypeObject, b: TaskTypeObject) => a.short_name.localeCompare(b.short_name)));
      } catch (error) {
        console.error(error);
      }
    };
    getTaskTypes();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (typeof event.target.name === 'string') {
      setTask({ ...task, [event.target.name]: event.target.value });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
  
    const selectedTaskType = taskTypes.find(
      (taskType) => taskType.id === Number(value)
    );
    if (selectedTaskType) {
      setTask({
        ...task,
        task_type_id: Number(value),
        rule: selectedTaskType.rule_num,
        description: selectedTaskType.task_rules
          .filter((rule) => rule.content.includes("Task data:"))
          .map((rule) => `${rule.content.replace("Task data:\\n", "").trim()}`)[0] || "",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/tasks', task);
      router.push(`/flights/${flight_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ width: "100%", margin: "auto"  }}>
      <PageTitle title="タスク登録" />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            required
            id="outlined-required"
            label="タスクNo."
            name="task_num"
            value={task.task_num}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="task-type-select-label">タスク種別</InputLabel>
            <Select
              labelId="task-type-select-label"
              id="task-type-select"
              name="task_type_id"
              value={task.task_type_id}
              onChange={handleSelectChange}
              label="タスク種別"
            >
              {taskTypes.map(taskType => (
                <MenuItem key={taskType.id} value={taskType.id}>{taskType.short_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            disabled
            id="outlined-required"
            label="Rule"
            name="rule"
            value={task.rule}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label="Marker Colour"
            name="marker_color"
            value={task.marker_color}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label="Marker Drop"
            name="marker_drop"
            value={task.marker_drop}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label="MMA"
            name="mma"
            value={task.mma}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label="ロガーマーカー"
            name="logger_marker"
            value={task.logger_marker}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="outlined-required"
            label="説明"
            name="description"
            value={task.description ? task.description.replace(/\\n/g, '\n') : ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            InputProps={{
              style: { whiteSpace: "pre-wrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label="スコアリングピリオド"
            name="scoring_period"
            value={task.scoring_period}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label="スコアリングエリア"
            name="scoring_area"
            value={task.scoring_area}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => router.push(`/flights/${flight_id}`)}>
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
