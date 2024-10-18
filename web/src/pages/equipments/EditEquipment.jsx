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
  console.log('editdata', data);
  // const { categories, locations, cases, calibrationCategories } = location.state || {};

  const cases = [
    { id: 1, case_id: 'CASE001', location: 'Warehouse 1' },
    { id: 2, case_id: 'CASE002', location: 'Warehouse 2' },
    { id: 3, case_id: 'CASE003', location: 'Main Office' },
  ];

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLocationDisabled, setIsLocationDisabled] = useState(false);

  const metadata = { title: `Edit equipment | ${config.site.name}` };
  const navigate = useNavigate();
  const { control, register, handleSubmit, watch, resetField, setValue } = useForm();
  const [selectedStatus, setSelectedStatus] = useState(data?.status_label || '');

console.log(selectedStatus)

  const { mutate, isLoading } = useMutation(editEquipment, {
    onSuccess: () => {
      navigate('/');
    },
  });

  const onSubmit = (data) => {
    if (!selectedStatus) {
       alert('Please select a status.');
       return;
    }
    console.log('Form submitted with data:', { ...data, status: selectedStatus }); // Add this line
    mutate({
       ...data,
       status: selectedStatus,
    });
 };

  const caseId = watch('caseId');

  useEffect(() => {
    if (caseId) {
      const selectedCase = equipmentsdata?.cases.find((caseItem) => caseItem.id === caseId);
      setIsLocationDisabled(true);
      if (selectedCase) {
        resetField('location', { defaultValue: selectedCase.location });
      }
    } else {
      setIsLocationDisabled(false);
    }
  }, [caseId, resetField, equipmentsdata?.cases]);

  const handleImageUpload = (files) => {
    setSelectedFiles(files);
    setValue(
      'files',
      files.map((file) => file.url)
    );
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
                <Button
                  component={RouterLink}
                  to="/dashboard/equipments"
                  variant="outlined"
                  sx={{ textTransform: 'none', color: 'gray' }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ textTransform: 'none' }}>
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
                  label="Asset ID"
                  {...register('assetId', { required: true })}
                  fullWidth
                  value={data.asset_id}
                  disabled
                />
                <TextField
                  label="Device ID"
                  {...register('deviceId', { required: true })}
                  fullWidth
                  value={data.device_id}
                  disabled
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField
                  label="Model"
                  {...register('model', { required: true })}
                  fullWidth
                  value={data.model}
                  disabled
                />
                <TextField
                  label="Serial Number"
                  {...register('serial', { required: true })}
                  fullWidth
                  value={data.serial_number}
                  disabled
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <TextField label="Case ID" {...register('caseId', { required: true })} fullWidth select>
                  {equipmentsdata?.cases?.map((caseItem) => (
                    <MenuItem key={caseItem.id} value={caseItem.id}>
                      {caseItem.case_id + ' - ' + caseItem.location}
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
            <TextField label="Notes" {...register('notes', { required: true })} multiline rows={4} fullWidth />
          </Box>

          {/*status*/}
          <Box sx={{ padding: '20px 0px' }}>
            <Stack direction="column" spacing={3}>
              <Typography variant="h6">Status</Typography>
              <StatusButtonGroup onStatusChange={setSelectedStatus} initialstatus={data?.status_label}/>
            </Stack>
          </Box>

          {/*specs*/}
          <Box>
            <Stack direction="column" spacing={3}>
              <Typography variant="h6">Specifications</Typography>
              <Stack direction="row" spacing={3}>
                <TextField label="Category" {...register('category', { required: true })} fullWidth select>
                  {equipmentsdata?.categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Calibration Category"
                  {...register('calibrationCategory', { required: true })}
                  fullWidth
                  select
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
            selectedFiles={selectedFiles}
            setSelectedFiles={handleImageUpload}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />
        </Box>
      </Box>
    </>
  );
}
