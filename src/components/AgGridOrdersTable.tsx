import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule, ValidationModule } from 'ag-grid-community';
import { Order } from '../types';
import { Search, Filter, RefreshCw, CheckCircle2, Clock, Truck, Package } from 'lucide-react';

// Register community modules
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

interface AgGridOrdersTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['fulfilmentStatus']) => void;
  onViewOrderDetail: (order: Order) => void;
}

export const AgGridOrdersTable: React.FC<AgGridOrdersTableProps> = ({
  orders,
  onUpdateStatus,
  onViewOrderDetail,
}) => {
  const [quickFilterText, setQuickFilterText] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const filteredOrders = React.useMemo(() => {
    if (selectedStatus === 'all') return orders;
    return orders.filter((o) => o.fulfilmentStatus === selectedStatus);
  }, [orders, selectedStatus]);

  // AG Grid Column Definitions
  const columnDefs = React.useMemo<ColDef<Order>[]>(
    () => [
      {
        field: 'id',
        headerName: 'Order ID',
        width: 130,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
              {params.value}
            </span>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Date',
        width: 140,
        sortable: true,
        filter: true,
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString();
        },
      },
      {
        field: 'customerName',
        headerName: 'Customer',
        width: 170,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const email = params.data?.customerEmail;
          return (
            <div className="leading-tight py-1">
              <div className="font-semibold text-slate-900 truncate">{params.value}</div>
              <div className="text-[10px] text-slate-400 truncate">{email}</div>
            </div>
          );
        },
      },
      {
        headerName: 'Items',
        width: 90,
        valueGetter: (params) => {
          return params.data?.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0;
        },
        sortable: true,
      },
      {
        field: 'total',
        headerName: 'Total ($)',
        width: 120,
        sortable: true,
        filter: true,
        valueFormatter: (params) => {
          return `$${Number(params.value || 0).toFixed(2)}`;
        },
        cellClass: 'font-bold text-slate-900',
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment',
        width: 130,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {status}
            </span>
          );
        },
      },
      {
        field: 'fulfilmentStatus',
        headerName: 'Fulfilment Status',
        width: 170,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value as Order['fulfilmentStatus'];
          const orderId = params.data?.id;

          return (
            <select
              value={status}
              onChange={(e) => onUpdateStatus(orderId, e.target.value as Order['fulfilmentStatus'])}
              className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
            >
              <option value="unfulfilled">Unfulfilled</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          );
        },
      },
      {
        headerName: 'Action',
        width: 100,
        cellRenderer: (params: any) => {
          return (
            <button
              onClick={() => onViewOrderDetail(params.data)}
              className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Inspect
            </button>
          );
        },
      },
    ],
    [onUpdateStatus, onViewOrderDetail]
  );

  const defaultColDef = React.useMemo<ColDef>(
    () => ({
      resizable: true,
      suppressMovable: false,
    }),
    []
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Table Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              placeholder="Filter orders in AG Grid..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 bg-white text-slate-700"
          >
            <option value="all">All Fulfilment</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">AG Grid Community Active</span>
          <span>•</span>
          <span>{filteredOrders.length} Records</span>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="ag-theme-quartz w-full h-[420px]">
        <AgGridReact
          theme="legacy"
          rowData={filteredOrders}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
          animateRows={true}
          rowSelection={{ mode: 'singleRow' }}
        />
      </div>
    </div>
  );
};
