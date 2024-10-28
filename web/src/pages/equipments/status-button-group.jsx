import React, { useState } from 'react';
import { Button } from '@mui/material';
import { CheckCircle, FadersHorizontal, Wrench, XCircle } from '@phosphor-icons/react';

import { kepple, stormGrey, redOrange, california, namedColors } from '@/styles/theme/colors';

const activeBgColors = {
  Active: '#f0fdfa',
  Repair: '#ecfdff',
  Calibration: '#fffaea',
  Retired: '#fef3f2',
};

const borderColors = {
  Active: kepple[600],
  Repair: namedColors['info-dark'],
  Calibration: california[600],
  Retired: redOrange[600],
};

const StatusButton = ({ icon, status, selectedStatus, onClick }) => (
  <Button
    startIcon={React.cloneElement(icon, {
      color: selectedStatus === status ? icon.props.activeColor : icon.props.inactiveColor,
    })}
    onClick={onClick}
    variant="outlined"
    disableElevation
    sx={{
      margin: '0 8px 8px 0',
      opacity: selectedStatus === status ? 1 : 0.5,
      backgroundColor: selectedStatus === status ? activeBgColors[status] : stormGrey[100],
      color: selectedStatus === status ? stormGrey[900] : stormGrey[400],
      borderColor: selectedStatus === status ? borderColors[status] : stormGrey[400],
      pointerEvents: 'auto',
    }}
  >
    {status}
  </Button>
);

export function StatusButtonGroup({ onStatusChange, initialstatus }) {
  const [selectedStatus, setSelectedStatus] = useState(initialstatus || null);

  const handleButtonClick = (status) => {
    setSelectedStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <div>
      <StatusButton
        icon={<CheckCircle weight="fill" activeColor={kepple[500]} inactiveColor={stormGrey[400]} />}
        status="Active"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Active')}
      />
      <StatusButton
        icon={<Wrench weight="fill" activeColor={namedColors['info-dark']} inactiveColor={stormGrey[400]} />}
        status="Repair"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Repair')}
      />
      <StatusButton
        icon={<FadersHorizontal weight="fill" activeColor={california[500]} inactiveColor={stormGrey[400]} />}
        status="Calibration"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Calibration')}
      />
      <StatusButton
        icon={<XCircle weight="fill" activeColor={redOrange[500]} inactiveColor={stormGrey[400]} />}
        status="Retired"
        selectedStatus={selectedStatus}
        onClick={() => handleButtonClick('Retired')}
      />
    </div>
  );
}
