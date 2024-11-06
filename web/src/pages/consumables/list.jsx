import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchConsumable } from '@/api/consumables';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useMutation } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { config } from '@/config';
import { DataTable } from '@/pages/consumables/consumables_table';
import { ConsumableFilters } from '@/components/dashboard/consumable/consumable_fillters';

const metadata = { title: `Consumables | ${config.site.name}` };

export function Page() {
  const [data, setData] = useState([]);
  const [totalresult, setTotalresult] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [countNumbers, setCountNumbers] = useState({});
  const navigate = useNavigate();

  const { location, status, cassettle_id, searchQuery } = useExtractSearchParams();

  const { mutate, isLoading } = useMutation(fetchConsumable, {
    onSuccess: (data) => {
      setData(data || []); 
      setFilteredData(data || []);
      setTotalresult(data || []);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    const filtered = applyFilters(data, { location, status, cassettle_id, searchQuery });
    setFilteredData(filtered);
  }, [location, status, cassettle_id, searchQuery, data]);

  const countStatuses = (data) => {
    const statusCounts = {};
    let totalCount = 0;
    data.forEach((item) => {
      const statusLabel = item.status;
      if (!statusCounts[statusLabel]) {
        statusCounts[statusLabel] = 0;
      }
      statusCounts[statusLabel] += 1;
      totalCount += 1;
    });
    return {
      ...statusCounts,
      total: totalCount,
    };
  };

  useEffect(() => {
    const counts = countStatuses(data);
    setCountNumbers(counts);
  }, [data]);

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
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h4">Consumables</Typography>
              </Box>
              <div>
                <Button startIcon={<PlusIcon />} variant="contained" onClick={() => navigate('add')}>
                  Add
                </Button>
              </div>
            </Stack>
            <ConsumableFilters
              filters={{ location, status, cassettle_id, searchQuery }}
              data={totalresult}
              counts={countNumbers}
            />
            <Box sx={{ overflowX: 'auto' }}>
              {filteredData && Object.keys(filteredData).length > 0 && <DataTable data={filteredData} />}
            </Box>
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
    status: searchParams.get('status') || undefined,
    cassettle_id: searchParams.get('cassettle_id') || undefined,
    searchQuery: searchParams.get('searchQuery') || undefined,
  };
}

function applyFilters(rows, { location, status, cassettle_id, searchQuery }) {
  return rows.filter((item) => {
    if (location && item.location !== location) return false;
    if (status && item.status !== status) return false;
    if (cassettle_id && item.cassettle_id !== cassettle_id) return false;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = item.Name?.toLowerCase().includes(searchLower);
      const statusMatch = item.status?.toLowerCase().includes(searchLower);
      const caseIdMatch = item.cassettle_id?.toLowerCase().includes(searchLower);
      const locationMatch = item.location?.toLowerCase().includes(searchLower);

      if (!(nameMatch || statusMatch || caseIdMatch || locationMatch)) return false;
    }

    return true;
  });
}
