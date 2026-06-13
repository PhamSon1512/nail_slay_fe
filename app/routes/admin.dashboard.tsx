import type { Route } from './+types/admin.dashboard';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { RiAlertLine, RiBox3Line, RiMoneyDollarCircleLine, RiOrderPlayLine, RiUserLine } from 'react-icons/ri';
import { AdminOrderDetailModal, AdminPageHeader, OrderTable, useAdminOrderDetailModal } from '~/components';
import type { OrderRow } from '~/components/admin/OrderTable';
import { StatsCard } from '~/components/admin/StatsCard';
import { fetchAdminOrders, fetchAdminStats } from '~/utils/api/admin';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Dashboard' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Dashboard - Nailslay Admin' }];

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  RECEIVED: 'Đã nhận',
  CANCELLED: 'Đã hủy',
};

function mapOrderRow(raw: Record<string, unknown>): OrderRow {
  return {
    id: String(raw.id),
    userId: String(raw.userId ?? raw.user_id ?? ''),
    userEmail: String(raw.userEmail ?? raw.user_email ?? '—'),
    totalAmount: Number(raw.totalAmount ?? raw.total_amount ?? 0),
    status: String(raw.status ?? 'PENDING_PAYMENT') as OrderRow['status'],
    paymentMethod: String(raw.paymentMethod ?? raw.payment_method ?? 'BANK_TRANSFER'),
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const { selectedOrderId, isOpen, openOrderDetail, handleOpenChange } = useAdminOrderDetailModal();

  const loadRecentOrders = () => {
    fetchAdminOrders({ limit: 5 })
      .then((data) => setRecentOrders(data.items.map(mapOrderRow)))
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => undefined);
    loadRecentOrders();
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Dashboard" description="Tổng quan dữ liệu thực từ hệ thống." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Doanh thu tháng"
          value={formatVND(Number(stats.revenue_this_month ?? 0))}
          icon={RiMoneyDollarCircleLine}
        />
        <StatsCard
          label="Tổng đơn hàng"
          value={Number(stats.orders_total ?? 0)}
          icon={RiOrderPlayLine}
          colorClass="bg-[#FFDDE5] text-[#1D1D1D]"
        />
        <StatsCard
          label="Sản phẩm"
          value={Number(stats.products_total ?? 0)}
          icon={RiBox3Line}
          colorClass="bg-primary-200/70 text-[#1D1D1D]"
        />
        <StatsCard
          label="Người dùng"
          value={Number(stats.users_total ?? 0)}
          icon={RiUserLine}
          colorClass="bg-[#f9c9d5] text-[#1D1D1D]"
        />
        <StatsCard
          label="Khiếu nại mở"
          value={Number(stats.open_complaints ?? 0)}
          icon={RiAlertLine}
          colorClass="bg-primary-100 text-[#1D1D1D]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
            <CardHeader className="flex items-center justify-between pb-0">
              <h3 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] text-base">
                Đơn hàng gần đây
              </h3>
              <a href="/admin/orders" className="text-xs text-[#1D1D1D] dark:text-[#FFDDE5] hover:underline">
                Xem tất cả →
              </a>
            </CardHeader>
            <CardBody className="pt-4">
              <OrderTable orders={recentOrders} onViewOrder={openOrderDetail} />
            </CardBody>
          </Card>
        </div>

        <div>
          <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
            <CardHeader className="pb-0">
              <h3 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] text-base">
                Trạng thái đơn hàng
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 pt-4">
              {Object.entries((stats.orders_by_status as Record<string, number>) ?? {}).length ? (
                Object.entries((stats.orders_by_status as Record<string, number>) ?? {}).map(([status, count]) => {
                  const statusMap = (stats.orders_by_status as Record<string, number>) ?? {};
                  const max = Math.max(...Object.values(statusMap), 1);
                  const pct = max > 0 ? (count / max) * 100 : 0;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8E8A8A]">{STATUS_LABELS[status] ?? status}</span>
                        <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{count}</span>
                      </div>
                      <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#8E8A8A]">Chưa có đơn hàng</p>
              )}
            </CardBody>
          </Card>

          <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] mt-4">
            <CardBody>
              <p className="text-xs text-[#8E8A8A] uppercase tracking-wider font-semibold mb-1">Tổng doanh thu</p>
              <p className="font-heading text-2xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
                {formatVND(Number(stats.revenue_total ?? 0))}
              </p>
              <p className="text-xs text-[#8E8A8A] mt-1">Tất cả thời gian</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <AdminOrderDetailModal
        orderId={selectedOrderId}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        onOrderUpdated={loadRecentOrders}
      />
    </div>
  );
}
