import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import * as React from 'react'
import './OrdersTable.css'

const ordersData = [
  {
    "order_id": "1",
    "order_lines": {
      1: {
        "order_method": "Buy Now",
        "product_id": "1",
        "p_name": "Milk Bread",
        "quantity": "5",
      },
      2: {
        "order_method": "Pre Order",
        "product_id": "2",
        "p_name": "White Bread",
        "quantity": "4",
      }
    },
    "order_creation_date": "2025-09-27T06:06:45.665Z",
    "status": "pending",
    "status_update_date": null,
    "payment_proof": "1759576496100-Screenshot from 2025-07-17 13-17-25.png",
    "shipping_destination": "Bangkok thailand"
  },
  {
    "order_id": "2",
    "order_lines": {
      1: {
        "order_method": "Buy Now",
        "product_id": "1",
        "p_name": "Milk Bread2",
        "quantity": "5",
      },
      2: {
        "order_method": "Pre Order",
        "product_id": "2",
        "p_name": "White Bread2",
        "quantity": "4",
      }
    },
    "order_creation_date": "2025-09-27T06:06:45.665Z",
    "status": "pending",
    "status_update_date": null,
    "payment_proof": "1759576496100-Screenshot from 2025-07-17 13-17-25.png",
    "shipping_destination": "Bangkok thailand"
  },
]

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('order_id', {
    header: () => <span>Order ID</span>,
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.lastName, {
    id: 'lastName',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: info => info.column.id,
  }),
]

function OrdersTable() {
  const [data, _setData] = React.useState(() => [...ordersData])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default OrdersTable