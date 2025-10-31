import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { createPortal } from 'react-dom';
import axios from 'axios';

import ProductsTablePopUp from '../ProductsTablePopUp/ProductsTablePopUp.jsx';
import ModifyPopUp from '../ProductsTablePopUp/ModifyPopUp.jsx';

import './ProductsTable.css';

// normalize "on sale" to boolean
const isOnSale = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === 'yes' || v === 'true' || v === '1';
  }
  return false;
};

// format price like $20.00
const formatPrice = (value) => {
  if (value == null || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `$${num.toFixed(2)}`;
};

function ProductTable() {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const [isPopUpOpen, setIsPopUpOpen] = React.useState(false);
  const [isModifyPopUpOpen, setIsModifyPopUpOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // columns
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'p_id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'p_name',
        header: 'Product Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'p_category',
        header: 'Category',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'p_price',
        header: 'Price',
        cell: (info) => formatPrice(info.getValue()),
      },
      {
        accessorKey: 'active_sale',
        header: 'On Sale',
        cell: (info) => {
          const on = isOnSale(info.getValue());
          return <span className={on ? 'pill-yes' : 'pill-no'}>{on ? 'Yes' : 'No'}</span>;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => onClickPopUp(row.original, 'modify')}
            className="action-link"
            type="button"
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  const onClickPopUp = (rowData, method) => {
    if (rowData) {
      setSelectedProduct(rowData);
    }
    if (method === 'add') setIsPopUpOpen(true);
    if (method === 'modify') setIsModifyPopUpOpen(true);
  };

  const onClosePopUp = () => {
    setIsPopUpOpen(false);
    setIsModifyPopUpOpen(false);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // fetch data
  React.useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_DOMAIN + '/api/productItems')
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error('Error fetching products', err);
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
    <div className="products-page">
      <main className="products-main">
        <div className="products-container">
          {/* header */}
          <header>
            <h1 className="products-header-title">Products</h1>
            <p className="products-header-subtitle">
              Manage your store&apos;s products efficiently.
            </p>
          </header>

          {/* search + button */}
          <div className="products-toolbar">
            <div className="products-search-wrapper">
              <span className="products-search-icon">🔍</span>
              <input
                className="products-search-input"
                placeholder="Search products..."
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => onClickPopUp([], 'add')}
              className="products-add-btn"
            >
              <span className="material-icons-outlined"></span>
              <span>Add Product</span>
            </button>
          </div>

          {/* table */}
          <div className="products-table-card">
            <div className="products-table-scroll">
              <table className="products-table">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const id = header.column.id;
                        const thClass =
                          id === 'p_price'
                            ? 'is-right'
                            : id === 'active_sale' || id === 'actions'
                            ? 'is-center'
                            : '';
                        return (
                          <th key={header.id} className={thClass} scope="col">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          const colId = cell.column.id;
                          let tdClass = '';
                          if (colId === 'p_name') tdClass = 'name-cell';
                          if (colId === 'p_price') tdClass = 'is-right';
                          if (colId === 'active_sale' || colId === 'actions') {
                            tdClass = 'is-center';
                          }
                          return (
                            <td key={cell.id} className={tdClass}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={table.getAllColumns().length}
                        className="products-empty"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* popups */}
          {isPopUpOpen &&
            createPortal(
              <ProductsTablePopUp onClose={onClosePopUp} onRefresh={triggerRefresh} />,
              document.body
            )}
          {isModifyPopUpOpen &&
            createPortal(
              <ModifyPopUp
                onClose={onClosePopUp}
                onRefresh={triggerRefresh}
                product={selectedProduct}
              />,
              document.body
            )}
        </div>
      </main>
    </div>
  );
}

export default ProductTable;
