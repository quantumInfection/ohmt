import * as React from 'react';
import { Box, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Eye, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import { california, kepple, namedColors, redOrange, stormGrey, tomatoOrange } from '@/styles/theme/colors';

export function DataTable({ data }) {
  const navigate = useNavigate();

  // Function to get icon for the status
  function getStatusIcon(status) {
    switch (status) {
      case 'Active':
        return <CheckCircle weight={'fill'} color={kepple[500]} />;
      case 'Repair':
        return <Wrench weight={'fill'} color={namedColors['info-dark']} />;
      case 'Calibration':
        return <FadersHorizontal weight={'fill'} color={california[500]} />;
      default:
      case 'Retired':
        return <XCircle weight={'fill'} color={redOrange[500]} />;
    }
  }

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serial Number</TableCell>
            <TableCell>Cassette ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Laboratory</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              onClick={() =>
                navigate('view', {
                  state: {
                    data: row.id,
                  },
                })
              }
            >
              <TableCell>
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {row.serial_number}
                </Typography>
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }}>
                <Typography variant="body2">{row.cassettle_id}</Typography>
              </TableCell>

              <TableCell>
                <Chip
                  icon={getStatusIcon(row.status)}
                  label={row.status}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[900], cursor: 'pointer' }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={<MapPin weight={'fill'} />}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[500], cursor: 'pointer' }}
                />
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }}>
                <Typography variant="body2">{row.laboratory}</Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="gray"
                  onClick={() =>
                    navigate('view', {
                      state: {
                        // equipmentId: row.id,
                        // allEquipments: totaldata,
                      },
                    })
                  }
                >
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
