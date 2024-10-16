import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '@/config';
import { ArrowLeft ,Plus } from '@phosphor-icons/react';

import Calibrationbox from './calibration/Calibrationbox';
import Deviceinformation from './calibration/Deviceinformation';

const metadata = { title: `Equipments | ${config.site.name}` };

export function Page()  {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
          }}
        >
          <Stack spacing={4}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h4">Equipment - AID12</Typography>
                <Stack direction="row" alignItems="center">
                    <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowLeft />
                        <Typography>Equipments</Typography>
                      </Stack>
                    </Button>
                    <Typography>/ Equipment - AID12</Typography>
                  </Stack>
              </Box>

              <Box >
              <Button
                  startIcon={<Plus />}
                  variant="contained"
                  onClick={() =>
                    navigate('/dashboard/equipments/edit')
                  }
                >
                  Edit
                </Button>
                
                </Box>
            </Stack>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container>
                <Grid md={8}>
                  <Calibrationbox />
                </Grid>
                <Grid md={4} padding={2} paddingTop={0}>
                  <Deviceinformation />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
};



