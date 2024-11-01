'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { CaretRight  } from '@phosphor-icons/react';
import StepSearchConsumable from './step_search_consumable';
import StepConsumablesDetails from './step_consumables_details';
import StepUploadImage from './step_upload_image';
import PrintLabels from './print_labels';
import { Check  } from '@phosphor-icons/react';

// Define StepIcon function
function StepIcon({ active, completed, icon }) {
  const highlight = active || completed;
  return (
    <Avatar
      sx={{
        ...(highlight && {
          bgcolor: 'var(--mui-palette-primary-main)',
          color: 'var(--mui-palette-primary-contrastText)',
        }),
      }}
      variant="rounded"
    >
      {completed ? <Check /> : icon}
    </Avatar>
  );
}

// Define StepperConsumable component
export function StepperConsumable() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  const handleNext = React.useCallback(() => {
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleBack = React.useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const handleComplete = React.useCallback(() => {
    setIsComplete(true);
  }, []);

  const steps = [
    { label: 'Search Consumable', content: <StepSearchConsumable onBack={handleBack} onNext={handleNext} /> },
    { label: 'Consumables Details', content: <StepConsumablesDetails onBack={handleBack} onNext={handleNext} /> },
    { label: 'Upload image', content: <StepUploadImage onBack={handleBack} onNext={handleNext} /> },
    { label: 'Print labels', content: <PrintLabels onBack={handleBack} onNext={handleComplete} /> },
  ];

  return (
    <Box sx={{ padding: 2, width: '100%' }}>
      {/* Stepper Component */}
      <Stepper
        activeStep={activeStep}
        sx={{
          '& .MuiStepConnector-root': { display: 'none' }, // Hide default connector line
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label} sx={{ padding: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* Step label */}
              <StepLabel StepIconComponent={StepIcon}>
                <Typography variant="overline">{step.label}</Typography>
              </StepLabel>

              {/* Custom Icon between labels */}
              {index < steps.length - 1 && (
                <Box sx={{ color: 'text.secondary ' ,marginRight:'20px' }}>
                  <CaretRight  /> {/* Custom icon */}
                </Box>
              )}
            </Stack>
          </Step>
        ))}
      </Stepper>

      {/* Separate Step Content */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        {steps[activeStep] && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {steps[activeStep].label}
            </Typography>
            <Box sx={{ px: 2, py: 3 }}>{steps[activeStep].content}</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
