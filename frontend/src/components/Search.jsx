import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery, useTheme } from '@mui/material';

const SearchComponent = ({ searchTerm, onSearchChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TextField
      placeholder="Search"
      variant="outlined"
      value={searchTerm}
      onChange={onSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        mb: '0.8rem',
        
        maxWidth: isMobile ? '90%' : 'auto', // Adjust width based on screen size
        width: isMobile ? '90%' : '100%',
        height: '36px',
        '& input': {
          padding: '0.8rem',
          fontSize: '0.875rem',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '24px',
          backgroundColor:'#fff'
        },
      }}
    />
  );
};

export default SearchComponent;
