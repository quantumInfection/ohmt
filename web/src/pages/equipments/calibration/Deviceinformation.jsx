import React from 'react';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { Archive } from '@phosphor-icons/react';

const Deviceinformation = () => {
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
              <Typography variant="body1">LMS001</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Device ID
              </Typography>
              <Typography variant="body1">05</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Model
              </Typography>
              <Typography variant="body1">SPARK 703+ Noise Dosimeter</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Serial Number
              </Typography>
              <Typography variant="body1">2525645165</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Case ID
              </Typography>
              <Typography variant="body1">10</Typography>
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
              <Typography variant="body1">Noise</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Notes / Comments
              </Typography>
              <Typography variant="body1">Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <img src="path_to_image1" alt="Device" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
            <img src="path_to_image2" alt="Device" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
            <img src="path_to_image3" alt="Device" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
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
