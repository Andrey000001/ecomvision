import React, { useState } from 'react';
import {
  FileDownloadOutlined,
  ViewWeekOutlined,
  SearchOutlined,
  DensitySmallOutlined,
  DensityMediumOutlined,
  DensityLargeOutlined,
} from '@mui/icons-material';
import { Box, IconButton, InputBase, Button, Menu, MenuItem, useTheme } from '@mui/material';
import FlexBetween from './FlexBetween';
import { useSelector } from 'react-redux';

const DataGridCustomToolbar = ({
  searchInput = '',
  setSearchInput = () => {},
  setSearch = () => {},
  onExport = () => {},
  density = 'standard',
  setDensity = () => {},
  columnVisibility = {},
  setColumnVisibility = () => {},
  columns = [],
}) => {
  const theme = useTheme();

  const [columnsAnchor, setColumnsAnchor] = useState(null);
  const [densityAnchor, setDensityAnchor] = useState(null);
  const mode = useSelector((state) => state.global.mode);

  return (
    <FlexBetween>
      <Box>
        {/* Columns Button */}
        <Button
          onClick={(e) => setColumnsAnchor(e.currentTarget)}
          sx={{ color: mode === 'dark' ? theme.palette.common.white : theme.palette.common.black }}
          startIcon={<ViewWeekOutlined />}
        >
          COLUMNS
        </Button>
        <Menu
          anchorEl={columnsAnchor}
          open={Boolean(columnsAnchor)}
          onClose={() => setColumnsAnchor(null)}
        >
          {columns.map((column) => (
            <MenuItem
              key={column.field}
              onClick={() => {
                setColumnVisibility((prev) => ({
                  ...prev,
                  [column.field]: !prev[column.field],
                }));
              }}
              sx={{
                bgcolor: columnVisibility[column.field]
                  ? theme.palette.primary.light
                  : theme.palette.common.black,
              }}
            >
              {column.headerName}
            </MenuItem>
          ))}
        </Menu>

        {/* Density Button */}
        <Button
          startIcon={
            density === 'compact' ? (
              <DensitySmallOutlined />
            ) : density === 'standard' ? (
              <DensityMediumOutlined />
            ) : (
              <DensityLargeOutlined />
            )
          }
          onClick={(e) => setDensityAnchor(e.currentTarget)}
          sx={{
            ml: 1,
            color: mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
          }}
        >
          DENSITY
        </Button>
        <Menu
          anchorEl={densityAnchor}
          open={Boolean(densityAnchor)}
          onClose={() => setDensityAnchor(null)}
        >
          {['compact', 'standard', 'comfortable'].map((option) => (
            <MenuItem
              key={option}
              onClick={() => {
                setDensity(option);
                setDensityAnchor(null);
              }}
              selected={density === option}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Menu>

        {/* Export Button */}
        <Button
          onClick={onExport}
          sx={{ color: mode === 'dark' ? theme.palette.common.white : theme.palette.common.black }}
          startIcon={<FileDownloadOutlined />}
        >
          EXPORT
        </Button>
      </Box>

      {/* Search */}
      <Box display="flex" alignItems="center">
        <InputBase
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput)}
          sx={{
            backgroundColor:
              mode === 'light' ? theme.palette.common.white : theme.palette.background.default,
            p: '0.5rem 1rem',
            borderBottom: '0.5px solid ',
            mr: 1,
          }}
        />
        <IconButton
          onClick={() => setSearch(searchInput)}
          sx={{
            backgroundColor:
              mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <SearchOutlined />
        </IconButton>
      </Box>
    </FlexBetween>
  );
};

export default DataGridCustomToolbar;
