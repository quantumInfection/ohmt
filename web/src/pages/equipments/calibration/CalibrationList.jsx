import React, { useState } from 'react';
import {
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
} from '@mui/material';
import { FilePdf, Pencil } from '@phosphor-icons/react';

import EditCalibrationModal from './EditCalibrationModal';

const data = [
  { type: 'Conformance', expiryDate: 'August 30, 2023', provider: 'Acu-Vibe (AUS)', attachment: 'View PDF' },
  { type: 'Initial', expiryDate: 'August 30, 2023', provider: 'Diatec (NZ)', attachment: 'View PDF' },
  { type: 'Re-Calibration', expiryDate: 'August 30, 2023', provider: 'Tecnosys (NZ)', attachment: 'View PDF' },
  { type: 'Repair', expiryDate: 'August 30, 2023', provider: 'LSI (ITALY)', attachment: 'View PDF' },
  { type: 'Re-Calibration', expiryDate: 'August 30, 2023', provider: 'Draeger', attachment: 'View PDF' },
  { type: 'Re-Calibration', expiryDate: 'July 30, 2023', provider: 'Wedderburn (NZ)', attachment: 'View PDF' },
];

const CalibrationList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.expiryDate}</TableCell>
                  <TableCell>{row.provider}</TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#E84924' }}>
                      <FilePdf fontSize="small" />
                    </IconButton>
                    <Link href="#" sx={{ color: '#E84924', textDecoration: 'none', ml: 1 }}>
                      {row.attachment}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={handleModalOpen}>
                      <Pencil />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Paper>

      <EditCalibrationModal open={isModalOpen} onClose={handleModalClose} />
    </>
  );
};

export default CalibrationList;
