// Make something to add a case

import React, { useState } from 'react';
import { addCase } from '@/api/cases';
import { Breadcrumbs, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { ImageUploader } from '@/pages/equipments/image-upload-box';
import { StatusButtonGroup } from '@/pages/equipments/status-button-group';
import { RouterLink } from '@/components/core/link';

export function Page() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const metadata = { title: `Add case | ${config.site.name}` };
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);

  const location = useLocation();
  const { locations } = location.state || {};

  const { mutate, isLoading } = useMutation(addCase, {
    onSuccess: () => {
      navigate('/dashboard/cases');
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const onSubmit = (data) => {
    const onSubmit = (data) => {
      if (!selectedStatus) {
        alert('Please select a status.');
        return;
      }
      mutate({ ...data, status: selectedStatus });
    };
  };

  return (
    <React.Fragment>
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
                  <TextField label="Asset ID" {...register('assetId', { required: true })} fullWidth />
                  <TextField label="Device ID" {...register('deviceId', { required: true })} fullWidth />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <TextField label="Model" {...register('model', { required: true })} fullWidth />
                  <TextField label="Serial Number" {...register('serial', { required: true })} fullWidth />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <TextField label="Case ID" {...register('caseId', { required: true })} fullWidth />
                  <TextField label="Location" {...register('location', { required: true })} fullWidth />
                </Stack>
              </Stack>
            </Box>

            {/*status*/}
            <Box sx={{ padding: '40px 0px' }}>
              <Stack direction="column" spacing={3}>
                <Typography variant="h6">Status</Typography>
                <StatusButtonGroup onStatusChange={setSelectedStatus} />
              </Stack>
            </Box>

            {/*specs*/}
            <Box>
              <Stack direction="column" spacing={3}>
                <Typography variant="h6">Specifications</Typography>
                <Stack direction="row" spacing={3}>
                  <TextField label="Category" {...register('category', { required: true })} fullWidth />
                  <TextField
                    label="Calibration Category"
                    {...register('calibrationCategory', { required: true })}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Box>

            {/*Image uploader*/}
            <ImageUploader
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
            />
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}
