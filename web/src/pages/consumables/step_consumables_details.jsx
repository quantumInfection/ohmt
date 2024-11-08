import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import {stormGrey} from "@/styles/theme/colors"

const StepConsumablesDetails = ({ onBack, onNext, onSubmit , data }) => {
  const [formData, setFormData] = useState({
    serialNumber: data.serialNumber || '',
    labJobNumber: data.labJobNumber || '',
    dateCompleted: data.dateCompleted || null,
    cassetteID: data.cassetteID || '',
    location: data.location || '',
    notes: data.notes || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateCompleted: date }));
    setErrors((prev) => ({ ...prev, dateCompleted: '' }));
  };

  const validateFields = () => {
    const newErrors = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        !value && (key !== 'dateCompleted' || !formData.dateCompleted) ? 'This field is required' : '',
      ])
    );
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleContinue = () => {
    if (validateFields()) {
      onSubmit(formData); // Send data to the parent
      onNext();
    }
  };

  return (
    <div>
      <Typography variant="h6">Enter details</Typography>
      <Stack direction="column" spacing={4}>
        <Stack direction="row" spacing={3}>
          <TextField
            label="Serial Number"
            fullWidth
            variant="outlined"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            error={!!errors.serialNumber}
            helperText={errors.serialNumber}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color="primary">Auto Assign</Typography>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Lab Job Number"
            fullWidth
            name="labJobNumber"
            value={formData.labJobNumber}
            onChange={handleChange}
            error={!!errors.labJobNumber}
            helperText={errors.labJobNumber}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <FormControl fullWidth error={!!errors.dateCompleted}>
            <DesktopDatePicker
              label="Date Completed"
              inputFormat="MMMM dd, yyyy"
              value={formData.dateCompleted}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} helperText={errors.dateCompleted} />}
            />
          </FormControl>
          <TextField
            label="Cassette ID"
            fullWidth
            name="cassetteID"
            value={formData.cassetteID}
            onChange={handleChange}
            error={!!errors.cassetteID}
            helperText={errors.cassetteID}
          />
        </Stack>
        <FormControl fullWidth error={!!errors.location}>
          <InputLabel>Location</InputLabel>
          <Select name="location" value={formData.location} onChange={handleChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {[1, 2, 3].map((loc) => (
              <MenuItem key={loc} value={loc}>
                Location {loc}
              </MenuItem>
            ))}
          </Select>
          {errors.location && (
            <Typography variant="caption" color="error">
              {errors.location}
            </Typography>
          )}
        </FormControl>
        <TextField
          label="Notes / Comments"
          multiline
          rows={3}
          fullWidth
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          error={!!errors.notes}
          helperText={errors.notes}
        />
        <Stack direction="row" sx={{ padding: '20px', border: `1px solid ${stormGrey[200]}`, borderRadius: 1 }}>
          <Grid container spacing={2}>
            {['Name: Glass Fiber - 25mm', 'Category Number: 226-01', 'Supplier: SKC'].map((text, idx) => (
              <Grid item xs={4} key={idx}>
                <Typography variant="body2" color="textSecondary">
                  {text.split(':')[0]}
                </Typography>
                <Typography variant="subtitle2">{text.split(': ')[1]}</Typography>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button color="secondary" onClick={onBack} startIcon={<ArrowLeft />}>
          Back
        </Button>
        <Button endIcon={<ArrowRight />} onClick={handleContinue} variant="contained">
          Continue
        </Button>
      </Stack>
    </div>
  );
};

export default StepConsumablesDetails;
