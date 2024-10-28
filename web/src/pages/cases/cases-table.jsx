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
import { MapPin, NotePencil  } from '@phosphor-icons/react';
import {  stormGrey } from '@/styles/theme/colors';

import Updatecase from './update-case';

export function DataTable({ data ,fetchCasesMutate }) {

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
              <TableCell>{row.case_readable_id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Chip
                  icon={<MapPin weight={'fill'}/>}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent' ,color: stormGrey[500] }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="gray" onClick={() => handleOpen(row)}>
                  <NotePencil size={40} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose} size="medium">
        <Updatecase onClose={handleClose} id={selectedRow?.id} selectedRow={selectedRow} fetchCasesAgain={fetchCasesMutate}/>
      </Modal>
    </Box>
  );
}
