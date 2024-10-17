import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { Archive } from '@phosphor-icons/react';

const Deviceinformation = ({ data }) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      // Simulate a delay for data to be considered loaded
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500); // 500ms delay
  
      return () => clearTimeout(timer);
    }, []);


  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <i>Device Information</i>
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Asset ID
              </Typography>
              <Typography variant="body1">{data.asset_id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Device ID
              </Typography>
              <Typography variant="body1">{data.device_id}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Model
              </Typography>
              <Typography variant="body1">{data.model}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Serial Number
              </Typography>
              <Typography variant="body1">{data.serial_number}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Case ID
              </Typography>
              <Typography variant="body1">{data.case_id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Calibration Category
              </Typography>
              <Typography variant="body1">Conformance</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Category
              </Typography>
              <Typography variant="body1">{data.calibration_category}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Notes / Comments
              </Typography>
              <Typography variant="body1">{data.notes}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            {isLoaded && data.images && data.images.length > 0 ? (
              data.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt="Device"
                  style={{ width: '75px', height: '75px', objectFit: 'cover' }}
                />
              ))
            ) : (
              <p>No images now</p>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ marginY: 2 }}>
        <CardHeader avatar={<Archive size={32} />} title="Archive Equipment " />
        <CardContent>
          <Stack>
            <div>
              <Typography color="text.secondary" variant="body1">
                Archived items can be found in the listing under archived tabs.
              </Typography>
              <Button color="error" variant="contained" style={{ marginTop: '10px' }}>
                Archive
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default Deviceinformation;
