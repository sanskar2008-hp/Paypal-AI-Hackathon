import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule, ValidationModule } from 'ag-grid-community';
import { Order } from '../types';
import { Search, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';

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
        headerName: 'Order Ref',
        width: 140,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <span className="font-mono font-bold text-[#43D9FF] bg-[#43D9FF]/10 px-2 py-0.5 rounded border border-[#43D9FF]/20 text-xs">
              {params.value}
            </span>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Timestamp',
        width: 130,
        sortable: true,
        filter: true,
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString();
        },
        cellClass: 'text-[#9299B2] text-xs',
      },
      {
        field: 'customerName',
        headerName: 'Customer',
        width: 180,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const email = params.data?.customerEmail;
          return (
            <div className="leading-tight py-1">
              <div className="font-semibold text-white truncate">{params.value}</div>
              <div className="text-[10px] text-[#9299B2] truncate font-mono">{email}</div>
            </div>
          );
        },
      },
      {
        headerName: 'SKUs',
        width: 80,
        valueGetter: (params) => {
          return params.data?.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0;
        },
        sortable: true,
        cellClass: 'text-white text-xs font-mono',
      },
      {
        field: 'total',
        headerName: 'Settlement',
        width: 125,
        sortable: true,
        filter: true,
        valueFormatter: (params) => {
          return `$${Number(params.value || 0).toFixed(2)}`;
        },
        cellClass: 'font-mono font-bold text-[#43D9FF]',
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment Gate',
        width: 140,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38D99A]/15 text-[#38D99A] border border-[#38D99A]/20">
              <CheckCircle2 className="w-3 h-3 text-[#38D99A]" />
              {status}
            </span>
          );
        },
      },
      {
        field: 'fulfilmentStatus',
        headerName: 'Logistics Lifecycle',
        width: 175,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value as Order['fulfilmentStatus'];
          const orderId = params.data?.id;

          return (
            <select
              value={status}
              onChange={(e) => onUpdateStatus(orderId, e.target.value as Order['fulfilmentStatus'])}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-white/10 bg-[#101321] text-white focus:outline-hidden focus:border-[#8757FF] cursor-pointer"
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
        headerName: 'Audit',
        width: 100,
        cellRenderer: (params: any) => {
          return (
            <button
              onClick={() => onViewOrderDetail(params.data)}
              className="px-2.5 py-1 text-xs font-bold text-[#8757FF] hover:text-[#43D9FF] hover:bg-[#8757FF]/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              <span>Inspect</span>
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
    <div className="bg-[#151A2B] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Table Toolbar */}
      <div className="p-4 bg-[#101321] border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[#9299B2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              placeholder="Search orders, customers, IDs..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#151A2B] text-white placeholder-[#9299B2] focus:outline-hidden focus:border-[#8757FF]"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
          >
            <option value="all">All Fulfilment</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-[#9299B2]">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#43D9FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43D9FF] animate-pulse"></span>
            <span>AG Grid Community Active</span>
          </div>
          <span>•</span>
          <span className="font-mono text-white">{filteredOrders.length} Records</span>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="ag-theme-quartz-dark w-full h-[440px]">
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
