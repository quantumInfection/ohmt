import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ArrowRight  } from '@phosphor-icons/react';

const StepSearchConsumable = ({ onNext }) => {
  return (
    <div>
      StepSearchConsumable

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button endIcon={<ArrowRight />} onClick={onNext} variant="contained">
          Continue
        </Button>
      </Box>
    </div>
  )
}

export default StepSearchConsumable
