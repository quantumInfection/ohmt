import * as React from 'react';
import { Alert, Stack, Button, Typography , Grid } from '@mui/material';
import { CheckCircle } from '@phosphor-icons/react';

import { kepple , stormGrey } from '@/styles/theme/colors';

const ConsumablePreview = () => {
    const details = [
        { label: 'Name', value: 'Glass Fiber - 25mm' },
        { label: 'Category Number', value: '226-01' },
        { label: 'Supplier', value: 'SKC' },
        { label: 'Serial Number', value: 'C256325' },
        { label: 'Lab Job Number', value: '5256566' },
        { label: 'Location', value: 'Cromwell' },
        { label: 'Cassette ID', value: 'NA' },
        {
          label: 'Notes / Comments',
          value:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Primis nec at semper eget interdum mauris lobortis pretium?',
          xs: 8,
        },
      ];

  return (
    <>
      <div style={{width:"65%"}}>
        <Alert 
        severity="success"
         icon={<CheckCircle size={22} color={kepple[500]} />}>
          {' '}
          <Typography variant="alerttitle">All done!</Typography>
          <Typography color="text.secondary" variant="body2">
          Consumable has successfully been added.
          </Typography>
        </Alert>
      </div>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <Button color="secondary"  variant="outlined">
        Back to List
        </Button>
        <Button variant="contained">
        View Item
        </Button>
      </Stack>

      <Stack sx={{ padding: '20px', border: `1px solid ${stormGrey[200]}`, borderRadius: 1 , marginY:"24px" , width:"65%"}}>
        <Grid container spacing={2}>
          {details.map((item, index) => (
            <Grid item xs={item.xs || 4} key={index}>
              <Typography variant="body2" color="textSecondary">
                {item.label}
              </Typography>
              <Typography variant="subtitle2">{item.value}</Typography>
            </Grid>
          ))}
          <Grid item xs={4} borderRadius={1}>
            <img src="https://picsum.photos/204/124?random=1" alt="" style={{ borderRadius: '8px' }} />
          </Grid>
        </Grid>
      </Stack>

    </>
  );
};

export default ConsumablePreview;
