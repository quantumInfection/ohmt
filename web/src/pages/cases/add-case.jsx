// Make something to add a case

import React from 'react';
import { addCase } from '@/api/cases';
import { Select, TextField } from '@mui/material';
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
import { useLocation, useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { RouterLink } from '@/components/core/link';

export function Page() {
  const metadata = { title: `Add case | ${config.site.name}` };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const { existingCases, locations } = location.state || {};

  const { mutate, isLoading } = useMutation(addCase, {
    onSuccess: () => {
      navigate('/dashboard/cases');
    },
  });

  const onSubmit = (data) => {
    if (existingCases.some((caseItem) => caseItem.case_id === data.caseId)) {
      setError('caseId', { type: 'manual', message: 'Case ID already exists' });
    } else {
      clearErrors('caseId');
      mutate(data);
    }
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
                    Add case
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowLeft />
                        <Typography>Cases</Typography>
                      </Stack>
                    </Button>
                    <Typography>/ Add case</Typography>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/dashboard/cases"
                    variant="outlined"
                    size="medium"
                    color='secondary'

                  >
                    Cancel
                  </Button>

                  <Button
                    size="medium"
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    sx={{ textTransform: 'none' }}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
          <Box sx={{ padding: '24px 8px', width: '65%' }}>
            <Stack spacing={4}>
              <Stack direction="row" spacing={3}>
                <TextField
                  label="Case ID"
                  placeholder="e.g C0125"
                  {...register('caseId', { required: 'Case ID is required' })}
                  error={!!errors.caseId}
                  helperText={errors.caseId ? errors.caseId.message : ''}
                  fullWidth
                />
                <TextField
                  label="Name"
                  placeholder="e.g Equipment Case"
                  {...register('name', { required: 'Name is required' })}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ''}
                />
              </Stack>

              <TextField
                label="Location"
                {...register('location', { required: 'Select location' })}
                select
                defaultValue=""
                fullWidth
                sx={{ color: 'gray' }}
                error={!!errors.location}
                helperText={errors.location?.message}
              >
                <MenuItem value="" disabled style={{ color: 'gray' }}>
                  Select location
                </MenuItem>

                {/* Location options */}
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}
