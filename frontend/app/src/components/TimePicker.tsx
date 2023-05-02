import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface Props {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export default function TimePickerValue({ label, value, onChange }: Props) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker']}>
        <TimePicker
          label={label}
          value={value}
          onChange={onChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
