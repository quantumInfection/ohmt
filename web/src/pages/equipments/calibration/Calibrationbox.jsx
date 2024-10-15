import React from 'react';
import { Box, Button, Card, Tab, Tabs, Typography } from '@mui/material';
import { CheckCircle, FadersHorizontal, MapPin } from '@phosphor-icons/react';
import PropTypes from 'prop-types';

import { stormGrey } from '@/styles/theme/colors';

import CalibrationList from './CalibrationList';

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

const Calibrationbox = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        <StatusCard icon={<MapPin size={32} />} title="Location" value="Cromwell, NZ" iconBgColor="#FFB3B3" />
        <StatusCard icon={<CheckCircle size={32} />} title="Status" value="Active" iconBgColor="#B3FFD9" />
        <StatusCard
          icon={<FadersHorizontal size={32} />}
          title="Calibration due"
          value="40 days"
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
            }}
          >
            <Typography variant="h6">Calibrations</Typography>
            <Button style={{ backgroundColor: stormGrey[900], color: '#fff' }}>Add Calibrations</Button>
          </Box>
          <CalibrationList />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Calibrationbox;
