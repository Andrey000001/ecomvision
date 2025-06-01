import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetTransactionsQuery } from 'state/api';
import Header from 'components/Header';
import { useTheme, Box } from '@mui/material';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';

const Transactions = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [density, setDensity] = useState('standard');
  const [columnVisibility, setColumnVisibility] = useState({
    _id: true,
    userId: true,
    createdAt: true,
    products: true,
    cost: true,
  });

  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'userId',
      headerName: 'User ID',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'createdAt',
      flex: 1,
    },
    {
      field: 'products',
      headerName: '# of products',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(2)}`,
    },
  ];
  
  const visibleColumns = columns.filter((col) => columnVisibility[col.field] !== false);

  const handleExport = () => {
    if (!data?.transactions) return;
    const headers = visibleColumns.map((col) => col.headerName).join(',');

    const csvRows = data.transactions.map((row) =>
      visibleColumns
        .map((col) => {
          let value = row[col.field];
          if (col.field === 'cost') value = `$${Number(value).toFixed(2)}`;
          if (col.field === 'products') value = value.length;
          if (value === undefined || value === null) value = '';
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(','),
    );

    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box
        height="80vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: `#e3f2fd !important`,
            color: `${theme.palette.secondary[100]}`,
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGridCustomToolbar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearch={setSearch}
          onExport={handleExport}
          density={density}
          setDensity={setDensity}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columns={columns}
        />
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={visibleColumns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel) || {}}
          density={density}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
