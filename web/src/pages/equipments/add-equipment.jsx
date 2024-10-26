import React, { useEffect, useState } from 'react';
import { addEquipment } from '@/api/equipments';
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
  const { categories, locations, cases, calibrationCategories } = location.state || {};

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLocationDisabled, setIsLocationDisabled] = useState(false);

  const metadata = { title: `Add equipment | ${config.site.name}` };
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { mutate, isLoading } = useMutation(addEquipment, {
    onSuccess: () => {
      navigate('/dashboard/equipments');
    },
  });

  const onSubmit = (data) => {
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
      status: selectedStatus,
      files: selectedFiles,
      selectedImageIndex: {
        idx: selectedImageIndex,
      },
    });
  };

  const caseId = watch('caseId');

  useEffect(() => {
    if (caseId) {
      const selectedCase = cases.find((caseItem) => caseItem.id === caseId);
      setIsLocationDisabled(true);
      if (selectedCase) {
        resetField('location', { defaultValue: selectedCase.location });
      }
    } else {
      setIsLocationDisabled(false);
    }
  }, [caseId, resetField, cases]);

  const handleImageUpload = (files) => {
    setSelectedFiles(files);
    setValue(
      'files',
      selectedFiles.map((file) => file.url)
    );
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
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
                    Add equipment
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowLeft />
                        <Typography>Equipments</Typography>
                      </Stack>
                    </Button>
                    <Typography>/ Add Equipment</Typography>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/dashboard/equipments"
                    variant="outlined"
                    size="medium"
                    color="secondary"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    sx={{ textTransform: 'none' }}
                    size="medium"
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/*Editable container*/}
          <Box sx={{ padding: '24px 8px', width: '65%' }}>
            <Box>
              <Stack direction="column" spacing={4}>
                <Typography variant="h6">Device Information</Typography>
                <Stack direction="row" spacing={3}>
                  <TextField
                    placeholder="e.g AD125205"
                    label="Asset ID"
                    {...register('assetId', { required: 'Asset ID is required' })}
                    fullWidth
                    error={!!errors.assetId}
                    helperText={errors.assetId?.message}
                  />
                  <TextField
                    placeholder="e.g 01"
                    label="Device ID"
                    {...register('deviceId', { required: 'Device ID is required' })}
                    fullWidth
                    error={!!errors.deviceId}
                    helperText={errors.deviceId?.message}
                  />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <TextField
                    placeholder="e.g SV 104IS"
                    label="Model"
                    {...register('model', { required: 'Model is required' })}
                    fullWidth
                    error={!!errors.model}
                    helperText={errors.model?.message}
                  />
                  <TextField
                    placeholder="e.g 23123123213"
                    label="Serial Number"
                    {...register('serial', { required: 'Serial Number is required' })}
                    fullWidth
                    error={!!errors.serial}
                    helperText={errors.serial?.message}
                  />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <TextField
                    label="Case ID"
                    {...register('caseId', { required: 'Case ID is required' })}
                    fullWidth
                    select
                    defaultValue=""
                    error={!!errors.caseId}
                    helperText={errors.caseId?.message}
                  >
                    <MenuItem value="" disabled>
                      e.g 01
                    </MenuItem>
                    {cases.map((caseItem) => (
                      <MenuItem key={caseItem.id} value={caseItem.id}>
                        {caseItem.case_readable_id + ' - ' + caseItem.location}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Controller
                    name="location"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Location" select fullWidth disabled={isLocationDisabled}>
                        <MenuItem value="" disabled>
                          e.g Cromwell
                        </MenuItem>
                        {locations.map((location) => (
                          <MenuItem key={location.id} value={location.id}>
                            {location.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Stack>
              </Stack>
            </Box>

            {/*Notes*/}

            <Box sx={{ padding: '40px 0px' }}>
              <TextField
                placeholder="Please write comments or notes"
                label="Notes / Comments"
                {...register('notes', { required: 'Notes or comments are required' })}
                multiline
                rows={4}
                fullWidth
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            </Box>

            {/*status*/}
            <Box sx={{ padding: '20px 0px' }}>
              <Stack direction="column" spacing={3}>
                <Typography variant="h6">Status</Typography>
                <StatusButtonGroup onStatusChange={setSelectedStatus} initialstatus="Active" />
              </Stack>
            </Box>

            {/*specs*/}
            <Box>
              <Stack direction="column" spacing={3}>
                <Typography variant="h6">Specifications</Typography>
                <Stack direction="row" spacing={3}>
                  <TextField
                    label="Category"
                    {...register('category', { required: 'Category is required' })}
                    fullWidth
                    select
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Calibration Category"
                    {...register('calibrationCategory', { required: 'Calibration Category is required' })}
                    fullWidth
                    select
                    error={!!errors.calibrationCategory}
                    helperText={errors.calibrationCategory?.message}
                  >
                    {calibrationCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Stack>
            </Box>

            {/*Image uploader*/}
            <ImageUploader
              selectedFiles={selectedFiles}
              setSelectedFiles={handleImageUpload}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
