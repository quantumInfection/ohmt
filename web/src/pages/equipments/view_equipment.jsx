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
import { config } from '@/config';
import CalibrationBox from './calibration/calibration-box';
import DeviceInformation from './calibration/device_information';
import { MutateProvider } from './MutateContext';

const metadata = { title: `Equipments | ${config.site.name}` };

export function Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipment, setEquipment] = useState({});
  const { equipmentId, allEquipments } = location.state || {}; // Retrieve the 'id' from the state
  if (!equipmentId) {
    return <div>Error: No row ID provided.</div>;
  }

  const { mutate, isLoading } = useMutation(fetchEquipment, {
    onSuccess: (equipment) => {
      setEquipment(equipment);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (equipmentId) {
      mutate(equipmentId);
    }
  }, [mutate, equipmentId]);

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
          <MutateProvider mutate={mutate}>
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
                    <Typography variant="h4">Equipment - {equipment.name}</Typography>
                    <Stack direction="row" alignItems="center">
                      <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ArrowLeft />
                          <Typography>Equipments</Typography>
                        </Stack>
                      </Button>
                      <Typography>/ Equipment - {equipment.name}</Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate('/dashboard/equipments/edit', {
                          state: {
                            data: equipment,
                            equipmentsdata: allEquipments,
                          },
                        })
                      }
                    >
                      Edit
                    </Button>
                  </Box>
                </Stack>

                <Box sx={{ flexGrow: 1 }}>
                  <Grid container>
                    <Grid md={8}>
                      <CalibrationBox
                        equipment={equipment}
                        providerList={allEquipments?.calibration_providers}
                        allEquipments={allEquipments}
                      />
                    </Grid>
                    <Grid md={4} padding={2} paddingTop={0}>
                      <DeviceInformation data={equipment} />
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>
          </MutateProvider>
        </>
      )}
    </React.Fragment>
  );
}
