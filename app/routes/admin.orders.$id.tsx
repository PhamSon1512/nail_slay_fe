import type { Route } from './+types/admin.orders.$id';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Button, Card, CardBody, Chip, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiArrowLeftLine } from 'react-icons/ri';
import { AdminPageHeader } from '~/components';
import { fetchAdminOrder, updateOrderStatus } from '~/utils/api/admin';
import { adminSelectClassNames, adminTableClassNames } from '~/utils/adminForm';
import { formatDateTime, formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Chi tiết đơn hàng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Chi tiết đơn hàng - Admin Nailslay' }];

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  RECEIVED: 'Đã nhận',
  CANCELLED: 'Đã hủy',
  COMPLAINED: 'Khiếu nại',
  RESOLVED: 'Đã giải quyết',
};

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (id === 'demo-order-preview') {
      setOrder({
        id,
        status: 'PENDING_PAYMENT',
        totalAmount: 450000,
        paymentMethod: 'BANK_TRANSFER',
        createdAt: new Date().toISOString(),
        user: { email: 'demo@nailslay.vn', fullName: 'Khách demo', phone: '0900000000' },
        address: { detail: '123 Demo Street, Quận 1, TP.HCM' },
        items: [
          { productName: 'Nail Box Demo', productSku: 'NB-DEMO', quantity: 1, price: 450000 },
        ],
      });
      setLoading(false);
      return;
    }

    fetchAdminOrder(id)
      .then(setOrder)
      .catch(() => {
        toast.error('Không tải được chi tiết đơn hàng');
        navigate('/admin/orders');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatusChange = async (status: string) => {
    if (!id || id === 'demo-order-preview') {
      toast.error('Không thể cập nhật đơn mẫu');
      return;
    }
    setUpdating(true);
    try {
      await updateOrderStatus(id, status);
      toast.success('Đã cập nhật trạng thái');
      const refreshed = await fetchAdminOrder(id);
      setOrder(refreshed);
    } catch {
      // interceptor
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-sm text-[#8E8A8A]">Đang tải...</p>;
  if (!order) return null;

  const user = order.user as Record<string, unknown> | null;
  const address = order.address as Record<string, unknown> | null;
  const items = (order.items as Record<string, unknown>[]) ?? [];
  const status = String(order.status ?? 'PENDING_PAYMENT');

  return (
    <div className="space-y-6 admin-surface max-w-4xl">
      <AdminPageHeader
        title={`Chi tiết đơn #${String(order.id).slice(0, 8)}`}
        description={`Đặt lúc ${formatDateTime(String(order.createdAt ?? order.created_at ?? ''))}`}
        actions={
          <Button as={Link} to="/admin/orders" variant="flat" startContent={<RiArrowLeftLine size={16} />}>
            Quay lại
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card shadow="none" className="border border-primary-200/70 bg-white dark:bg-[#2a2226]">
          <CardBody className="gap-3 text-sm">
            <h3 className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Người đặt hàng</h3>
            <p><span className="text-[#8E8A8A]">Họ tên:</span> {String(user?.fullName ?? '—')}</p>
            <p><span className="text-[#8E8A8A]">Email:</span> {String(user?.email ?? '—')}</p>
            <p><span className="text-[#8E8A8A]">SĐT:</span> {String(user?.phone ?? '—')}</p>
            <p><span className="text-[#8E8A8A]">Địa chỉ:</span> {String(address?.detail ?? '—')}</p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-primary-200/70 bg-white dark:bg-[#2a2226]">
          <CardBody className="gap-3 text-sm">
            <h3 className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Thanh toán & trạng thái</h3>
            <p><span className="text-[#8E8A8A]">Tổng tiền:</span> <strong>{formatVND(Number(order.totalAmount ?? order.total_amount ?? 0))}</strong></p>
            <p><span className="text-[#8E8A8A]">Phương thức:</span> {String(order.paymentMethod ?? order.payment_method ?? 'BANK_TRANSFER')}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#8E8A8A]">Trạng thái:</span>
              <Chip size="sm" color="primary" variant="flat">{STATUS_LABELS[status] ?? status}</Chip>
            </div>
            <Select
              label="Cập nhật trạng thái"
              selectedKeys={new Set([status])}
              onSelectionChange={(keys) => handleStatusChange(String(Array.from(keys)[0] ?? status))}
              isDisabled={updating || id === 'demo-order-preview'}
              classNames={adminSelectClassNames}
            >
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
      </div>

      <Card shadow="none" className="border border-primary-200/70 bg-white dark:bg-[#2a2226]">
        <CardBody>
          <h3 className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] mb-4">Sản phẩm trong đơn</h3>
          <Table removeWrapper classNames={adminTableClassNames}>
            <TableHeader>
              <TableColumn>SKU</TableColumn>
              <TableColumn>Tên sản phẩm</TableColumn>
              <TableColumn>Số lượng</TableColumn>
              <TableColumn>Đơn giá</TableColumn>
              <TableColumn>Thành tiền</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Không có sản phẩm">
              {items.map((item) => {
                const qty = Number(item.quantity ?? 0);
                const price = Number(item.price ?? 0);
                return (
                  <TableRow key={String(item.id ?? item.productId)}>
                    <TableCell className="font-mono text-xs">{String(item.productSku ?? item.product_sku ?? '—')}</TableCell>
                    <TableCell>{String(item.productName ?? item.product_name ?? '—')}</TableCell>
                    <TableCell>{qty}</TableCell>
                    <TableCell>{formatVND(price)}</TableCell>
                    <TableCell className="font-semibold">{formatVND(qty * price)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
