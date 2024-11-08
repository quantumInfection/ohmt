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
import { stormGrey } from '@/styles/theme/colors';

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
  const rows = [
    { label: 'Name', value: 'data?.Name' },
    { label: 'Category Number', value: 'data?.category_number' },
    { label: 'Serial Number', value: 'data?.serial_number' },
    { label: 'Lab Job Number', value: 'data?.job_number' },
    { label: 'Location', value: 'data?.Location' },
    { label: 'Cassette ID', value: 'data?.cassette_id' },
  ];

  return (
    <>
      <Card sx={{ mb: 2 , border: `1px solid ${stormGrey[200]}`, borderRadius: 1}}>
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

      <Card sx={{border: `1px solid ${stormGrey[200]}`, borderRadius: 1}}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: '10px' , marginBottom: '20px'}}>
            <Info size={24} /> Consumable Information
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

      <Card sx={{ marginY: 2 ,  border: `1px solid ${stormGrey[200]}`, borderRadius: 1 }}>
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
