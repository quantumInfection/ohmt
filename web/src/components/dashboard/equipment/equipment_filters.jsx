

'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';


const tabs = [
  { label: 'All', value: '', count: 5 },
  { label: 'Active', value: 'Active', count: 3 },
  { label: 'Repair', value: 'Repair', count: 2 },
  { label: 'Calibration', value: 'Calibration', count: 2 },
  { label: 'Retired', value: 'Retired', count: 2 },
  { label: 'Archived', value: 'Archived', count: 2 },
];

export function EquipmentFilters({ filters = {}, sortDir = 'desc' , data }) {
  const { location, sku, status_label, case_readable_id } = filters;
  const navigate = useNavigate();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.status_label) {
        searchParams.set('status_label', newFilters.status_label);
      }

      if (newFilters.location) {
        searchParams.set('location', newFilters.location);
      }

      if (newFilters.case_readable_id) {
        searchParams.set('case_readable_id', newFilters.case_readable_id);
      }

      navigate(`${paths.dashboard.equipments.list}?${searchParams.toString()}`);
    },
    [navigate]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (_, value) => {
      updateSearchParams({ ...filters, status_label: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

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

  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(filters, event.target.value);
    },
    [updateSearchParams, filters]
  );

  const hasFilters = status_label || location || case_readable_id;

  return (
    <div>
      <Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status_label ?? ''} variant="scrollable">
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
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
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
            popover={<LocationFilterPopover locations_list={data.locations} />}
            value={location || undefined}
          />
          <FilterButton
            displayValue={case_readable_id || undefined}
            label="Case ID"
            onFilterApply={(value) => {
              handleCaseIdChange(value);
            }}
            onFilterDelete={() => {
              handleCaseIdChange('');
            }}
            popover={<CaseIdFilterPopover caseIds={data.cases} />}
            value={case_readable_id || undefined}
          />
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>

        <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: '100%', width: '120px' }} value={sortDir}>
          <Option value="desc">Newest</Option>
          <Option value="asc">Oldest</Option>
        </Select>
      </Stack>
    </div>
  );
}

function LocationFilterPopover({ locations_list = [] }) {
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
          {locations_list.map((location) => (
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

function CaseIdFilterPopover({ caseIds = []}) {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Case ID">
    <FormControl>
      <Select
        onChange={(event) => {
          setValue(event.target.value);
        }}
        value={value}
      >
        <Option value="">Select a Case ID</Option>
        {caseIds.length > 0 ? (
          caseIds.map((caseId) => (
            <Option key={caseId.id} value={caseId.case_readable_id}>
              {caseId.case_readable_id}
            </Option>
          ))
        ) : (
          <Option value="" disabled>
            No Case IDs available
          </Option>
        )}
      </Select>
    </FormControl>
    <Button
      onClick={() => {
        onApply(value);
      }}
      variant="contained"
      disabled={caseIds.length === 0} // Disable button if there are no case IDs
    >
      Apply
    </Button>
  </FilterPopover>
  );
}