import React from 'react'
import {Stack , Button ,ButtonGroup , Grid , Typography} from '@mui/material';
import { ArrowRight ,ArrowLeft  ,CaretDown} from '@phosphor-icons/react';
import { stormGrey } from '@/styles/theme/colors';


const PrintLabels = ({ onBack, onNext }) => {
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
    <div>
      <ButtonGroup aria-label="split button" variant="contained" color="secondary">
            <Button color="secondary" variant="contained" type="split" size="medium">
            Print Labels
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


          <Stack sx={{ padding: '20px', border: `1px solid ${stormGrey[200]}`, borderRadius: 1 , marginY:"24px"}}>
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


      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button color="secondary" onClick={onBack} startIcon={<ArrowLeft />}>
          Back
        </Button>
        <Button endIcon={<ArrowRight />} onClick={onNext} variant="contained">
          Continue
        </Button>
      </Stack>

    </div>
  )
}

export default PrintLabels
