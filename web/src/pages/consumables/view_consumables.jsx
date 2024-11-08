import React, { useEffect, useState } from 'react';
import { fetchEquipment } from '@/api/equipments';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft, Plus } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Analytics from "@/pages/consumables/consumables_analytics"
import { config } from '@/config';


// import CalibrationBox from './calibration/calibration-box';
import DeviceInformation from './consumable_device';
// import { MutateProvider } from './MutateContext';

const metadata = { title: `Consumables | ${config.site.name}` };

export function Page() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate an async action
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const { data } = location.state || {}; // Retrieve the 'id' from the state
  console.log(data);

  //   const { mutate, isLoading } = useMutation(fetchEquipment, {
  //     onSuccess: (equipment) => {
  //       setEquipment(equipment);
  //     },
  //     onError: (error) => {
  //       console.error(error);
  //     },
  //   });

  //   useEffect(() => {
  //     if (equipmentId) {
  //       mutate(equipmentId);
  //     }
  //   }, [mutate, equipmentId]);

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
        <>
          {/* <MutateProvider mutate={mutate}> */}
          <Box
            sx={{
              maxWidth: 'var(--Content-maxWidth)',
              m: 'var(--Content-margin)',
              p: 'var(--Content-padding)',
              width: 'var(--Content-width)',
            }}
          >
            <Stack gap={4}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ flex: '1 1 auto' }}>
                  <Typography variant="h4">Consumable - {data.cassettle_id}</Typography>
                  <Stack direction="row" alignItems="center">
                    <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowLeft />
                        <Typography>Consumables</Typography>
                      </Stack>
                    </Button>
                    <Typography>/ Consumable - {data.cassettle_id}</Typography>
                  </Stack>
                </Box>

                <Box>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate('/dashboard/consumables/edit',
                    //      {
                    //     state: {
                    //       data: equipment,
                    //       equipmentsdata: allEquipments,
                    //     },
                    //   }
                    )
                    }
                  >
                    Edit
                  </Button>
                </Box>
              </Stack>

              <Box sx={{ flexGrow: 1 }}>
                <Grid container>
                  <Grid md={8}>
                      <Analytics/>
                  </Grid>
                  <Grid md={4} padding={2} paddingTop={0}>
                    <DeviceInformation  /> 
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Box>
          {/* </MutateProvider> */}
        </>
      )}
    </React.Fragment>
  );
}
