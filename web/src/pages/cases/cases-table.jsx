import * as React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { MapPin, Pencil } from '@phosphor-icons/react';

import Updatecase from './update-case';

export function DataTable({ data }) {
  console.log(data);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.case_id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Chip
                  icon={<MapPin />}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="gray" onClick={() => handleOpen(row)}>
                  <Pencil />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Updatecase onClose={handleClose} selectedRow={selectedRow}/>
      </Modal>
    </Box>
  );
}
