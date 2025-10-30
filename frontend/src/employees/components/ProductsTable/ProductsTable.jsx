import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel, 
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { createPortal } from 'react-dom';
import ProductsTablePopUp from '../ProductsTablePopUp/ProductsTablePopUp.jsx';
import ModifyPopUp from '../ProductsTablePopUp/ModifyPopUp.jsx';

import * as React from 'react'
import './ProductsTable.css'
import axios from 'axios'

function ProductTable() {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isPopUpOpen, setIsPopUpOpen] = React.useState(false);
  const [isModifyPopUpOpen, setIsModifyPopUpOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null); 

  const columns = [
    {
      accessorKey: 'p_id',
      header: 'ID',
    },
    {
      accessorKey: 'p_name',
      header: 'Product Name',
    },
    {
      accessorKey: 'p_category',
      header: 'Category',
    },
    {
      accessorKey: 'p_price',
      header: 'Price',
    },
    {
      accessorKey: 'active_sale',
      header: 'On Sale',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button 
          onClick={() => onClickPopUp(row.original, "modify")}
          className="edit-btn"
        >
          Edit
        </button>
      ),
    },
  ];

  const onClickPopUp = function(data, method) {
    if (data) { setSelectedProduct(data); };
    if (method === "add") setIsPopUpOpen(true);
    if (method === "modify") setIsModifyPopUpOpen(true);
  }

  const onClosePopUp = function() {
    setIsPopUpOpen(false);
    setIsModifyPopUpOpen(false);
  }

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  React.useEffect(() => {
    // Make GET request to fetch data
        axios
            .get(import.meta.env.VITE_API_DOMAIN + "/api/productItems")
            .then((response) => {
            setData(response.data);
          });
  }, [refreshTrigger]);

  const table = useReactTable({
    data,
    columns,
        state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <input
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
      />
      {isPopUpOpen && createPortal(<ProductsTablePopUp onClose={onClosePopUp} onRefresh={triggerRefresh}/>, document.body)}
      {isModifyPopUpOpen && createPortal(<ModifyPopUp onClose={onClosePopUp} onRefresh={triggerRefresh} product={selectedProduct}/>, document.body)}
      <button onClick={() => onClickPopUp([], "add")}>Add Product</button>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable
