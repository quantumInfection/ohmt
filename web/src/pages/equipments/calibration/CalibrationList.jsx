import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { FilePdf, Pencil } from '@phosphor-icons/react';

import { stormGrey } from '@/styles/theme/colors';

import EditCalibrationModal from './EditCalibrationModal';

const CalibrationList = (calibrations) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentCalibration, setCurrentCalibration] = useState(null);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = (calibration = null) => {
    setCurrentCalibration(calibration); // Set calibration data (null for add)
    setIsModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCalibration(null); // Clear data when modal closes
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        <Typography variant="h6">Calibrations</Typography>
        <Button style={{ backgroundColor: stormGrey[900], color: '#fff' }} onClick={() => handleModalOpen()}>
          Add Calibrations
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>PDF Attachment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calibrations.calibrations.calibrations && calibrations.calibrations.calibrations.length > 0 ? (
                calibrations.calibrations.calibrations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.expiry_date}</TableCell>
                      <TableCell>{row.provider}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: '#E84924' }}>
                          <FilePdf fontSize="large" />
                        </IconButton>
                        <Link href={row.pdf_file_url} sx={{ color: '#E84924', textDecoration: 'none', ml: 1 }}>
                          View PDF
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleModalOpen(row)}>
                          <Pencil />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    There is no calibration now
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={calibrations?.calibrations?.calibrations?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Paper>

      <EditCalibrationModal
        open={isModalOpen}
        equipmentid={calibrations.equipmentid}
        onClose={handleModalClose}
        providerList={calibrations.providerList}
        calibrationData={currentCalibration}
        calibration_categories={calibrations.calibrationcategories}
      />
    </>
  );
};

export default CalibrationList;
