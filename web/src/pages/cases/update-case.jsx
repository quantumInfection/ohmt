import React from 'react';
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  Modal, Typography, Button, TextField, MenuItem, Chip, FormControl, InputLabel, Stack, OutlinedInput
} from '@mui/material';
import { CheckCircle, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import { kepple, california, redOrange, stormGrey } from '@/styles/theme/colors';

const Updatecase = ({ onClose }) => {
  const getStatusIcon = (status) => ({
    Active: <CheckCircle weight="fill" color={kepple[500]} />,
    Repair: <Wrench weight="fill" color={stormGrey[900]} />,
    Calibration: <FadersHorizontal weight="fill" color={california[500]} />,
    Retired: <XCircle weight="fill" color={redOrange[500]} />
  }[status] || <XCircle weight="fill" color={redOrange[500]} />);

  const staticData = [
    { id: 1, name: "Device A", status_label: "Active", location: "New York", case_id: "12345", serialnumber: "345345345" },
    { id: 2, name: "Device B", status_label: "Repair", location: "San Francisco", case_id: "67890", serialnumber: "123456" },
    { id: 3, name: "Device C", status_label: "Retired", location: "Chicago", case_id: "54321", serialnumber: "44554" }
  ];

  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
      <Typography variant="h6">Edit Case</Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <FormControl fullWidth disabled>
          <InputLabel>Case Id</InputLabel>
          <OutlinedInput name="Caseid" type="number" value="1234" />
        </FormControl>
        <FormControl fullWidth disabled>
          <InputLabel>Name</InputLabel>
          <OutlinedInput name="name" type="text" value="name" />
        </FormControl>
      </Stack>
      <TextField label="Location" select fullWidth sx={{ mt: 2 }} defaultValue="">
        {["New York", "San Francisco", "Los Angeles", "Chicago"].map(location => (
          <MenuItem key={location} value={location}>{location}</MenuItem>
        ))}
      </TextField>
      <Typography variant="h6" sx={{ mt: 2 }}>Equipment in this case</Typography>
      <Box sx={{ width: '100%', overflow: 'auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Name", "Status", "Location", "Case ID", "Serial Number"].map(header => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {staticData.map(({ id, name, status_label, location, case_id, serialnumber }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <Chip icon={getStatusIcon(status_label)} label={status_label} variant="outlined" sx={{ backgroundColor: 'transparent', color: stormGrey[900] }} />
                </TableCell>
                <TableCell>
                  <Chip icon={<MapPin weight="fill" />} label={location} variant="outlined" sx={{ backgroundColor: 'transparent', color: stormGrey[500] }} />
                </TableCell>
                <TableCell>{case_id}</TableCell>
                <TableCell>{serialnumber || 'NA'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose} sx={{ color: 'black', px: 5, border: '1px solid black', backgroundColor: 'transparent', '&:hover': { backgroundColor: '#f0f0f0' } }}>
          Close
        </Button>
        <Button onClick={onClose} sx={{ color: 'white', px: 5, backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default Updatecase;
