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
  TextField,
  Typography,
} from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Archive, CaretDown, Info, WarningCircle } from '@phosphor-icons/react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

const DeviceInformation = () => {
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

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader avatar={<WarningCircle size={26} />} title="Add Cassette Number" />
        <CardContent sx={{ paddingTop: '0' }}>
          <Stack>
            <Typography color="text.secondary" variant="body1">
              Cassette number has not been assigned to this item.
            </Typography>
            <TextField sx={{my:1}} placeholder="e.g LM0253" label="Cassette ID" fullWidth />

            <div>
              <Button color="secondary" variant="contained" size="medium" style={{ marginTop: '10px' }}>
                {isLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info /> Consumable Information
          </Typography>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} />

          <Grid container spacing={2}>
            {renderInfoRow('Name', 'data?.Name')}
            {renderInfoRow('Category Number', 'data?.category_number')}
            {renderInfoRow('Serial Number', 'data?.serial_number')}
            {renderInfoRow('Lab Job Number', 'data?.job_number')}
            {renderInfoRow('Location', 'data?.Location')}
            {renderInfoRow('Cassette ID', 'data?.cassette_id')}
          </Grid>

          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Notes / Comments
              </Typography>
              <Typography variant="subtitle2">"data?.notes"</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />

          <ButtonGroup aria-label="split button" variant="contained" color="secondary">
            <Button color="secondary" variant="contained" type="split" size="medium">
              Archive
            </Button>
            <Button
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              color="secondary"
              variant="contained"
            >
              <CaretDown size={16} />
            </Button>
          </ButtonGroup>

          <Divider sx={{ marginY: 2 }} />
          <Box display="flex" flexWrap="wrap" gap={2}>
            {!isLoaded ? (
              <CircularProgress sx={{ width: '100%', height: '157px', margin: 'auto' }} />
            ) : (
              <img
                key="0"
                src="https://picsum.photos/600/600"
                alt="Device"
                style={{
                  width: '100%',
                  height: '157px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ marginY: 2 }}>
        <CardHeader avatar={<Archive size={32} />} title="Archive Consumable" />
        <CardContent>
          <Stack>
            <Typography color="text.secondary" variant="subtitle2">
              Archived items can be found in the listing under archived tabs.
            </Typography>
            <div>
              <Button color="error" variant="contained" size="medium" style={{ marginTop: '10px' }}>
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
