import * as React from 'react';
import { Box, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { CheckCircle, Eye, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import { california, kepple, namedColors, redOrange, stormGrey, tomatoOrange } from '@/styles/theme/colors';

import Updatecase from '../cases/update-case';
import { useNavigate } from 'react-router-dom';

import { california, kepple, namedColors, redOrange, stormGrey, tomatoOrange } from '@/styles/theme/colors';

import Updatecase from '../cases/update-case';

export function DataTable({ data, fetchEquipments }) {
  console.log(fetchEquipments)
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  // Function to get icon for the status
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
        backgroundColor: row.calibration_bg, 
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
          backgroundColor: 'orange',
          color: 'black',
        };
  
      case dueLabel >= 14 && dueLabel < 28:
        return {
          backgroundColor: redOrange[100],
          color: redOrange[900],
        }; 
           case dueLabel >= 29 && dueLabel < 40:
        return {
          backgroundColor: 'yellow',
          color: 'black',
        };
  
      case dueLabel >= 41 && dueLabel < 60:
        return {
          backgroundColor: california[100],
          color: california[950],
        };
        
        case dueLabel >= 61 && dueLabel < 80:
        return {
          backgroundColor: kepple[50],
          color: kepple[900], 
        };
        
        case dueLabel >= 81 && dueLabel < 101:
        return {
          backgroundColor: redOrange[100],
          color: redOrange[900],
        };
  
      default:
        return {
          backgroundColor: row.calibration_bg ,
          color: row.calibration_fg,
        };
    }
  };

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
        backgroundColor: row.calibration_bg, 
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
          backgroundColor: 'orange',
          color: 'black',
        };
  
      case dueLabel >= 14 && dueLabel < 28:
        return {
          backgroundColor: redOrange[100],
          color: redOrange[900],
        }; 
           case dueLabel >= 29 && dueLabel < 40:
        return {
          backgroundColor: 'yellow',
          color: 'black',
        };
  
      case dueLabel >= 41 && dueLabel < 60:
        return {
          backgroundColor: california[100],
          color: california[950],
        };
        
        case dueLabel >= 61 && dueLabel < 80:
        return {
          backgroundColor: kepple[50],
          color: kepple[900], 
        };
        
        case dueLabel >= 81 && dueLabel < 101:
        return {
          backgroundColor: redOrange[100],
          color: redOrange[900],
        };
  
      default:
        return {
          backgroundColor: row.calibration_bg ,
          color: row.calibration_fg,
        };
    }
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
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
                      },
                    })
                  }
                >
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
                      },
                    })
                  }
                >
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  icon={getStatusIcon(row.status_label)}
                  label={row.status_label}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[900], cursor: 'pointer' }}
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
                      },
                    })
                  }
                  sx={{ backgroundColor: 'transparent', color: stormGrey[900], cursor: 'pointer' }}
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
                      },
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={<MapPin weight={'fill'} />}
                  label={row.location}
                  variant="outlined"
                  sx={{ backgroundColor: 'transparent', color: stormGrey[500], cursor: 'pointer' }}
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
                      },
                    })
                  }
                  sx={{ backgroundColor: 'transparent', color: stormGrey[500], cursor: 'pointer' }}
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
                      },
                    })
                  }
                />
              </TableCell>
              <TableCell onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer' }}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{
                    textTransform: 'uppercase',
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
                      allEquipments: data,
                    },
                  })
                }
              >
              <TableCell onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer' }}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{
                    textTransform: 'uppercase',
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
                      allEquipments: data,
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
                        allEquipments: data,
                      },
                    })
                  }
                >
                <IconButton
                  color="gray"
                  onClick={() =>
                    navigate('view', {
                      state: {
                        equipmentId: row.id,
                        allEquipments: data,
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
