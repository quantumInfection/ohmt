import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Upload, X } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

import { stormGrey } from '@/styles/theme/colors';

export function ImageUploader({ selectedFiles, setSelectedFiles, selectedImageIndex, setSelectedImageIndex }) {
  const [imageUrls, setImageUrls] = useState(selectedFiles || []);

  //  images name

  useEffect(() => {
    if (selectedFiles.length === 0) {
      return; // Exit early if there are no selected files
    }

    const updatedFiles = selectedFiles.map((file) => {
      if (file.url) {
        const urlParts = file.url.split('/');
        const fileName = urlParts[urlParts.length - 1];

        return {
          ...file,
          name: fileName, // Add the extracted name to the file object
        };
      }
      // If there's no url (for example, with new uploads), return the file as is
      return file;
    });

    setSelectedFiles(updatedFiles); // Update selectedFiles with the file names
  }, [selectedFiles]);

  // Handle image drop and add to the selected files
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => {
      return {
        ...file,
        preview: URL.createObjectURL(file), // Create object URL for preview
        name: file.name, // Ensure the dropped file has its original name
      };
    });

    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      setImageUrls((prevUrls) => [
        ...prevUrls,
        ...newFiles.map((file) => file.preview), // Update imageUrls state
      ]);
      return updatedFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  // Handle image click to set it as selected
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  // Handle image deletion from the array
  const handleDeleteImage = (index) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      if (selectedImageIndex === index) {
        setSelectedImageIndex(null); // Clear selected image if it's deleted
      } else if (selectedImageIndex > index) {
        setSelectedImageIndex((prevIndex) => prevIndex - 1); // Adjust index if necessary
      }
      return updatedFiles;
    });

    // Remove the image URL from the imageUrls state
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (selectedFiles.length > 0 && selectedImageIndex === null) {
      setSelectedImageIndex(0); // Auto select the first image if none is selected
    }
  }, [selectedFiles, selectedImageIndex, setSelectedImageIndex]);

  return (
    <Box sx={{ padding: '40px 0px' }}>
      <Stack direction="column" spacing={3}>
        <Typography variant="h6">Images </Typography>
        <Box
          {...getRootProps()}
          sx={{
            backgroundColor: stormGrey[50],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            width: '100%',
            borderRadius: '8px',
            flexDirection: 'column',
            border: isDragActive ? '2px dashed blue' : '2px dashed gray',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the files here...</Typography>
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
                <input type="file" hidden onChange={(e) => onDrop([...e.target.files])} accept="image/*" />
              </Button>
              <Typography>Drag & drop some files here, or click to select files</Typography>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {imageUrls.map((url, index) => (
            <Box key={index} sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleImageClick(index)}>
              <img
                src={imageUrls[index]?.url || url}
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
