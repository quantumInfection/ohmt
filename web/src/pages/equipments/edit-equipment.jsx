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

  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

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
                  Edit equipment
                </Typography>
                <Stack direction="row" alignItems="center">
                  <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ArrowLeft />
                      <Typography>Equipments</Typography>
                    </Stack>
                  </Button>
                  <Typography>/ Edit Equipment</Typography>
                </Stack>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button onClick={() => navigate(-1)} variant="outlined" sx={{ textTransform: 'none', color: 'gray' }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  sx={{ textTransform: 'none' }}
                  disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Submit'}
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
                <TextField label="Asset ID" {...register('assetId' )} fullWidth value={data?.asset_id} disabled />
                <TextField label="Device ID" {...register('deviceId')} fullWidth value={data?.device_id} disabled />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField label="Model" {...register('model')} fullWidth value={data?.model} disabled />
                <TextField
                  label="Serial Number"
                  {...register('serial')}
                  fullWidth
                  value={data?.serial_number}
                  disabled
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField
                  label="Case ID"
                  fullWidth
                  select
                  {...register('caseId', { required: true })} // React Hook Form registration
                  value={selectedCaseId} // Controlled input value
                  onChange={handleCaseIdChange} // Update state on change
                >
                  {equipmentsdata?.cases?.map((caseItem) => (
                    <MenuItem key={caseItem.id} value={caseItem.id}>
                      {`${caseItem.case_readable_id} - ${caseItem.location}`}
                    </MenuItem>
                  ))}
                </TextField>
                <Controller
                  name="location"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} label="Location" select fullWidth disabled={isLocationDisabled}>
                      {equipmentsdata?.locations.map((location) => (
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
              label="Notes"
              {...register('notes', { required: true })}
              multiline
              rows={4}
              fullWidth
              value={notes} // Bind the value of the TextField to the notes state
              onChange={handleNotesChange} // Update the state on change
            />
          </Box>

          {/*status*/}
          <Box sx={{ padding: '20px 0px' }}>
            <Stack direction="column" spacing={3}>
              <Typography variant="h6">Status</Typography>
              <StatusButtonGroup onStatusChange={setSelectedStatus} initialstatus={data?.status_label} />
            </Stack>
          </Box>

          {/*specs*/}
          <Box>
            <Stack direction="column" spacing={3}>
              <Typography variant="h6">Specifications</Typography>
              <Stack direction="row" spacing={3}>
                <TextField
                  label="Category"
                  {...register('category')}
                  fullWidth
                  select
                  value={category} // Bind the value to state
                  onChange={handleCategorychange}
                  disabled
                >
                  {equipmentsdata?.categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Calibration Category"
                  {...register('calibrationCategory')}
                  fullWidth
                  select
                  disabled
                  value={calibrationCategory} // Bind the value to state
                  onChange={handleCalibrationCategory} // Update state on change
                >
                  {equipmentsdata?.calibration_categories.map((category) => (
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
