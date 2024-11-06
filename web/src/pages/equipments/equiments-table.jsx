import * as React from 'react';
import { Box, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Eye, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { california, kepple, namedColors, redOrange, stormGrey, tomatoOrange } from '@/styles/theme/colors';
import Updatecase from '../cases/update-case';

export function DataTable({ data, fetchEquipments, totaldata }) {
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
    setSelectedRow(row); // Set the selected row
    setOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRow(null); // Clear the selected row when closing
  };

  const getChipStyles = (row) => {
    if (row.calibration_due_label === 'NA') {
      return {
        backgroundColor: stormGrey[100],
        color: row.calibration_fg,
      };
    }

    const match = row.calibration_due_label.match(/(\d+)/);
    const dueLabel = match ? Number(match[0]) : NaN;

    if (row.calibration_due_label.toLowerCase() === 'overdue') {
      return {
        backgroundColor: 'red',
        color: 'white',
      };
    }

    if (isNaN(dueLabel)) {
      return {
        backgroundColor: 'gray',
        color: 'black',
      };
    }

    switch (true) {
      case dueLabel < 14:
        return {
          backgroundColor: redOrange[100],
          color: redOrange[900],
        };

      case dueLabel >= 15 && dueLabel < 30:
        return {
          backgroundColor: namedColors['info-light'],
          color: namedColors['info-dark'],
        };
      case dueLabel >= 31 && dueLabel < 60:
        return {
          backgroundColor: california[100],
          color: california[950],
        };

      case dueLabel >= 60:
        return {
          backgroundColor: kepple[50],
          color: kepple[900],
        };

      default:
        return {
          backgroundColor: stormGrey[100],
          color: stormGrey[900],
        };
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Case ID</TableCell>
            <TableCell>Calibration Due</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}    sx={{ cursor: 'pointer'}}>
              <TableCell
                onClick={() =>
                  navigate('view', {
                    state: {
                      equipmentId: row.id,
                      allEquipments: totaldata,
                    },
                  })
                }
              >
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell
                onClick={() =>
                  navigate('view', {
                    state: {
                      equipmentId: row.id,
                      allEquipments: totaldata,
                    },
                  })
                }
              >
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {row.serial_number}
                </Typography>
              </TableCell>
              <TableCell
                onClick={() =>
                  navigate('view', {
                    state: {
                      equipmentId: row.id,
                      allEquipments: totaldata,
                    },
                  })
                }
              >
                <Chip
                  icon={getStatusIcon(row.status_label)}
                  label={row.status_label}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[900], cursor: 'pointer' }}
                />
              </TableCell>
              <TableCell
                onClick={() =>
                  navigate('view', {
                    state: {
                      equipmentId: row.id,
                      allEquipments: totaldata,
                    },
                  })
                }
              >
                <Chip
                  icon={<MapPin weight={'fill'} />}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[500], cursor: 'pointer' }}
                />
              </TableCell>
              <TableCell onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer' }}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{
                    textDecoration: 'underline',
                    textDecorationColor: tomatoOrange[300],
                  }}
                >
                  {row.case_readable_id}
                </Typography>
              </TableCell>
              <TableCell
                onClick={() =>
                  navigate('view', {
                    state: {
                      equipmentId: row.id,
                      allEquipments: totaldata,
                    },
                  })
                }
              >
                <Chip
                  label={row.calibration_due_label || 'NA'}
                  variant="filled"
                  sx={{
                    ...getChipStyles(row), // Spread the styles here
                    cursor: 'pointer',
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="gray"
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: totaldata,
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

      <Modal open={open} onClose={handleCloseModal}>
        <Box>
          {selectedRow && (
            <Updatecase
              onClose={handleCloseModal}
              id={selectedRow?.case_id}
              selectedRow={selectedRow}
              fetchEquipments={fetchEquipments}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
