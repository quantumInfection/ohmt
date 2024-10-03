import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';

import { config } from '@/config';
import { DataTable } from '@/pages/equipments/equiments-table';

const metadata = { title: `Equipments | ${config.site.name}` };

export function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://clownfish-app-vi4my.ondigitalocean.app/v1/mock/equipments');
        const result = await response.json();
        setData(result);
      } catch (error) {
        // TODO: Do proper error handling line in the project
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      {loading ? (
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
                <Typography variant="h4">Cases</Typography>
              </Box>
              <div>
                <Button startIcon={<PlusIcon />} variant="contained">
                  Add
                </Button>
              </div>
            </Stack>
            <DataTable data={data} />
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
}
