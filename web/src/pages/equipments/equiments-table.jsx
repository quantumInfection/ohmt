import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Eye, FadersHorizontal, MapPin, Pencil, Wrench, XCircle } from '@phosphor-icons/react';
import { kepple } from '@/styles/theme/colors';

export function DataTable({ data }) {
  // Make a function to get icon of the status

  function getStatusIcon(status) {
    switch (status) {
      case 'Active':
        return <CheckCircle sx={{weight: 'fill'}} />;
      case 'Repair':
        return <Wrench sx={{color: '#19B7AA'}}/>;
      case 'Calibration':
        return <FadersHorizontal />;
      case 'Retired':
        return <XCircle />;
    }
  }

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Case ID</TableCell>
            <TableCell>Calibration Due</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Chip
                  icon={getStatusIcon(row.status_label)}
                  label={row.status_label}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={<MapPin />}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell>{row.case_id}</TableCell>
              <TableCell>
                <Chip
                  label={row.calibration_due_label || 'NA'}
                  variant="filled"
                  sx={{ backgroundColor: row.calibration_bg, color: row.calibration_fg }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="gray">
                  <Eye />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
