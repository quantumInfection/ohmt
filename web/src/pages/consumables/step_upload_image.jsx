import React from 'react';
import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { stormGrey } from '@/styles/theme/colors';
import { ImageUploader } from './image_upload_box';

const StepUploadImage = ({ onBack, onNext, onSubmit }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);

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

  const handleImageUpload = (file) => {
    setSelectedFile(file);
  };

  const handleContinue = () => {
    if (!selectedFile) {
      alert('Please upload a image.');
      return;
    }
    onSubmit(selectedFile); // Send data to the parent
    onNext();
  };

  return (
    <div>
      <Typography variant="h6">Image</Typography>

      <ImageUploader selectedFile={selectedFile} setSelectedFile={handleImageUpload} />

      <Stack sx={{ padding: '20px', border: `1px solid ${stormGrey[200]}`, borderRadius: 1 }}>
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

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end', marginTop: '24px' }}>
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

export default StepUploadImage;
