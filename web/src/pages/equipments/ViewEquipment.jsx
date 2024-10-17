import React, { useState ,useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Plus } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchSepecificEquipments } from '@/api/equipments';
import { useMutation } from 'react-query';

import { config } from '@/config';

import Calibrationbox from './calibration/Calibrationbox';
import Deviceinformation from './calibration/Deviceinformation';

const metadata = { title: `Equipments | ${config.site.name}` };

export function Page() {

  const navigate = useNavigate();

  const location = useLocation();
  const { id ,provider } = location.state || {}; // Retrieve the 'id' from the state

  if (!id) {
    return <div>Error: No row ID provided.</div>;
  }


  const [data, setData] = useState({});
  

  const { mutate, isLoading } = useMutation(fetchSepecificEquipments, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  console.log(data);


  useEffect(() => {
    if (id) {
      mutate(id); 
    }
  }, [mutate, id]);
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
                <Typography variant="h4">Equipment - {data.name}</Typography>
                <Stack direction="row" alignItems="center">
                  <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ArrowLeft />
                      <Typography>Equipments</Typography>
                    </Stack>
                  </Button>
                  <Typography>/ Equipment - {data.name}</Typography>
                </Stack>
              </Box>

              <Box>
                <Button startIcon={<Plus />} variant="contained" onClick={() => navigate('/dashboard/equipments/edit')}>
                  Edit
                </Button>
              </Box>
            </Stack>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container>
                <Grid md={8}>
                  <Calibrationbox data={data} providerList={provider}/>
                </Grid>
                <Grid md={4} padding={2} paddingTop={0}>
                  <Deviceinformation data={data}/>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
}
