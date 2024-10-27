import React, { useEffect, useState } from 'react';
import { archiveEquipmnt } from '@/api/equipments';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { Archive, Info } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';


const Deviceinformation = ({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [equipmentId, setEquipmentId] = useState(data?.id);
  const { handleSubmit } = useForm();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(archiveEquipmnt, {
    onSuccess: () => {
      navigate(-1);
    },
  });

  const onSubmit = () => {
    if (equipmentId) {
      mutate(equipmentId);
    }
  };

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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info /> Device Information
          </Typography>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} />

          <Grid container xs={12}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Asset ID
              </Typography>
              <Typography variant="subtitle2">{data?.asset_id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Device ID
              </Typography>
              <Typography variant="subtitle2">{data?.device_id}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Model
              </Typography>
              <Typography variant="subtitle2">{data?.model}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Serial Number
              </Typography>
              <Typography variant="subtitle2">{data?.serial_number}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Case ID
              </Typography>
              <Typography variant="subtitle2">{data?.case_readable_id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Calibration Category
              </Typography>
              <Typography variant="subtitle2">{data?.calibration_category}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Category
              </Typography>
              <Typography variant="subtitle2">{data?.category}</Typography>
            </Grid>
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
            {isLoaded && data.images?.length > 0 ? (
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
                    marginBottom: index === 0 ? '1rem' : '1rem',
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
        <CardHeader avatar={<Archive size={32} />} title="Archive Equipment " />
        <CardContent>
          <Stack>
            <div>
              <Typography color="text.secondary" variant="subtitle2">
                Archived items can be found in the listing under archived tabs.
              </Typography>
              <Button onClick={handleSubmit(onSubmit)} color="error" variant="contained" style={{ marginTop: '10px' }}>
              {isLoading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default Deviceinformation;
