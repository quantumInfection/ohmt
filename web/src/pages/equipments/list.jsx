import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchEquipments } from '@/api/equipments';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { DataTable } from '@/pages/equipments/equiments-table';

const metadata = { title: `Equipments | ${config.site.name}` };

export function Page() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(fetchEquipments, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  console.log(data);
  useEffect(() => {
    mutate();
  }, [mutate]);

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
                <Typography variant="h4">Equipment</Typography>
              </Box>
              <div>
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={() =>
                    navigate('add', {
                      state: {
                        categories: data.categories,
                        locations: data.locations,
                        cases: data.cases,
                        calibrationCategories: data.calibration_categories,
                      },
                    })
                  }
                >
                  Add
                </Button>
              </div>
            </Stack>
            {data && Object.keys(data).length > 0 && <DataTable data={data.equipments} />}
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
}
