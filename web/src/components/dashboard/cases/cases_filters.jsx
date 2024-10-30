import * as React from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

export function CaseFilters({ filters = {}, sortDir = 'desc' ,data }) {
  const { location, case_readable_id } = filters; 
  const navigate = useNavigate();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.location) {
        searchParams.set('location', newFilters.location);
      }

      if (newFilters.case_readable_id) {
        searchParams.set('case_readable_id', newFilters.case_readable_id); 
      }

      navigate(`${paths.dashboard.cases.list}?${searchParams.toString()}`);
    },
    [navigate]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleLocationChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, location: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleCaseIdChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, case_readable_id: value }, sortDir); 
    },
    [updateSearchParams, filters, sortDir]
  );

  const hasFilters = !!location || !!case_readable_id; 

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={location || 'All Locations'} 
            label="Location"
            onFilterApply={handleLocationChange}
            onFilterDelete={() => handleLocationChange('')}
            popover={<LocationFilterPopover locations={data.locations} />}
            value={location || ''}
          />
          
          {/* Filter Button for Case ID */}
          <FilterButton
            displayValue={case_readable_id || 'Select Case ID'} 
            label="Case ID"
            onFilterApply={handleCaseIdChange}
            onFilterDelete={() => handleCaseIdChange('')}
            popover={<CaseIdFilterPopover cases={data.cases} />}
            value={case_readable_id || ''}
          />

          {hasFilters && <Button onClick={handleClearFilters}>Clear filters</Button>}
        </Stack>

        <Select
          name="sort"
          onChange={(event) => updateSearchParams(filters, event.target.value)}
          sx={{ maxWidth: '100%', width: '120px' }}
          value={sortDir}
        >
          <Option value="desc">Newest</Option>
          <Option value="asc">Oldest</Option>
        </Select>
      </Stack>
    </div>
  );
}

function CaseIdFilterPopover({ cases = [] }) {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue || ''); 
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Case ID">
      <FormControl>
        <Select
          onChange={(event) => setValue(event.target.value)}
          value={value}
        >
          <Option value="">Select a Case ID</Option>
          {cases.map((caseItem) => (
            <Option key={caseItem.id} value={caseItem.case_readable_id}>
              {caseItem.case_readable_id} 
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}

function LocationFilterPopover({ locations = [] }) {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue || ''); 
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Location">
      <FormControl>
        <Select
          onChange={(event) => setValue(event.target.value)}
          value={value}
        >
          <Option value="">Select a location</Option>
          {locations.map((location) => (
            <Option key={location.id} value={location.name}>
              {location.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}
