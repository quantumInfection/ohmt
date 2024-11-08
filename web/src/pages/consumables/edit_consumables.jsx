import React, { useEffect, useState } from 'react';
import { editEquipment } from '@/api/equipments';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { ImageUploader } from '@/pages/equipments/image-upload-box';
import { StatusButtonGroup } from '@/pages/equipments/status-button-group';
import { RouterLink } from '@/components/core/link';

export function Page() {
  const location = useLocation();
  const { data, equipmentsdata } = location.state || {};
  const [notes, setNotes] = useState(data?.notes || '');
  const [calibrationCategory, setCalibrationCategory] = useState(data?.calibration_category || '');
  const [category, setCategory] = useState(data?.catagory_id || '');

  const handleCategorychange = (event) => {
    setCategory(event.target.value); // Update state on change
  };
  const handleCalibrationCategory = (event) => {
    setCalibrationCategory(event.target.value); // Update state on change
  };
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLocationDisabled, setIsLocationDisabled] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(data?.case_id || '');

  const handleCaseIdChange = (event) => {
    setSelectedCaseId(event.target.value); // Update the state on change
  };
  const metadata = { title: `Edit equipment | ${config.site.name}` };
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      assetId: data?.asset_id || '',
      deviceId: data?.device_id || '',
      model: data?.model || '',
      serial: data?.serial_number || '',
      // Add other fields with their default values if needed
    },
  });

  const [selectedStatus, setSelectedStatus] = useState(data?.status_label || '');

  const equip_id = data?.id;

  const { mutate, isLoading } = useMutation(editEquipment, {
    onSuccess: () => {
      navigate(-1);
    },
  });

  const caseId = watch('caseId');

  useEffect(() => {
    if (caseId) {
      const selectedCase = equipmentsdata?.cases.find((caseItem) => caseItem.id === caseId);
      setIsLocationDisabled(true);
      if (selectedCase) {
        resetField('location', { defaultValue: selectedCase.location_id });
      }
    } else {
      setIsLocationDisabled(false);
    }
  }, [caseId, resetField, equipmentsdata?.cases]);

  const handleImageUpload = (files) => {
    setSelectedFiles(files);
    setValue(
      'files',
      data?.images.map((file) => file.url)
    );
  };

  const onSubmit = (data) => {
    if (!data.location) {
      alert('Please select a Case Id or Location.');
      return;
    }

    if (!selectedStatus) {
      alert('Please select a status.');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    mutate({
      ...data,
      equip_id,
      status: selectedStatus,
      files: selectedFiles,
      selectedImageIndex: {
        idx: selectedImageIndex,
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
          alignItems: '',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h3" sx={{ padding: '8px' }}>
                  Edit Consumable - C252A56
                </Typography>
                <Stack direction="row" alignItems="center">
                  <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ArrowLeft />
                      <Typography>Consumable</Typography>
                    </Stack>
                  </Button>
                  <Typography>/ Edit Consumable</Typography>
                </Stack>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button onClick={() => navigate(-1)} variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  sx={{ textTransform: 'none' }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Update'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/*Editable container*/}
        <Box sx={{ padding: '24px 8px', width: '65%' }}>
          <Box>
            <Stack direction="column" spacing={4}>
              <Typography variant="h6">Consumable Information</Typography>

              <Stack direction="row" spacing={3}>
                <TextField
                  label="Name"
                  placeholder="Glass Fiber - 25mm"
                  {...register('name', { required: 'Name is required' })}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  value={data?.name}
                  disabled
                />
                <TextField
                  label="Category Number"
                  placeholder="226-01"
                  {...register('category_number', { required: 'Category Number is required' })}
                  fullWidth
                  error={!!errors.category_number}
                  helperText={errors.category_number?.message}
                  value={data?.category_number}
                  disabled
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField
                  label="Serial Number"
                  placeholder="C256325"
                  {...register('serial_number', { required: 'Serial Number is required' })}
                  fullWidth
                  error={!!errors.serial_number}
                  helperText={errors.serial_number?.message}
                  value={data?.serial_number}
                  disabled
                />
                <TextField
                  label="Lab Job Number"
                  placeholder="25626953656"
                  {...register('lab_job_number', { required: 'Lab Job Number is required' })}
                  fullWidth
                  error={!!errors.lab_job_number}
                  helperText={errors.lab_job_number?.message}
                  value={data?.lab_job_number}
                  disabled
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField
                  label="Cassette ID"
                  placeholder="e.g LM0253"
                  {...register('cassette_iD', { required: 'Cassette ID is required' })}
                  fullWidth
                  error={!!errors.cassette_iD}
                  helperText={errors.cassette_iD?.message}
                  value={data?.cassette_iD}
                  disabled
                />
                <Controller
                  name="location"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      select
                      fullWidth
                      error={!!errors.location} // Add error handling if needed
                      helperText={errors.location?.message} // Add helper text for error
                    >
                      <MenuItem value="" disabled>
                        e.g Cromwell
                      </MenuItem>
                      {equipmentsdata?.locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                          {location.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField
                  placeholder="Please write comments or notes"
                  label="Notes / Comments"
                  {...register('notes', { required: 'Notes or comments are required' })}
                  fullWidth
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  value={notes} // Bind the value of the TextField to the notes state
                  onChange={handleNotesChange} // Update the state on change
                />
              </Stack>
            </Stack>
          </Box>

          {/*Image uploader*/}

          <ImageUploader
            selectedFiles={data?.images || selectedFiles}
            setSelectedFiles={handleImageUpload}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />
        </Box>
      </Box>
    </>
  );
}
