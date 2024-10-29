import React from 'react';
import { Box, Card, Tab, Tabs, Typography } from '@mui/material';
import { padding } from '@mui/system';
import { CheckCircle, FadersHorizontal, MapPinLine, Wrench, XCircle } from '@phosphor-icons/react';
import PropTypes from 'prop-types';

import { california, kepple, namedColors, redOrange } from '@/styles/theme/colors';

import CalibrationList from './calibration-list';
// import Timelinebox from './timeline-box';


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
        display:"flex",
        backgroundColor: iconBgColor,
        borderRadius: '10%',
        padding: '10px',
        marginRight: '16px',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="Caption" color="textSecondary" sx={{fontSize:"12px"}}>
        {title}
      </Typography>
      <Typography variant="body1" >
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
        return <CheckCircle size={32} weight={'regular'} color={kepple[500]} />;
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
        return '#f0fdfa'; 
      case 'Repair':
        return '#ecfdff'; 
      case 'Calibration':
        return '#fffaea'; 
      case 'Retired':
        return '#fef3f2'; 
      default:
        return '#fef3f2'; 
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
        <StatusCard
          icon={<MapPinLine size={32} color="#FF552D" />}
          title="Location"
          value={equipment.location}
          iconBgColor="#FFCCBE;
"
        />
        <StatusCard
          icon={getStatusIcon(equipment.status_label)}
          title="Status"
          value={equipment?.status_label}
          iconBgColor={getStatusBgColor(equipment.status_label)}
        />
        <StatusCard
          icon={<FadersHorizontal size={32} color="#471701" />}
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
        <CustomTabPanel value={value} index={0}>
          <CalibrationList
            calibrations={equipment.calibrations}
            providerList={providerList}
            equipmentId={equipment.id}
            calibrationTypes={allEquipments.calibration_types}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
        {/* <Timelinebox/> */}
        sss
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Calibrationbox;
