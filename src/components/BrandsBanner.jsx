import { Box, Chip } from '@mui/material';

const BrandsBanner = ({ filters, removeBrand }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', mb: 2 }}>
      {filters && <Chip label={filters.name} onDelete={removeBrand} />}
    </Box>
  );
};

export default BrandsBanner;
