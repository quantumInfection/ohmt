import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
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
  const [countNumbers, setCountNumbers] = useState({});
  const navigate = useNavigate();

  const { location, status_label, case_readable_id, calibration_due_label, searchQuery } = useExtractSearchParams(); 

  const { mutate, isLoading } = useMutation(fetchEquipments, {
    onSuccess: (data) => {
      setData(data.equipments || []);
      setLocations(data.locations || []);
      setTotalresult(data || []);
      setFilteredData(data.equipments || []);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    const filtered = applyFilters(data, { location, status_label, case_readable_id, calibration_due_label, searchQuery }); 
    setFilteredData(filtered);
  }, [location, status_label, case_readable_id, calibration_due_label, searchQuery, data]);

  const countStatuses = (data) => {
    const statusCounts = {}; 
    let totalCount = 0; 
    data.forEach(item => {
      const statusLabel = item.status_label; 
      if (!statusCounts[statusLabel]) {
        statusCounts[statusLabel] = 0;
      }
      statusCounts[statusLabel] += 1;
      totalCount += 1;
    });
    return {
      ...statusCounts,
      total: totalCount 
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
                <Typography variant="h4">Equipment</Typography>
              </Box>
              <div>
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={() =>
                    navigate('add', {
                      state: {
                        categories: totalresult.categories,
                        locations: totalresult.locations,
                        cases: totalresult.cases,
                        calibrationCategories: totalresult.calibration_categories,
                      },
                    })
                  }
                >
                  Add
                </Button>
              </div>
            </Stack>
            <EquipmentFilters filters={{ location, status_label, case_readable_id, calibration_due_label, searchQuery }} locations_list={locations} data={totalresult} counts={countNumbers} />
            <Box sx={{ overflowX: 'auto' }}>
              {filteredData && Object.keys(filteredData).length > 0 && <DataTable data={filteredData} totaldata={totalresult} fetchEquipments={mutate}/>}
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
    status_label: searchParams.get('status_label') || undefined,
    case_readable_id: searchParams.get('case_readable_id') || undefined,
    calibration_due_label: searchParams.get('calibration_due_label') || undefined, 
    searchQuery: searchParams.get('searchQuery') || undefined,
  };
}


function applyFilters(rows, { location, status_label, case_readable_id, calibration_due_label, searchQuery }) {
  return rows.filter((item) => {
    let calibrationDueDays = parseInt(item.calibration_due_label); 
    
    if (!isNaN(calibrationDueDays)) {
      if (calibration_due_label === '0' && (calibrationDueDays > 1)) {
        return false; 
      }
      if (calibration_due_label === '1-14' && (calibrationDueDays < 2 || calibrationDueDays > 14)) {
        return false; 
      }
      if (calibration_due_label === '15-30' && (calibrationDueDays < 15 || calibrationDueDays > 30)) {
        return false; 
      }
      if (calibration_due_label === '31-60' && (calibrationDueDays < 31 || calibrationDueDays > 60)) {
        return false;
      }
       if (calibration_due_label === '60' && (calibrationDueDays < 60 )) {
        return false;
      }
    }
    if (location && item.location !== location) return false;
    if (status_label && item.status_label !== status_label) return false;
    if (case_readable_id && item.case_readable_id !== case_readable_id) return false;

    // Filter by searchQuery
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower);
      const statusMatch = item.status_label?.toLowerCase().includes(searchLower);
      const caseIdMatch = item.case_readable_id?.toLowerCase().includes(searchLower);
      const calibrationMatch = item.calibration_due_label?.toLowerCase().includes(searchLower);
      const locationMatch = item.location?.toLowerCase().includes(searchLower);

      if (!(nameMatch || statusMatch || caseIdMatch || calibrationMatch || locationMatch)) return false;
    }

    return true; 
  });
}
