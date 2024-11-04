import React, { useEffect, useState } from 'react';
import { archiveEquipment } from '@/api/equipments';
import { Box, Card, CardContent, Divider, Grid, Typography, Button, CardHeader, CircularProgress, Stack } from '@mui/material';
import { Archive, Info } from '@phosphor-icons/react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

const DeviceInformation = ({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  const { mutate, isLoading } = useMutation(archiveEquipment, {
    onSuccess: () => navigate(-1),
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  const renderInfoRow = (label, value) => (
    <Grid item xs={6}>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Grid>
  );

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info /> Device Information
          </Typography>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} />

          <Grid container spacing={2}>
            {renderInfoRow('Asset ID', data?.asset_id)}
            {renderInfoRow('Device ID', data?.device_id)}
            {renderInfoRow('Model', data?.model)}
            {renderInfoRow('Serial Number', data?.serial_number)}
            {renderInfoRow('Case ID', data?.case_readable_id)}
            {renderInfoRow('Calibration Category', data?.calibration_category)}
            {renderInfoRow('Category', data?.category)}
          </Grid>

          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Notes / Comments</Typography>
              <Typography variant="subtitle2">{data?.notes}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />
          <Box display="flex" flexWrap="wrap" gap={2}>
            {!isLoaded ? (
              <CircularProgress sx={{ width: '100%', height: '157px', margin: 'auto' }} />
            ) : data.images?.length > 0 ? (
              data.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt="Device"
                  style={{
                    width: index === 0 ? '100%' : '95px',
                    height: index === 0 ? '157px' : '95px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                  }}
                />
              ))
            ) : (
              <Typography>No images now</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ marginY: 2 }}>
        <CardHeader avatar={<Archive size={32} />} title="Archive Equipment" />
        <CardContent>
          <Stack>
            <Typography color="text.secondary" variant="subtitle2">
              Archived items can be found in the listing under archived tabs.
            </Typography>
            <div>
            <Button onClick={() => mutate(data?.id)} color="error" variant="contained" size='medium' style={{ marginTop: '10px' }}>
              {isLoading ? <CircularProgress size={24} /> : 'Archive'}
            </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default DeviceInformation;
