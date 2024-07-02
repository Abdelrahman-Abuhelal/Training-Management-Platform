import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent = ({ searchTerm, onSearchChange }) => {
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
      sx={{ maxWidth: '300px' ,p:"0.8rem"}} // Adjust the maxWidth as needed
    />
  );
};

export default SearchComponent;
