import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchCase, fetchCases, updateCase } from '@/api/cases';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircle, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import { useMutation } from 'react-query';

import { california, kepple, redOrange, stormGrey } from '@/styles/theme/colors';

const Updatecase = ({ onClose, id, fetchCasesAgain, fetchEquipments, selectedRow }) => {
  const [data, setData] = useState({});

  const { mutate, isLoading } = useMutation(fetchCase, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate(id);
  }, [mutate]);

  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(selectedRow?.location_id || '');



  const { mutate: fetchCasesMutate, isLoading: isFetching } = useMutation(fetchCases, {
    onSuccess: (data) => {
      setLocations(data.locations);
    },
    onError: (error) => {
      console.error('Failed to fetch cases:', error);
    },
  });
  // Fetch cases on component mount
  useEffect(() => {
    fetchCasesMutate();
  }, [fetchCasesMutate]);

  // Mutation for updating a case
  const { mutate: updateCaseMutate, isLoading: isUpdating } = useMutation(updateCase, {
    onSuccess: () => {
      if (typeof fetchCasesAgain === 'function') {
        fetchCasesAgain();
        onClose();
      }

      if (typeof fetchEquipments === 'function') {
        fetchEquipments();
        onClose();
      }
    },
    onError: (error) => {
      console.error('Failed to update case:', error); // Log the error message
    },
  });

  const handleUpdateCase = () => {
    if (data?.id && selectedLocationId) {
      updateCaseMutate({ caseId: data.id, selectedLocationId });
    } else {
      alert('Location ID or Case ID is not set.');
    }
  };

  const getStatusIcon = (status_label) =>
    ({
      Active: <CheckCircle weight="fill" color={kepple[500]} />,
      Repair: <Wrench weight="fill" color={stormGrey[900]} />,
      Calibration: <FadersHorizontal weight="fill" color={california[500]} />,
      Retired: <XCircle weight="fill" color={redOrange[500]} />,
    })[status_label] || <XCircle weight="fill" color={redOrange[500]} />;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6">Edit Case</Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <FormControl fullWidth disabled>
          <InputLabel>Case Id</InputLabel>
          <OutlinedInput
            name="case_id"
            type="text"
            value={data?.case_readable_id !== undefined ? data.case_readable_id : ''}
          />
        </FormControl>
        <FormControl fullWidth disabled>
          <InputLabel>Name</InputLabel>
          <OutlinedInput name="name" type="text" value={data?.name !== undefined ? data.name : ''} />
        </FormControl>
      </Stack>
      <TextField
        label="Location"
        select
        fullWidth
        sx={{ mt: 2 }}
        value={selectedLocationId}
        onChange={(e) => setSelectedLocationId(e.target.value)} // Update selected location
      >
        {locations.map((location) => (
          <MenuItem key={location.id} value={location.id}>
            {location.name}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Equipment in this case
      </Typography>
      <Box sx={{ width: '100%', overflow: 'auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Name', 'Status', 'Location', 'Case ID', 'Serial Number'].map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress /> {/* Show spinner while loading */}
                </TableCell>
              </TableRow>
            ) : data?.equipments && data.equipments.length > 0 ? (
              data.equipments.map(({ id, name, status_label, case_readable_id, serial_number, location }) => (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(status_label)}
                      label={status_label}
                      variant="outlined"
                      sx={{ backgroundColor: 'transparent', color: stormGrey[900] }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<MapPin weight="fill" />}
                      label={location}
                      variant="outlined"
                      sx={{ backgroundColor: 'transparent', color: stormGrey[500] }}
                    />
                  </TableCell>
                  <TableCell>{case_readable_id}</TableCell>
                  <TableCell>{serial_number || 'NA'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2">No equipment yet</Typography> {/* Show message when no data */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'black',
            px: 5,
            border: '1px solid black',
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleUpdateCase} // Call the update function
          sx={{ color: 'white', px: 5, backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
          disabled={isUpdating} // Disable the button while updating
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default Updatecase;
