import React, { useState, useEffect, useCallback } from 'react';
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
import { addCalibrations, editCalibration } from '@/api/equipments'; // Import the editCalibration API function
import { useFecthSpecificEquip } from '../MutateContext';

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

function EditCalibrationModal({ open, onClose, providerList, calibrationData, calibration_categories, equipmentid }) {

  const [provider, setProvider] = useState(calibrationData?.provider || '');
  const [calibrationType, setCalibrationType] = useState(calibrationData?.calibration_type || '');
  const [dateCompleted, setDateCompleted] = useState(dayjs(calibrationData?.completion_date || '12-04-2024'));
  const [expiryDate, setExpiryDate] = useState(dayjs(calibrationData?.expiry_date || '12-05-2024'));
  const [notes, setNotes] = useState(calibrationData?.notes || '');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([]);
  }, [open]);

  const handleDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  const fecthEquip = useFecthSpecificEquip();

  const { mutate, isLoading } = useMutation((data) => {
    return calibrationData ? editCalibration(data) : addCalibrations(data); // Call editCalibration if calibrationData exists, otherwise addCalibrations
  }, {
    onSuccess: () => {
      fecthEquip(equipmentid);
    },
  });

  const onSubmit = () => {
    const formattedData = {
      provider,
      calibrationType,
      dateCompleted: dateCompleted.format('YYYY-MM-DD'),
      expiryDate: expiryDate.format('YYYY-MM-DD'),
      notes,
      callibrationid : calibrationData?.id,
      equipmentid,
    };
    mutate(formattedData);
  
  };

  // Find the provider name based on the selected provider ID
  const selectedProviderName = providerList.find((p) => p.id === provider)?.name || '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{calibrationData ? 'Edit Calibration Details' : 'Add Calibration Details'}</DialogTitle>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select a Provider
                  </MenuItem>
                  {providerList.map((providerItem) => (
                    <MenuItem key={providerItem.id} value={providerItem.id}>
                      {providerItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {selectedProviderName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Calibration type</InputLabel>
                <Select
                  value={calibrationType}
                  onChange={(e) => setCalibrationType(e.target.value)}
                >
                  {calibration_categories.map((category, index) => (
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
                        key={file.path}
                        spacing={2}
                        sx={{ alignItems: 'center', border: '1px solid var(--mui-palette-divider)', borderRadius: 1, flex: '1 1 auto', p: 1 }}
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
