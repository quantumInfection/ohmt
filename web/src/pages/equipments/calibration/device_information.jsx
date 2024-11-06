import React, { useEffect, useState } from 'react';
import { archiveEquipment } from '@/api/equipments';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Archive, Info } from '@phosphor-icons/react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { stormGrey } from '@/styles/theme/colors';

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
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Grid>
  );

  const rows = [
    { label: 'Asset ID', value: data?.asset_id },
    { label: 'Device ID', value: data?.device_id },
    { label: 'Model', value: data?.model },
    { label: 'Serial Number', value: data?.serial_number },
    { label: 'Case ID', value: data?.case_readable_id },
    { label: 'Calibration Category', value: data?.calibration_category },
    { label: 'Category', value: data?.category },
  ];

  return (
    <>
      <Card sx={{ border: `1px solid ${stormGrey[200]}`, borderRadius: 1 }}>
        <CardContent sx={{ padding: ' 20px 24px' }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
          >
            <Info size={24} /> Device Information
          </Typography>

          <Grid container spacing={2}>
            {rows.map((row, index) => (
              <React.Fragment key={row.label}>
                {renderInfoRow(row.label, row.value)}
                {(index + 1) % 2 === 0 && index !== rows.length - 1 && (
                  <Grid item xs={12} style={{ paddingTop: '10px' }}>
                    <Divider />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>

          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Notes / Comments
              </Typography>
              <Typography variant="subtitle2">{data?.notes}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />
          <Box display="flex" flexWrap="wrap" gap={2}>
            {!isLoaded ? (
              <CircularProgress sx={{ width: '100%', height: '157px', margin: 'auto' }} />
            ) : data.images?.length > 0 ? (
              // Rearrange images to move the primary image to index 0
              data.images
                .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)) // Sort primary image to the start
                .map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt="Device"
                    style={{
                      width: index === 0 ? '100%' : '95px',
                      height: index === 0 ? '157px' : '95px',
                      objectFit: 'contain',
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

      <Box sx={{ marginY: 2, border: `1px solid ${stormGrey[200]}`, borderRadius: 1, padding: '24px' }}>
        <Box display="flex" alignItems="center">
          <Archive size={24} style={{ marginRight: "16px" }} />
          <Typography variant="h6">Archive Equipment</Typography>
        </Box>
        <Stack sx={{marginTop:2}}>
          <Typography color="text.secondary" variant="subtitle2">
            Archived items can be found in the listing under archived tabs.
          </Typography>
          <div>
            <Button
              onClick={() => mutate(data?.id)}
              color="error"
              variant="contained"
              size="medium"
              style={{ marginTop: '10px' }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Archive'}
            </Button>
          </div>
        </Stack>
      </Box>
    </>
  );
};

export default DeviceInformation;
