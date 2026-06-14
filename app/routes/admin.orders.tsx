import type { Route } from './+types/admin.orders';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button, Chip, Input, Select, SelectItem } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiRefreshLine, RiSearchLine } from 'react-icons/ri';
import { AdminOrderDetailModal, AdminPageHeader, OrderTable, useAdminOrderDetailModal } from '~/components';
import type { OrderRow } from '~/components/admin/OrderTable';
import { fetchAdminOrders } from '~/utils/api/admin';
import { DEMO_ORDER_ID, DEMO_ORDER_ROW } from '~/data/demoOrder';
import { adminInputClassNames, adminSelectClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Quản lý Đơn hàng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Đơn hàng — NailSlay Admin' }];

const STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'RECEIVED', label: 'Đã nhận' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'COMPLAINED', label: 'Khiếu nại' },
  { value: 'RESOLVED', label: 'Đã giải quyết' },
];

function mapOrderRow(raw: Record<string, unknown>): OrderRow {
  return {
    id: String(raw.id),
    userId: String(raw.userId ?? raw.user_id ?? ''),
    userEmail: String(raw.userEmail ?? raw.user_email ?? raw.email ?? '—'),
    totalAmount: Number(raw.totalAmount ?? raw.total_amount ?? 0),
    status: String(raw.status ?? 'PENDING_PAYMENT') as OrderRow['status'],
    paymentMethod: String(raw.paymentMethod ?? raw.payment_method ?? 'BANK_TRANSFER'),
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}

export default function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedOrderId, isOpen, openOrderDetail, handleOpenChange } = useAdminOrderDetailModal();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders({
        status: statusFilter || undefined,
        limit: 50,
      });
      setOrders(data.items.map((item) => mapOrderRow(item)));
    } catch {
      toast.error('Không tải được đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) return;
    openOrderDetail(orderId);
    const next = new URLSearchParams(searchParams);
    next.delete('orderId');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, openOrderDetail]);

  const filtered = useMemo(() => {
    const base = orders.filter((o) => {
      const matchSearch =
        !search ||
        o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
    if (import.meta.env.DEV) {
      const demoMatches =
        (!search ||
          DEMO_ORDER_ROW.userEmail.toLowerCase().includes(search.toLowerCase()) ||
          DEMO_ORDER_ID.includes(search.toLowerCase()) ||
          search.toLowerCase().includes('mẫu') ||
          search.toLowerCase().includes('mau') ||
          search.toLowerCase().includes('demo')) &&
        (!statusFilter || DEMO_ORDER_ROW.status === statusFilter);
      if (demoMatches && !base.some((o) => o.id === DEMO_ORDER_ID)) {
        return [DEMO_ORDER_ROW, ...base];
      }
    }
    return base;
  }, [orders, search, statusFilter]);

  const statusCounts = useMemo(() => {
    return filtered.reduce(
      (acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }),
      {} as Record<string, number>,
    );
  }, [filtered]);

  return (
    <div className="space-y-5 admin-surface">
      <AdminPageHeader
        title="Quản lý Đơn hàng"
        description="Danh sách đơn hàng từ hệ thống. Nhấn vào hàng hoặc biểu tượng mắt để xem popup chi tiết."
        actions={
          <Button variant="flat" startContent={<RiRefreshLine />} onPress={load}>
            Làm mới
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => {
          const label = STATUSES.find((s) => s.value === status)?.label ?? status;
          return (
            <Chip key={status} size="sm" variant="flat" color="primary" className="text-[11px] font-medium text-[#1D1D1D]">
              {label} ({count})
            </Chip>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Tìm theo email hoặc mã đơn..."
          value={search}
          onValueChange={setSearch}
          startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
          className="max-w-xs"
          classNames={adminInputClassNames}
          isClearable
          onClear={() => setSearch('')}
        />
        <Select
          placeholder="Lọc trạng thái"
          selectedKeys={statusFilter ? new Set([statusFilter]) : new Set([''])}
          onSelectionChange={(keys) => setStatusFilter(String(Array.from(keys)[0] ?? ''))}
          className="max-w-[220px]"
          classNames={adminSelectClassNames}
        >
          {STATUSES.map((s) => (
            <SelectItem key={s.value}>{s.label}</SelectItem>
          ))}
        </Select>
        <Button size="sm" variant="flat" startContent={<RiRefreshLine size={14} />} onPress={() => { setSearch(''); setStatusFilter(''); }} className="text-[#8E8A8A]">
          Đặt lại
        </Button>
      </div>

      <p className="text-xs text-[#8E8A8A]">
        Hiển thị <strong className="text-[#1D1D1D]">{filtered.length}</strong> đơn hàng
      </p>

      <div className="rounded-xl border border-primary-200/70 bg-white dark:bg-[#2a2226] p-4">
        <OrderTable orders={filtered} isLoading={loading} onViewOrder={openOrderDetail} />
      </div>

      <AdminOrderDetailModal
        orderId={selectedOrderId}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        onOrderUpdated={load}
      />
    </div>
  );
}
