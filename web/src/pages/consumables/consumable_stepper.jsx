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
import  ConsumablePreview  from './consumable_preview.jsx';
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

 const [formData, setFormData] = React.useState({
    consumableSearch: '', // Example for search consumable
    uploadedImage: null, // Store uploaded image
  });

  const handleNext = React.useCallback(() => {
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleBack = React.useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const handleConsumableSearch = (searchData) => {
    setFormData((prevState) => ({
      ...prevState,
      consumableSearch: searchData, // Update consumableSearch with the data from child
    }));
    console.log('Consumable Search Data:', searchData);
  };

  const handleComplete = React.useCallback(() => {
    console.log('Final Form Data:', formData); 
    setIsComplete(true);
    console.log('isComplete set to true');
  }, [formData]);

  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const handleUploadImageSubmit = (file) => {
    updateFormData({ uploadedImage: file }); // Update the formData state with the selected image
    console.log('Image uploaded:', formData); 
  };

  const steps = React.useMemo(() => {
    return[
    { label: 'Search Consumable', content: <StepSearchConsumable onBack={handleBack} onNext={handleNext} onSearch={handleConsumableSearch} /> },
    { label: 'Consumables Details', content: <StepConsumablesDetails onBack={handleBack} onNext={handleNext} onSubmit={updateFormData} data={formData}/> },
    { label: 'Upload image', content: <StepUploadImage onBack={handleBack} onNext={handleNext} onSubmit={handleUploadImageSubmit} data={formData}/> },
    { label: 'Print labels', content: <PrintLabels onBack={handleBack} onNext={handleComplete} data={formData}/> },
  ];
}, [handleBack, handleNext, handleComplete]);

  if (isComplete) {
    return <ConsumablePreview />;
  }
  return (
    <Box sx={{ padding: 2, width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        sx={{
          '& .MuiStepConnector-root': { display: 'none' },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label} sx={{ padding: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <StepLabel StepIconComponent={StepIcon}>
                <Typography variant="overline">{step.label}</Typography>
              </StepLabel>
              {index < steps.length - 1 && (
                <Box sx={{ color: 'text.secondary ' ,marginRight:'20px' }}>
                  <CaretRight  /> 
                </Box>
              )}
            </Stack>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          mt: 4,
          py: 3,
        }}
      >
        {steps[activeStep] && (
          <Box >
            <Typography variant="h6" gutterBottom>
              {steps[activeStep].label}
            </Typography>
            <Box sx={{ py: 3, width: '65%' }} >{steps[activeStep].content}</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
