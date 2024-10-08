import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Upload, X } from '@phosphor-icons/react';
import { stormGrey } from '@/styles/theme/colors';

export function ImageUploader({ selectedFiles, setSelectedFiles, selectedImageIndex, setSelectedImageIndex }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleDeleteImage = (index) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      if (selectedImageIndex === index) {
        setSelectedImageIndex(null);
      } else if (selectedImageIndex > index) {
        setSelectedImageIndex((prevIndex) => prevIndex - 1);
      }
      return updatedFiles;
    });
  };

  return (
    <Box sx={{ padding: '40px 0px' }}>
      <Stack direction="column" spacing={3}>
        <Typography variant="h6">Images</Typography>
        <Box
          sx={{
            backgroundColor: stormGrey[50],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            width: '100%',
            borderRadius: '8px',
            flexDirection: 'column',
          }}
        >
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              minWidth: '0',
              padding: '0',
              backgroundColor: 'white',
              color: 'black',
              borderColor: 'white',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'white',
                borderColor: 'white',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Upload size={24} />
            <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected file ${index + 1}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: selectedImageIndex === index ? '2px solid blue' : 'none',
                }}
              />
              {selectedImageIndex === index && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="body2">Primary Image</Typography>
                </Box>
              )}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: stormGrey[200],
                  borderRadius: '50%',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(index);
                }}
              >
                <X size={24} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
