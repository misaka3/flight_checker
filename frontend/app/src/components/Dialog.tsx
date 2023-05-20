import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

interface SimpleDialogProps {
  open: boolean;
  data: Data;
  string: string;
  onClose: (value: string) => void;
}

interface Data {
  date: string;
  flightTime: string;
  takeofftime: string;
  landingtime: string;
  maxAltitude: string;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({ open, data, string, onClose }) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');

  const handleClose = () => {
    onClose(string);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
      <DialogTitle style={{ textAlign: "center"}}>{string}</DialogTitle>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>フライト日時： {data.date}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>離陸時間： {data.takeofftime}</TableCell>
            <TableCell>着陸時間： {data.landingtime}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>フライト時間： {data.flightTime}</TableCell>
            <TableCell>最高高度： {data.maxAltitude}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Dialog>
  );
}

export default SimpleDialog;