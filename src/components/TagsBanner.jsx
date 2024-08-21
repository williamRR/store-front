import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const TagsBanner = ({ filters, removeTag, clearAllTags }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        marginBottom: 2,
        marginTop: '125px',
      }}
    >
      {filters.map((tag) => (
        <Chip
          key={tag._id}
          label={tag.name}
          onDelete={() => removeTag(tag._id)}
        />
      ))}
      {filters.length > 0 && (
        <Typography
          variant='body2'
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={clearAllTags}
        >
          Clear All
        </Typography>
      )}
    </Box>
  );
};

export default TagsBanner;
