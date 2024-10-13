import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { MapPin, Pencil } from '@phosphor-icons/react';

export function DataTable({ data }) {
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
                <IconButton color="gray">
                  <Pencil />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
