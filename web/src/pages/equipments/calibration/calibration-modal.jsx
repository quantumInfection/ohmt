import React, { useCallback, useEffect, useState } from 'react';
import { addCalibrations, editCalibration } from '@/api/equipments';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { CalendarBlank, X } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import { FileDropzone } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';
import { useFetchSpecificEquip } from '../MutateContext';



function EditCalibrationModal({ mode, open, onClose, providerList, calibrationData, calibrationTypes, equipmentId }) {
  const [provider, setProvider] = useState('');
  const [calibrationType, setCalibrationType] = useState('');
  const [dateCompleted, setDateCompleted] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (mode === 'edit' && calibrationData) {
      setProvider(calibrationData.provider_id || '');
      setCalibrationType(calibrationData.type || '');
      setDateCompleted(calibrationData.completion_date ? dayjs(calibrationData.completion_date) : null);
      setExpiryDate(calibrationData.expiry_date ? dayjs(calibrationData.expiry_date) : null);
      setNotes(calibrationData.notes || '');

      // Initialize files array for editing
      if (calibrationData.pdf_file_name) {
        setFiles([{ name: calibrationData.pdf_file_name, size: 0, type: 'application/pdf' }]); // or set actual size if known
      } else {
        setFiles([]); // Clear files if no PDF filename
      }
    } else {
      // Reset the form fields
      setProvider('');
      setCalibrationType('');
      setDateCompleted(null);
      setExpiryDate(null);
      setNotes('');
      setFiles([]); // Ensure files is an array
    }
  }, [mode, calibrationData]);

  useEffect(() => {
    if (open) {
      setFiles([]); // Reset files when modal opens
    }
  }, [open]);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles); // Set files to acceptedFiles array
    }
  };

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.name !== file.name));
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]); // Clear all files
  }, []);

  const fetchEquipment = useFetchSpecificEquip();

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const response = calibrationData ? await editCalibration(data) : await addCalibrations(data);
      return response;
    },
    {
      onSuccess: () => {
        fetchEquipment(equipmentId);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const onSubmit = () => {
    if (!expiryDate) {
      alert('Kindly choose Date Completed.');
      return;
    }
    if (!dateCompleted) {
      alert('Kindly choose Date Completed.');
      return;
    }
    if (!files || files.length === 0) {
      alert('Kindly choose one PDF file.');
      return;
    }

    const selectedFile = files[0];
    if (selectedFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    const formattedData = {
      provider,
      calibrationType,
      dateCompleted: dateCompleted.format('YYYY-MM-DD'),
      expiryDate: expiryDate.format('YYYY-MM-DD'),
      notes,
      equipmentId,
      calibrationId: calibrationData?.id,
      pdfFile: files[0],
    };

    mutate(formattedData);
  };

  useEffect(() => {
    if (calibrationData && calibrationData.pdf_file_name) {
      // Create a file-like object
      const file = {
        name: calibrationData.pdf_file_name,
        size: 0, // Set size to 0 or the actual size if known
        type: 'application/pdf', // Set appropriate type
      };
      setFiles([file]);
    } else {
      setFiles([]); // Reset if no filename or calibrationData is not available
    }
  }, [calibrationData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{padding:"16px"}}>
      <DialogTitle>{calibrationData ? 'Edit Calibration Details' : 'Add Calibration Details'}</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Provider</InputLabel>
                <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                  <MenuItem value="" disabled>
                    Select Provider
                  </MenuItem>
                  {providerList.map((providerItem) => (
                    <MenuItem key={providerItem.id} value={providerItem.id}>
                      {providerItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Calibration Type</InputLabel>
                <Select value={calibrationType} onChange={(e) => setCalibrationType(e.target.value)}>
                  <MenuItem value="" disabled>
                    e.g Conformance, initial...
                  </MenuItem>
                  {calibrationTypes.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required>
                <DesktopDatePicker
                  label="Date Completed"
                  inputFormat="MMMM dd, yyyy"
                  value={dateCompleted}
                  onChange={(newValue) => setDateCompleted(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required>
                <DesktopDatePicker
                  label="Expiry Date"
                  inputFormat="MMMM dd, yyyy"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarBlank onClick={() => params.inputProps.onClick()} style={{ cursor: 'pointer' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  label="Notes / Comments"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter your notes or comments here"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>

          <Stack spacing={3} mt={3}>
            <FileDropzone
              accept={{ 'application/pdf': ['.pdf'] }}
              caption="Max file size is 3 MB"
              files={files}
              onDrop={handleDrop}
              required
            />
            {files.length ? (
              <Stack spacing={2}>
                <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {files.map((file) => {
                    const extension = file.name.split('.').pop();
                    return (
                      <Stack
                        component="li"
                        direction="row"
                        key={file.name}
                        spacing={2}
                        sx={{
                          alignItems: 'center',
                          border: '1px solid var(--mui-palette-divider)',
                          borderRadius: 1,
                          flex: '1 1 auto',
                          p: 1,
                        }}
                      >
                        <FileIcon extension={extension} />
                        <Box sx={{ flex: '1 1 auto' }}>
                          <Typography variant="subtitle2">{file.name}</Typography>
                        </Box>
                        <Tooltip title="Remove" onClick={() => handleRemove(file)}>
                          <Button>
                            <X color="secondary" size={20} />
                          </Button>
                        </Tooltip>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color='secondary' >
            {isLoading ? <CircularProgress size={24} /> : (calibrationData ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditCalibrationModal;
