import React, { useState } from 'react';
import { InputAdornment, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';

const StepSearchConsumable = ({ onNext, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery); 
    onNext();
  };

  return (
    <>
      <Typography variant="h6">Find the required consumable</Typography>
      <TextField
        label="Search"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="e.g Glass Fibre - 25mm"
        variant="outlined"
        sx={{ marginY: '24px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <MagnifyingGlass size={24} />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button endIcon={<ArrowRight />} onClick={handleSearchSubmit} variant="contained">
          Continue
        </Button>
      </Box>
    </>
  );
};

export default StepSearchConsumable;
