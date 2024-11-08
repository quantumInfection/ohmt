import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Upload, X } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

import { stormGrey } from '@/styles/theme/colors';

export function ImageUploader({ selectedFile, setSelectedFile }) {
  const [imageUrl, setImageUrl] = useState(selectedFile ? URL.createObjectURL(selectedFile) : null);

  const onDrop = (acceptedFiles) => {
    // Clear previous file and set the new one
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]; // Only accept the first file
      setSelectedFile(file); // Update the selected file in the parent component
      setImageUrl(URL.createObjectURL(file)); // Create URL for the uploaded image
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleDeleteImage = () => {
    setSelectedFile(null); // Clear the selected file
    setImageUrl(null); // Clear the image URL
  };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Free up memory
      }
    };
  }, [imageUrl]);

  return (
    <Box sx={{ padding: '40px 0px' }}>
      <Stack direction="row" spacing={3}>
        <Box
          {...getRootProps()}
          sx={{
            backgroundColor: stormGrey[50],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '155px',
            width: '100%',
            borderRadius: '8px',
            flexDirection: 'column',
            border: isDragActive ? '2px dashed blue' : '2px dashed gray',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the file here...</Typography>
          ) : (
            <>
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
              </Button>
              <Typography>Drag & drop an image here, or click to select an image</Typography>
            </>
          )}
          
        </Box>
        {imageUrl && (
          <Box sx={{ position: 'relative' }}>
            <img
              src={imageUrl}
              alt="Uploaded file"
              style={{
                width: '151px',
                height: '155px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: stormGrey[200],
                borderRadius: '50%',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              onClick={handleDeleteImage}
            >
              <X size={24} />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
