'use client';

import * as React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

export function ConsumableFilters({ filters = {}, data, counts }) {
  const tabs = [
    { label: 'Active', value: 'Active', count: counts.Active || 0 },
    { label: 'Loaded', value: 'Loaded', count: counts.Loaded || 0 },
    { label: 'Unloaded', value: 'Unloaded', count: counts.Unloaded || 0 },
    { label: 'Used', value: 'Used', count: counts.Used || 0 },
    { label: 'Laboratory', value: 'Laboratory', count: counts.Laboratory || 0 },
    { label: 'Completed', value: 'Completed', count: counts.Completed || 0 },
  ];

  const {
    location = '',
    searchQuery = '',
    status = 'Active', // Set initial active tab to "Active"
    cassettle_id = '',
  } = filters;

  const navigate = useNavigate();

  const updateSearchParams = React.useCallback(
    (newFilters) => {
      const searchParams = new URLSearchParams();

      if (newFilters.searchQuery) {
        searchParams.set('searchQuery', newFilters.searchQuery);
      }

      if (newFilters.status) {
        searchParams.set('status', newFilters.status);
      }

      if (newFilters.location) {
        searchParams.set('location', newFilters.location);
      }

      if (newFilters.cassettle_id) {
        searchParams.set('cassettle_id', newFilters.cassettle_id);
      }

      navigate(`${paths.dashboard.consumables.list}?${searchParams.toString()}`);
    },
    [navigate]
  );
  React.useEffect(() => {
    if (status) {
      updateSearchParams({ status: 'Active' });
    }
  }, []);

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({ status: 'Active' }); // Reset to 'Active' when clearing
  }, [updateSearchParams]);

  const handleStatusChange = React.useCallback(
    (_, value) => {
      // Check if the same tab is clicked again
      if (value === status) {
        if (value === 'Active') {
          updateSearchParams({ ...filters, status: 'Active' }); // Force active status
        }
      } else {
        // Otherwise, update the filter to the new status
        updateSearchParams({ ...filters, status: value });
      }
    },
    [updateSearchParams, filters, status]
  );

  const handleLocationChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, location: value });
    },
    [updateSearchParams, filters]
  );

  const handleCassettle_idChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, cassettle_id: value });
    },
    [updateSearchParams, filters]
  );

  const handleSearchQueryChange = React.useCallback(
    (event) => {
      updateSearchParams({ ...filters, searchQuery: event.target.value });
    },
    [updateSearchParams, filters]
  );

  const hasFilters = status || location || cassettle_id || searchQuery;

  return (
    <div>
      <Tabs onChange={handleStatusChange} value={status || 'Active'} variant="scrollable">
        {tabs.map((tab) => (
          <Tab
            icon={<Chip label={tab.count} size="small" variant="soft" />}
            iconPosition="end"
            key={tab.value}
            label={tab.label}
            sx={{ minHeight: 'auto' }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider />
      <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', pt: 2, pb: 0 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={location || undefined}
            label="Location"
            onFilterApply={(value) => {
              handleLocationChange(value);
            }}
            onFilterDelete={() => {
              handleLocationChange('');
            }}
            popover={<LocationFilterPopover  />}
            value={location || undefined}
          />
          <FilterButton
            displayValue={cassettle_id || undefined}
            label="Cassette ID"
            onFilterApply={(value) => {
              handleCassettle_idChange(value);
            }}
            onFilterDelete={() => {
              handleCassettle_idChange('');
            }}
            popover={<Cassettle_idFilterPopover  />}
            value={cassettle_id || undefined}
          />
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            value={searchQuery || ''}
            onChange={handleSearchQueryChange}
            sx={{ minWidth: '200px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MagnifyingGlass size={24} /> {/* Adjust size as needed */}
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Stack>
    </div>
  );
}
function LocationFilterPopover() {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Location">
      <FormControl>
        <Select
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">Select a location</Option>
          <Option value="Location 1">Location 1</Option>
          <Option value="Location 2">Location 2</Option>
          <Option value="Location 3">Location 3</Option>
          <Option value="Location 4">Location 4</Option>
          <Option value="Location 5">Location 5</Option>
          <Option value="Location 6">Location 6</Option>
          <Option value="Location 7">Location 7</Option>
          <Option value="Location 8">Location 8</Option>
          <Option value="Location 9">Location 9</Option>
          <Option value="Location 10">Location 10</Option>
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

function Cassettle_idFilterPopover() {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Cassette ID">
      <FormControl>
        <Select
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">Select a Case ID</Option>
          <Option value="case-001">Cassette 001</Option>
          <Option value="case-002">Cassette ID 002</Option>
          <Option value="case-003">003</Option>
          <Option value="case-004">Case ID 004</Option>
          <Option value="case-005">Case ID 005</Option>
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
        disabled={value.length === 0} // Disable button if there are no case IDs
      >
        Apply
      </Button>
    </FilterPopover>
  );
}
