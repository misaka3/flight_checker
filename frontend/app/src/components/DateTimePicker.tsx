import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface Props {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export default function DateTimePickerValue({ label, value, onChange }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label={label}
          value={value}
          onChange={onChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
