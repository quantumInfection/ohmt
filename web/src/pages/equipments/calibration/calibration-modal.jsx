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
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import { FileDropzone } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';
import { useFetchSpecificEquip } from '../MutateContext';

function bytesToSize(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function EditCalibrationModal({ mode, open, onClose, providerList, calibrationData, calibrationTypes, equipmentId }) {
  const [provider, setProvider] = useState('');
  const [calibrationType, setCalibrationType] = useState('');
  const [dateCompleted, setDateCompleted] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log(calibrationData)
    if (mode === 'edit' && calibrationData) {
      setProvider(calibrationData.provider_id || '');
      setCalibrationType(calibrationData.type || '');
      setDateCompleted(calibrationData.completion_date ? dayjs(calibrationData.completion_date) : null);
      setExpiryDate(calibrationData.expiry_date ? dayjs(calibrationData.expiry_date) : null);
      setNotes(calibrationData.notes || '');
      setFiles(calibrationData.pdf_file_url || '');
    } else {
      // Reset the form fields
      setProvider('');
      setCalibrationType('');
      setDateCompleted(null);
      setExpiryDate(null);
      setNotes('');
      setFiles(null)
    }
  }, [mode, calibrationData]);

  useEffect(() => {
    setFiles([]);
  }, [open]);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    }
  };

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.name !== file.name));
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]);
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

  const onSubmit =  () => {
    const formattedData = {
      provider,
      calibrationType,
      dateCompleted: dateCompleted.format('YYYY-MM-DD'),
      expiryDate: expiryDate.format('YYYY-MM-DD'),
      notes,
      equipmentId,
      callibrationId: calibrationData?.id,
      pdfFile: files[0], 
    };
    mutate(formattedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Edit Calibration Details' : 'Add Calibration Details'}</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <DesktopDatePicker
                  label="Date Completed"
                  inputFormat="MMMM dd, yyyy"
                  value={dateCompleted}
                  onChange={(newValue) => setDateCompleted(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <DesktopDatePicker
                  label="Expiry Date"
                  inputFormat="MMMM dd, yyyy"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Notes / Comments"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter your notes or comments here"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                          <Typography color="text.secondary" variant="body2">
                            {bytesToSize(file.size)}
                          </Typography>
                        </Box>
                        <Tooltip title="Remove" onClick={() => handleRemove(file)}>
                          <Button>
                            <XIcon />
                          </Button>
                        </Tooltip>
                      </Stack>
                    );
                  })}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Button color="secondary" onClick={handleRemoveAll} size="small">
                    Remove all
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {calibrationData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditCalibrationModal;
