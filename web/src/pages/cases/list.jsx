import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchCases } from '@/api/cases';
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
import { DataTable } from '@/pages/cases/cases-table';

const metadata = { title: `Cases | ${config.site.name}` };

export function Page() {
  const [data, setData] = useState({});
  console.log(data)
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(fetchCases, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

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
                <Typography variant="h4">Cases</Typography>
              </Box>
              <div>
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={() =>
                    navigate('add', {
                      state: { locations: data.locations, existingCases: data.cases },
                    })
                  }
                >
                  Add
                </Button>
              </div>
            </Stack>
            {data && Object.keys(data).length > 0 && <DataTable data={data.cases} />}
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
}
