import React from 'react';
import { Box, Card, Tab, Tabs, Typography } from '@mui/material';
import { CheckCircle, FadersHorizontal, MapPin, Wrench, XCircle } from '@phosphor-icons/react';
import PropTypes from 'prop-types';

import { california, kepple, namedColors, redOrange } from '@/styles/theme/colors';

import CalibrationList from './calibration-list';
import { padding } from '@mui/system';


const StatusCard = ({ icon, title, value, iconBgColor }) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '30px 16px',
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      flexGrow: 1,
    }}
  >
    <Box
      sx={{
        backgroundColor: iconBgColor,
        borderRadius: '10%',
        padding: '10px',
        marginRight: '16px',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Card>
);

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const CustomTabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const Calibrationbox = ({ equipment, providerList, allEquipments }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getStatusIcon(status) {
    switch (status) {
      case 'Active':
          return <CheckCircle size={32}    weight={'regular'} color={kepple[500]} />;
      case 'Repair':
        return <Wrench size={32} weight={'regular'} color={namedColors['info-dark']} />;
      case 'Calibration':
        return <FadersHorizontal size={32} weight={'regular'} color={california[500]} />;
      default:
      case 'Retired':
        return <XCircle size={32} weight={'regular'} color={redOrange[500]} />;
    }
  }
  function getStatusBgColor(status) {
    switch (status) {
      case 'Active':
        return '#B3FFD9'; // Green background
      case 'Repair':
        return '#FFEB99'; // Yellow background
      case 'Calibration':
        return '#CCE5FF'; // Blue background
      case 'Retired':
        return '#FFCCCC'; // Red background
      default:
        return '#FFFFFF'; // Default white background
    }
  }
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
        }}
      >
        <StatusCard icon={<MapPin size={32} />} title="Location" value={equipment.location} iconBgColor="#FFB3B3"   />
        <StatusCard
          icon={getStatusIcon(equipment.status_label)}
          title="Status"
          value={equipment?.status_label}
          iconBgColor={getStatusBgColor(equipment.status_label)}
        />
        <StatusCard
          icon={<FadersHorizontal size={32} />}
          title="Calibration due"
          value={equipment.calibration_due_label}
          iconBgColor="#FFE0B3"
        />
      </Box>

      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#E84924', // Color for the indicator of the selected tab
              },
            }}
          >
            <Tab label="Calibration Details" {...a11yProps(0)} sx={{ color: value === 0 ? '#E84924' : 'inherit' }} />
            <Tab label="Timeline" {...a11yProps(1)} sx={{ color: value === 1 ? '#E84924' : 'inherit' }} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} >
          <CalibrationList
            calibrations={equipment.calibrations}
            providerList={providerList}
            equipmentId={equipment.id}
            calibrationTypes={allEquipments.calibration_types}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Calibrationbox;
