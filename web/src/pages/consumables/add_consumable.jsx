import React, { useState , useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { StepperConsumable } from './consumable_stepper';

const metadata = { title: `Consumables | ${config.site.name}` };

export function Page() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

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
                    <Typography variant="h4">Add Consumables</Typography>
                    <Stack direction="row" alignItems="center">
                      <Button onClick={() => navigate(-1)} sx={{ textTransform: 'none', color: 'gray' ,paddingLeft:"0px" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ArrowLeft />
                          <Typography>Consumables</Typography>
                        </Stack>
                      </Button>
                      <Typography> / Add Consumable</Typography>
                    </Stack>
                  </Box>
                </Stack>
                <StepperConsumable/>
              </Stack>
            </Box>
        </>
      )}
    </React.Fragment>
  );
}
