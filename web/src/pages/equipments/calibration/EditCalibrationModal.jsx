import React, { useState } from 'react';
import {
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
  TextField,
  Stack ,
  Box,
  Typography ,
  Tooltip
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';





import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { FileDropzone } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';

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




function EditCalibrationModal({ open, onClose }) {
  const [provider, setProvider] = useState('Tecnosys (NZ)');
  const [calibrationType, setCalibrationType] = useState('Conformance');
  const [dateCompleted, setDateCompleted] = useState(dayjs('2023-08-30'));
  const [expiryDate, setExpiryDate] = useState(dayjs('2024-08-30'));

  const handleUpdate = () => {
    // Handle the update logic here
    onClose();
  };



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



  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Calibration Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                <MenuItem value="Tecnosys (NZ)">Tecnosys (NZ)</MenuItem>
                <MenuItem value="Another Provider">Another Provider</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Calibration type</InputLabel>
              <Select value={calibrationType} onChange={(e) => setCalibrationType(e.target.value)}>
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
                placeholder="Lorem ipsum odor amet, consectetuer adipiscing elit. Primis nec at semper eget interdum mauris lobortis pretium? Dignissim odio eros habitant eu porttitor sem; mollis class. Eu vulputate ultrices tristique quis commodo libero consequat."
              />
            </FormControl>
          </Grid>
        </Grid>







        <Stack spacing={3} mt={3}>
          <FileDropzone accept={{ '*/*': [] }} caption="Max file size is 3 MB" files={files} onDrop={handleDrop} />
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
                      <Tooltip title="Remove"  onClick={() => {
                            handleRemove(file);
                          }}>
                        <Button
                         
                        >
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
        <Button onClick={handleUpdate} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCalibrationModal;
