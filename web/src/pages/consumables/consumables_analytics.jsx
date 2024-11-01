import React from 'react';
import { Box, Card, Tab, Tabs, Typography } from '@mui/material';
import { CheckCircle, FadersHorizontal, MapPinLine, Wrench, XCircle } from '@phosphor-icons/react';
import PropTypes from 'prop-types';

import { california, kepple, namedColors, redOrange, shakespeare } from '@/styles/theme/colors';

// import CalibrationList from './calibration-list';
import Timelinebox from './timeline-box.jsx';

const StatusCard = ({ icon, title, value, iconBgColor }) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '18px',
      borderRadius: '8px',
      flexGrow: 1,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        width: '54px',
        backgroundColor: iconBgColor,
        borderRadius: '10%',
        padding: '10px',
        marginRight: '16px',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="Caption" color="textSecondary" sx={{ fontSize: '12px' }}>
        {title}
      </Typography>
      <Typography variant="body1">{value}</Typography>
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

const Analytics = ({ equipment, providerList, allEquipments }) => {
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
        return kepple[50];
      case 'Repair':
        return shakespeare[50];
      case 'Calibration':
        return california[50];
      case 'Retired':
        return redOrange[50];
      default:
        return kepple[50];
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
          icon={<MapPinLine size={32} color={namedColors['location_icon']} />}
          title="Location"
          value={'location 1'}
          iconBgColor={namedColors['location_view']}
        />
        <StatusCard
          icon={getStatusIcon('Active')}
          title="Status"
          value={'Active'}
          // iconBgColor={getStatusBgColor(equipment.status_label || "Active")}    hint
          iconBgColor={getStatusBgColor('Active')}
        />
        <StatusCard
          icon={<FadersHorizontal size={32} color={namedColors['calibration_icon']} />}
          title="Calibration due"
          value={'serial number'}
          iconBgColor={namedColors['calibration_view']}
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
                backgroundColor: 'primary', // Color for the indicator of the selected tab
              },
            }}
          >
            <Tab label="Timeline" {...a11yProps(0)} sx={{ color: value === 0 ? 'primary' : 'inherit' }} />
            <Tab label="Analytics" {...a11yProps(1)} sx={{ color: value === 1 ? 'primary' : 'inherit' }} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Timelinebox />
          <CustomTabPanel value={value} index={1}></CustomTabPanel>
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Analytics;
