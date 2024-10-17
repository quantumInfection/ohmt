import * as React from 'react';
import { Box, Modal, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Eye, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import { california, kepple, namedColors, redOrange, stormGrey } from '@/styles/theme/colors';

import Updatecase from '../cases/update-case';

export function DataTable({ data }) {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

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

  // Function to open the modal
  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };

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
          {data.equipments.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Chip
                  icon={getStatusIcon(row.status_label)}
                  label={row.status_label}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[900] }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={<MapPin weight={'fill'} />}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[500] }}
                />
              </TableCell>
              <TableCell onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer' }}>
                {row.case_id}
              </TableCell>
              <TableCell>
                <Chip
                  label={row.calibration_due_label || 'NA'}
                  variant="filled"
                  sx={{ backgroundColor: row.calibration_bg, color: row.calibration_fg }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="gray">
                  <Eye
                    onClick={() =>
                      navigate('view', {
                        state: {
                          id: row?.id,
                          provider: data?.calibration_providers,

                        },
                      })
                    }
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for showing details */}
      <Modal open={open} onClose={handleCloseModal}>
        <Updatecase onClose={handleCloseModal} />
      </Modal>
    </Box>
  );
}
