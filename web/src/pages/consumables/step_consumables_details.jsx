import React from 'react'
import {Stack , Button} from '@mui/material';
import { ArrowRight ,ArrowLeft  } from '@phosphor-icons/react';

const StepConsumablesDetails = ({ onBack, onNext }) => {
  return (
    <div>
      StepConsumablesDetails


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

export default StepConsumablesDetails
