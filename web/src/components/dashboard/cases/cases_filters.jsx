import * as React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

export function CaseFilters({ filters = {}, data }) {
  const { location, case_readable_id, searchQuery } = filters;
  const navigate = useNavigate();

  const updateSearchParams = React.useCallback(
    (newFilters) => {
      const searchParams = new URLSearchParams();

      if (newFilters.location) {
        searchParams.set('location', newFilters.location);
      }

      if (newFilters.case_readable_id) {
        searchParams.set('case_readable_id', newFilters.case_readable_id);
      }

      if (newFilters.searchQuery) {
        searchParams.set('searchQuery', newFilters.searchQuery);
      }

      navigate(`${paths.dashboard.cases.list}?${searchParams.toString()}`);
    },
    [navigate]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({});
  }, [updateSearchParams]);

  const handleLocationChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, location: value });
    },
    [updateSearchParams, filters]
  );

  const handleCaseIdChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, case_readable_id: value });
    },
    [updateSearchParams, filters]
  );

  const handleSearchQueryChange = React.useCallback(
    (event) => {
      updateSearchParams({ ...filters, searchQuery: event.target.value });
    },
    [updateSearchParams, filters]
  );

  const hasFilters = !!location || !!case_readable_id || !!searchQuery;

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={location || undefined}
            label="Location"
            onFilterApply={handleLocationChange}
            onFilterDelete={() => handleLocationChange('')}
            popover={<LocationFilterPopover locations={data.locations} />}
            value={location || undefined}
          />

          <FilterButton
            displayValue={case_readable_id || undefined}
            label="Case ID"
            onFilterApply={handleCaseIdChange}
            onFilterDelete={() => handleCaseIdChange('')}
            popover={<CaseIdFilterPopover cases={data.cases} />}
            value={case_readable_id || undefined}
          />
          {hasFilters && <Button onClick={handleClearFilters}>Clear filters</Button>}
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search"
            value={searchQuery || ''}
            onChange={handleSearchQueryChange}
            sx={{ minWidth: '200px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MagnifyingGlass size={24} />
                </InputAdornment>
              ),
            }}
          />
        </div>
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
        <Select onChange={(event) => setValue(event.target.value)} value={value}>
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
        <Select onChange={(event) => setValue(event.target.value)} value={value}>
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
