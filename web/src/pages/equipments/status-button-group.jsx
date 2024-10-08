import React, { useState } from 'react';
import { Button } from '@mui/material';
import { CheckCircle, FadersHorizontal, Wrench, XCircle } from '@phosphor-icons/react';
import { kepple, stormGrey } from '@/styles/theme/colors';

const StatusButton = ({ icon, status, selectedStatus, onClick }) => (
  <Button
    startIcon={icon}
    onClick={onClick}
    variant='outlined'
    disableElevation
    sx={{
      margin: '0 8px 8px 0',
      opacity: selectedStatus === status ? 1 : 0.5,
      backgroundColor: selectedStatus === status ? kepple[50] : `${stormGrey[100]} !important`,
      color: selectedStatus === status ? stormGrey[900] : stormGrey[400],
      borderColor: selectedStatus === status ? kepple[600] : stormGrey[400],
      pointerEvents: 'auto'
    }}
  >
    {status}
  </Button>
);

export function StatusButtonGroup({ onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleButtonClick = (status) => {
    setSelectedStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <div>
      <StatusButton
        icon={<CheckCircle />}
        status="Active"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Active')}
      />
      <StatusButton
        icon={<Wrench />}
        status="Repair"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Repair')}
      />
      <StatusButton
        icon={<FadersHorizontal />}
        status="Calibration"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Calibration')}
      />
      <StatusButton
        icon={<XCircle />}
        status="Retired"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Retired')}
      />
    </div>
  );
}
