import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useMutation } from 'react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { config } from '@/config';
import { fetchCases } from '@/api/cases';
import { DataTable } from '@/pages/cases/cases-table';
import { CaseFilters } from '@/components/dashboard/cases/cases_filters'; 

const metadata = { title: `Cases | ${config.site.name}` };

export function Page() {
  const [data, setData] = useState({ cases: [], locations: [] });
  const [filteredData, setFilteredData] = useState([]); 
  const navigate = useNavigate();

  const { location , case_readable_id } = useExtractSearchParams(); 

  const { mutate, isLoading } = useMutation(fetchCases, {
    onSuccess: (data) => {
      setData(data);
      setFilteredData(data.cases); 
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);


  useEffect(() => {
    const filtered = applyFilters(data.cases, { location , case_readable_id }); // Use data.cases for filtering
    setFilteredData(applySort(filtered, 'asc'));
  }, [location, data , case_readable_id]);

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
            </Stack>
            <CaseFilters filters={{location , case_readable_id}} data={data} />
            {filteredData.length > 0 ? (
              <DataTable data={filteredData} fetchCasesMutate={mutate} />
            ) : (
              <Typography>No cases available.</Typography>
            )}
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
}

function useExtractSearchParams() {
  const [searchParams] = useSearchParams();

  return {
    location: searchParams.get('location') || undefined,
    case_readable_id : searchParams.get('case_readable_id') || undefined,
  };
}

function applyFilters(rows, { location , case_readable_id}) {
  return rows.filter((item) => {
    if (location && item.location !== location) return false; 
    if (case_readable_id && item.case_readable_id !== case_readable_id) return false; 
    return true; 
  });
}


function applySort(data, direction) {
  return data; 
}
