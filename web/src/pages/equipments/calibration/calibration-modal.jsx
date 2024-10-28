import React, { useCallback, useEffect, useState } from 'react';
import { addCalibrations, editCalibration } from '@/api/equipments';
import {
  Box,
  Button,
  CircularProgress,
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
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { FileDropzone } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';

import { useFetchSpecificEquip } from '../MutateContext';

function EditCalibrationModal({ mode, open, onClose, providerList, calibrationData, calibrationTypes, equipmentId }) {
  const [files, setFiles] = useState([]);
  const fetchEquipment = useFetchSpecificEquip();

  const { mutate, isLoading } = useMutation(
    async (data) => (calibrationData ? await editCalibration(data) : await addCalibrations(data)),
    { onSuccess: () => fetchEquipment(equipmentId), onError: console.error }
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      provider: '',
      calibrationType: '',
      dateCompleted: null,
      expiryDate: null,
      notes: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && calibrationData) {
      reset({
        provider: calibrationData.provider_id || '',
        calibrationType: calibrationData.type || '',
        dateCompleted: calibrationData.completion_date ? dayjs(calibrationData.completion_date) : null,
        expiryDate: calibrationData.expiry_date ? dayjs(calibrationData.expiry_date) : null,
        notes: calibrationData.notes || '',
      });
      setFiles(
        calibrationData.pdf_file_name ? [{ name: calibrationData.pdf_file_name, size: 0, type: 'application/pdf' }] : []
      );
    } else {
      reset();
      setFiles([]);
    }
  }, [mode, calibrationData, reset]);

  const handleDrop = (acceptedFiles) => setFiles(acceptedFiles.length ? acceptedFiles : files);
  const handleRemove = useCallback((file) => setFiles((prev) => prev.filter((f) => f.name !== file.name)), []);

  const onSubmit = (data) => {
    if (!files.length || files[0].type !== 'application/pdf') {
      alert('Please add PDF file.');
      return;
    }
    mutate({
      ...data,
      dateCompleted: data.dateCompleted.format('YYYY-MM-DD'),
      expiryDate: data.expiryDate.format('YYYY-MM-DD'),
      equipmentId,
      calibrationId: calibrationData?.id,
      pdfFile: files[0],
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        padding: '16px',
        overflowY: 'auto',
        '& ::-webkit-scrollbar': {
          width: '8px',
        },
        '& ::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
        },
        '& ::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#a0a0a0',
        },
        '& ::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
      }}
    >
      <DialogTitle>{calibrationData ? 'Edit Calibration Details' : 'Add Calibration Details'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.provider}>
                <InputLabel>Provider</InputLabel>
                <Controller
                  name="provider"
                  control={control}
                  rules={{ required: 'Provider is required' }}
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="" disabled>
                        Select Provider
                      </MenuItem>
                      {providerList.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.provider && <Typography color="error">{errors.provider.message}</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.calibrationType}>
                <InputLabel>Calibration Type</InputLabel>
                <Controller
                  name="calibrationType"
                  control={control}
                  rules={{ required: 'Calibration Type is required' }}
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="" disabled>
                        e.g Conformance, initial...
                      </MenuItem>
                      {calibrationTypes.map((type, i) => (
                        <MenuItem key={i} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.calibrationType && <Typography color="error">{errors.calibrationType.message}</Typography>}
              </FormControl>
            </Grid>
              
            {['dateCompleted', 'expiryDate'].map((name, i) => (
              <Grid item xs={6} key={name}>
            <FormControl fullWidth error={!!errors[name]}>

                <Controller
                  name={name}
                  control={control}
                  rules={{ required: `${i === 0 ? 'Date Completed' : 'Expiry Date'} is required` }}
                  render={({ field }) => (
                    <DesktopDatePicker
                      label={i === 0 ? 'Date Completed' : 'Expiry Date'}
                      inputFormat="MMMM dd, yyyy"
                      value={field.value}
                      onChange={field.onChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth 
                          error={!!errors[name]} // Show error if it exists
                          helperText={errors[name]?.message} // Display error message
                        />
                      )}
                    />
                  )}
                />
                {/* Display error message directly below the DatePicker */}
                {errors[name] && (
                  <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                    {errors[name].message}
                  </Typography>
                )}
            </FormControl>

              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.notes}>
                <Controller
                  name="notes"
                  control={control}
                  rules={{ required: 'Notes are required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes / Comments"
                      multiline
                      rows={4}
                      error={!!errors.notes}
                      helperText={errors.notes ? errors.notes.message : ''}
                    />
                  )}
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
            {files.length > 0 && (
              <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {files.map((file) => (
                  <Stack
                    component="li"
                    direction="row"
                    key={file.name}
                    spacing={2}
                    sx={{ alignItems: 'center', p: 1, border: '1px solid #ddd', borderRadius: 1 }}
                  >
                    <FileIcon extension={file.name.split('.').pop()} />
                    <Box sx={{ flex: '1 1 auto' }}>
                      <Typography variant="subtitle2">{file.name}</Typography>
                    </Box>
                    <Tooltip title="Remove" onClick={() => handleRemove(file)}>
                      <Button>
                        <X color="secondary" size={24} />
                      </Button>
                    </Tooltip>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary">
            {isLoading ? <CircularProgress size={24} /> : calibrationData ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditCalibrationModal;
