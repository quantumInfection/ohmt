import React, { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { FileDropzone } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';
import { addCalibrations } from '@/api/equipments';

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

function EditCalibrationModal({ open, onClose, providerList, calibrationData }) {

    // console.log(calibrationData.notes)
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      provider: calibrationData?.provider || '',
      calibrationType: calibrationData?.calibration_type || 'Conformance',
      dateCompleted: dayjs(calibrationData?.completion_date || '2023-08-30'),
      expiryDate: dayjs(calibrationData?.expiry_date || '2024-08-30'),
      notes: '', 
    },
  });

  const [files, setFiles] = React.useState([]);

  React.useEffect(() => {
    setFiles([]);
  }, [open]);

  const handleDrop = React.useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleRemove = React.useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleRemoveAll = React.useCallback(() => {
    setFiles([]);
  }, []);



  const { mutate, isLoading } = useMutation(addCalibrations, {
    onSuccess: () => {
      navigate('/dashboard/equipments');
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      dateCompleted: data.dateCompleted.format('YYYY-MM-DD'), // Convert date to string
      expiryDate: data.expiryDate.format('YYYY-MM-DD'), // Convert date to string
    };
    mutate(
        formattedData
      );
    console.log(formattedData); // Log formatted form data on submit
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Calibration Details</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}> {/* Wrap form elements with the onSubmit handler */}
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select
                  {...register('provider')} 
                  defaultValue={calibrationData?.provider || ''}
                  onChange={(e) => setValue('provider', e.target.value)} // Update value in form state
                >
                  {providerList.map((providerName, index) => (
                    <MenuItem key={index} value={providerName.id}>
                      {providerName.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Calibration type</InputLabel>
                <Select
                  {...register('calibrationType')} 
                  defaultValue={calibrationData?.calibration_type || 'Conformance'}
                  onChange={(e) => setValue('calibrationType', e.target.value)} // Update value in form state
                >
                  <MenuItem value="Conformance">Conformance</MenuItem>
                  <MenuItem value="Performance">Performance</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <DesktopDatePicker
                  label="Date Completed"
                  inputFormat="MMMM dd, yyyy"
                  value={dayjs(calibrationData?.completion_date || '2023-08-30')}
                  onChange={(newValue) => setValue('dateCompleted', newValue)} // Update value in form state
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <DesktopDatePicker
                  label="Expiry Date"
                  inputFormat="MMMM dd, yyyy"
                  value={dayjs(calibrationData?.expiry_date || '2024-08-30')}
                  onChange={(newValue) => setValue('expiryDate', newValue)} // Update value in form state
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
                  placeholder="Lorem ipsum odor amet, consectetuer adipiscing elit. Primis nec at semper eget interdum mauris lobortis pretium? Dignissim odio eros habitant eu porttitor sem; mollis class. Eu vulputate ultrices tristique quis commodo libero consequat."
                  {...register('notes')} // Register notes field
                />
              </FormControl>
            </Grid>
          </Grid>

          <Stack spacing={3} mt={3}>
            <FileDropzone
              accept={{
                'application/pdf': ['.pdf'],
              }}
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
                        <Tooltip
                          title="Remove"
                          onClick={() => {
                            handleRemove(file);
                          }}
                        >
                          <Button>
                            <XIcon />
                          </Button>
                        </Tooltip>
                      </Stack>
                    );
                  })}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Button color="secondary" onClick={handleRemoveAll} size="small" type="button">
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
          <Button type="submit" variant="contained"> {/* Use type="submit" */}
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditCalibrationModal;
