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

export function EquipmentFilters({ filters = {}, data, counts }) {
  const tabs = [
    { label: 'Active', value: 'Active', count: counts.Active || 0 },
    { label: 'Repair', value: 'Repair', count: counts.Repair || 0 },
    { label: 'Calibration', value: 'Calibration', count: counts.Calibration || 0 },
    { label: 'Retired', value: 'Retired', count: counts.Retired || 0 },
    { label: 'Archived', value: 'Archived', count: counts.Archived || 0 },
  ];

  const {
    location = '',
    searchQuery = '',
    status_label = 'Active', // Set initial active tab to "Active"
    case_readable_id = '',
    calibration_due_label = '',
  } = filters;

  const navigate = useNavigate();

  const updateSearchParams = React.useCallback(
    (newFilters) => {
      const searchParams = new URLSearchParams();

      if (newFilters.searchQuery) {
        searchParams.set('searchQuery', newFilters.searchQuery);
      }

      if (newFilters.status_label) {
        searchParams.set('status_label', newFilters.status_label);
      }

      if (newFilters.location) {
        searchParams.set('location', newFilters.location);
      }
      if (newFilters.calibration_due_label) {
        searchParams.set('calibration_due_label', newFilters.calibration_due_label);
      }

      if (newFilters.case_readable_id) {
        searchParams.set('case_readable_id', newFilters.case_readable_id);
      }

      navigate(`${paths.dashboard.equipments.list}?${searchParams.toString()}`);
    },
    [navigate]
  );
  React.useEffect(() => {
    if (status_label) {
      updateSearchParams({ status_label: 'Active' });
    }
  }, []);

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({ status_label: 'Active' }); // Reset to 'Active' when clearing
  }, [updateSearchParams]);

  const handleStatusChange = React.useCallback(
    (_, value) => {
      // Check if the same tab is clicked again
      if (value === status_label) {
        // If 'Active' tab is clicked again, force the filter to show only active equipment
        if (value === 'Active') {
          updateSearchParams({ ...filters, status_label: 'Active' }); // Force active status
        }
      } else {
        // Otherwise, update the filter to the new status
        updateSearchParams({ ...filters, status_label: value });
      }
    },
    [updateSearchParams, filters, status_label]
  );

  const handleLocationChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, location: value });
    },
    [updateSearchParams, filters]
  );

  const handleCalibrationChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, calibration_due_label: value });
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

  const hasFilters = status_label || location || case_readable_id || searchQuery || calibration_due_label;

  return (
    <div>
      <Tabs onChange={handleStatusChange} value={status_label || 'Active'} variant="scrollable">
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
          <FilterButton
            displayValue={calibration_due_label || undefined}
            label="Calibration Due"
            onFilterApply={(value) => {
              handleCalibrationChange(value);
            }}
            onFilterDelete={() => {
              handleCalibrationChange('');
            }}
            popover={<CalibrationFilterPopover />}
            value={calibration_due_label || undefined}
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

function CaseIdFilterPopover({ caseIds = [] }) {
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

function CalibrationFilterPopover({}) {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Calibration due">
      <FormControl>
        <Select
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">Select a Calibration</Option>
          <Option value="0">0</Option>
          <Option value="1-14"> >1 to ≤14 days</Option>
          <Option value="15-30">>15 to ≤30 days</Option>
          <Option value="31-60"> >31 to ≤60 days</Option>
          <Option value="60"> ≤60 days</Option>
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
