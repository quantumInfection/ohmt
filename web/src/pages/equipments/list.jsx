

import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { fetchEquipments } from '@/api/equipments';
import { DataTable } from '@/pages/equipments/equiments-table';
import { EquipmentFilters } from '@/components/dashboard/equipment/equipment_filters';

const metadata = { title: `Equipments | ${config.site.name}` };

export function Page() {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [totalresult, setTotalresult] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const { location, status_label, case_readable_id } = useExtractSearchParams(); 

  const fetchEquipmentData = async () => {
    try {
      const result = await fetchEquipments();
      setData(result.equipments || []);
      setLocations(result.locations || []);
      setTotalresult(result || []);
      setFilteredData(result.equipments || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  useEffect(() => {
    const filtered = applyFilters(data, { location, status_label, case_readable_id }); 
    setFilteredData(applySort(filtered, 'asc'));
  }, [location, status_label, case_readable_id, data]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
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
          <Card>
            <EquipmentFilters filters={{ location, status_label, case_readable_id }} locations_list={locations}  data={totalresult} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              {filteredData && Object.keys(filteredData).length > 0 && <DataTable data={filteredData} />}
            </Box>
          </Card>
        </Stack>
      </Box>
    </React.Fragment>
  );
}

function useExtractSearchParams() {
  const [searchParams] = useSearchParams();

  return {
    location: searchParams.get('location') || undefined,
    status_label: searchParams.get('status_label') || undefined,
    case_readable_id: searchParams.get('case_readable_id') || undefined, 
  };
}

function applySort(rows, sortDir) {
  return rows.sort((a, b) => {
    if (sortDir === 'asc') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function applyFilters(rows, { location, status_label, case_readable_id }) {
  return rows.filter((item) => {
    if (location && item.location !== location) return false;
    if (status_label && item.status_label !== status_label) return false;
    if (case_readable_id && item.case_readable_id !== case_readable_id) return false; 
    return true;
  });
}
