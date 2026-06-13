import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { OrderStatusTimeline } from '~/components/admin/OrderStatusTimeline';
import { fetchAdminOrder, updateOrderStatus } from '~/utils/api/admin';
import { DEMO_ORDER_DETAIL, DEMO_ORDER_ID } from '~/data/demoOrder';
import { adminTableClassNames } from '~/utils/adminForm';
import { formatDateTime, formatVND } from '~/utils/format';
import { cn } from '~/utils';
import {
  ADMIN_ACTION_LABELS,
  ORDER_STATUS_LABELS,
  getAdminNextStatuses,
  paymentStatusLabel,
  type OrderStatus,
} from '~/utils/orderStatus';

function parseImageUrls(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((u): u is string => typeof u === 'string');
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

const SECTION_TITLE = 'font-heading text-base font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]';

type AdminOrderDetailModalProps = {
  orderId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated?: () => void;
};

export function AdminOrderDetailModal({
  orderId,
  isOpen,
  onOpenChange,
  onOrderUpdated,
}: AdminOrderDetailModalProps) {
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadOrder = useCallback(async (id: string) => {
    if (id === DEMO_ORDER_ID) {
      setOrder(DEMO_ORDER_DETAIL);
      return;
    }
    const data = await fetchAdminOrder(id);
    setOrder(data);
  }, []);

  useEffect(() => {
    if (!isOpen || !orderId) {
      setOrder(null);
      return;
    }
    setLoading(true);
    loadOrder(orderId)
      .catch(() => {
        toast.error('Không tải được chi tiết đơn hàng');
        onOpenChange(false);
      })
      .finally(() => setLoading(false));
  }, [isOpen, orderId, loadOrder, onOpenChange]);

  const handleStatusAction = async (nextStatus: OrderStatus) => {
    if (!orderId) return;
    if (orderId === DEMO_ORDER_ID) {
      toast.error('Đây là đơn hàng mẫu — không thể cập nhật trạng thái.');
      return;
    }
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, nextStatus);
      toast.success('Đã cập nhật trạng thái');
      await loadOrder(orderId);
      onOrderUpdated?.();
    } catch {
      // interceptor
    } finally {
      setUpdating(false);
    }
  };

  const user = order?.user as Record<string, unknown> | null;
  const address = order?.address as Record<string, unknown> | null;
  const items = (order?.items as Record<string, unknown>[]) ?? [];
  const complaint = order?.complaint as Record<string, unknown> | null | undefined;
  const status = String(order?.status ?? 'PENDING_PAYMENT') as OrderStatus;
  const nextActions = getAdminNextStatuses(status);
  const isDemo = orderId === DEMO_ORDER_ID;

  const actionButtonColor = (s: OrderStatus) => {
    if (s === 'CANCELLED') return 'danger' as const;
    if (s === 'PAID' || s === 'DELIVERED' || s === 'RESOLVED') return 'success' as const;
    return 'primary' as const;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white dark:bg-[#2a2226]',
        header: 'border-b border-primary-200/50',
        footer: 'border-t border-primary-200/50',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-[#1D1D1D] dark:text-[#FFF3F5]">
              <span>
                Chi tiết đơn #{orderId?.slice(0, 8) ?? '—'}
                {isDemo ? ' (Mẫu)' : ''}
              </span>
              {order ? (
                <span className="text-xs font-normal text-[#8E8A8A]">
                  Đặt lúc {formatDateTime(String(order.createdAt ?? order.created_at ?? ''))}
                </span>
              ) : null}
            </ModalHeader>

            <ModalBody className="gap-5 py-5">
              {loading ? (
                <p className="text-sm text-[#8E8A8A] py-8 text-center">Đang tải chi tiết đơn hàng...</p>
              ) : !order ? (
                <p className="text-sm text-[#8E8A8A] py-8 text-center">Không có dữ liệu đơn hàng.</p>
              ) : (
                <>
                  <section className="rounded-xl border border-primary-200/70 bg-primary-50/30 dark:bg-[#32282d] p-4 md:p-5">
                    <OrderStatusTimeline status={status} />
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="rounded-xl border border-primary-200/70 p-4 space-y-2 text-sm">
                      <h3 className={SECTION_TITLE}>Người đặt hàng</h3>
                      <p><span className="text-[#8E8A8A]">Họ tên:</span> {String(user?.fullName ?? '—')}</p>
                      <p><span className="text-[#8E8A8A]">Email:</span> {String(user?.email ?? '—')}</p>
                      <p><span className="text-[#8E8A8A]">SĐT:</span> {String(user?.phone ?? '—')}</p>
                    </section>

                    <section className="rounded-xl border border-primary-200/70 p-4 space-y-2 text-sm">
                      <h3 className={SECTION_TITLE}>Giao hàng / Thanh toán</h3>
                      <p><span className="text-[#8E8A8A]">Địa chỉ:</span> {String(address?.detail ?? '—')}</p>
                      <p>
                        <span className="text-[#8E8A8A]">Tổng tiền:</span>{' '}
                        <strong>{formatVND(Number(order.totalAmount ?? order.total_amount ?? 0))}</strong>
                      </p>
                      <p><span className="text-[#8E8A8A]">Phương thức:</span> Chuyển khoản ngân hàng</p>
                      <p><span className="text-[#8E8A8A]">Trạng thái thanh toán:</span> {paymentStatusLabel(status)}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#8E8A8A]">Trạng thái đơn:</span>
                        <Chip size="sm" color="primary" variant="flat">
                          {ORDER_STATUS_LABELS[status] ?? status}
                        </Chip>
                      </div>
                    </section>
                  </div>

                  <section className="rounded-xl border border-primary-200/70 p-4">
                    <h3 className={cn(SECTION_TITLE, 'mb-3')}>Sản phẩm trong đơn</h3>
                    <Table removeWrapper classNames={adminTableClassNames}>
                      <TableHeader>
                        <TableColumn>Ảnh</TableColumn>
                        <TableColumn>SKU</TableColumn>
                        <TableColumn>Tên sản phẩm</TableColumn>
                        <TableColumn>SL</TableColumn>
                        <TableColumn>Đơn giá</TableColumn>
                        <TableColumn>Thành tiền</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent="Không có sản phẩm">
                        {items.map((item) => {
                          const qty = Number(item.quantity ?? 0);
                          const price = Number(item.price ?? 0);
                          const images = parseImageUrls(item.productImageUrls ?? item.product_image_urls);
                          return (
                            <TableRow key={String(item.id ?? item.productId)}>
                              <TableCell>
                                {images[0] ? (
                                  <img src={images[0]} alt="" className="w-10 h-10 rounded object-cover border border-primary-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-100 border border-dashed" />
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {String(item.productSku ?? item.product_sku ?? '—')}
                              </TableCell>
                              <TableCell>{String(item.productName ?? item.product_name ?? '—')}</TableCell>
                              <TableCell>{qty}</TableCell>
                              <TableCell>{formatVND(price)}</TableCell>
                              <TableCell className="font-semibold">{formatVND(qty * price)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </section>

                  {complaint ? (
                    <section className="rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-[#32282d] dark:border-amber-800 p-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className={SECTION_TITLE}>Khiếu nại</h3>
                        <Button as={Link} to="/admin/complaints" size="sm" variant="flat" color="warning">
                          Xử lý khiếu nại
                        </Button>
                      </div>
                      <p><span className="text-[#8E8A8A]">Lý do:</span> {String(complaint.reason ?? '—')}</p>
                      <p><span className="text-[#8E8A8A]">Trạng thái:</span> {String(complaint.status ?? 'OPEN')}</p>
                      {complaint.adminResponse || complaint.admin_response ? (
                        <p>
                          <span className="text-[#8E8A8A]">Phản hồi admin:</span>{' '}
                          {String(complaint.adminResponse ?? complaint.admin_response)}
                        </p>
                      ) : null}
                      {parseImageUrls(complaint.imageUrls ?? complaint.image_urls).length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {parseImageUrls(complaint.imageUrls ?? complaint.image_urls).map((url) => (
                            <img key={url} src={url} alt="" className="w-16 h-16 object-cover rounded border" />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                </>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="light" className="text-[#8E8A8A]" onPress={onClose}>
                Đóng
              </Button>
              {!loading && order && nextActions.length > 0
                ? nextActions.map((next) => (
                    <Button
                      key={next}
                      size="md"
                      color={actionButtonColor(next)}
                      className={next !== 'CANCELLED' ? 'min-w-[9rem] text-base font-semibold text-[#1D1D1D]' : 'text-base font-semibold'}
                      isLoading={updating}
                      onPress={() => handleStatusAction(next)}
                    >
                      {ADMIN_ACTION_LABELS[next] ?? ORDER_STATUS_LABELS[next]}
                    </Button>
                  ))
                : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function useAdminOrderDetailModal() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openOrderDetail = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setIsOpen(true);
  }, []);

  const closeOrderDetail = useCallback(() => {
    setIsOpen(false);
    setSelectedOrderId(null);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setSelectedOrderId(null);
    } else {
      setIsOpen(true);
    }
  }, []);

  return {
    selectedOrderId,
    isOpen,
    openOrderDetail,
    closeOrderDetail,
    handleOpenChange,
  };
}
