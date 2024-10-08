// Make something to add a case

import React from 'react';
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
import { RouterLink } from '@/components/core/link';

export function Page() {
  const metadata = { title: `Add case | ${config.site.name}` };
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const location = useLocation();
  const { locations } = location.state || {};

  const { mutate, isLoading } = useMutation(addCase, {
    onSuccess: () => {
      navigate('/dashboard/cases');
    },
  });

  const onSubmit = (data) => {
    mutate(data);
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
          <Box>
          {/* TODO  */}
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}
