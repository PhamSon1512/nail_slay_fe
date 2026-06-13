import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { RiEyeLine } from 'react-icons/ri';
import { ORDER_STATUS_LABELS, type OrderStatus } from '~/utils/orderStatus';
import { formatDateTime, formatVND, shortId } from '~/utils/format';

export type OrderRow = {
  id: string;
  userId: string;
  userEmail?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string | Date;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: 'warning' | 'primary' | 'secondary' | 'success' | 'danger' | 'default' }> = {
  PENDING_PAYMENT: { label: ORDER_STATUS_LABELS.PENDING_PAYMENT, color: 'warning' },
  PAID: { label: ORDER_STATUS_LABELS.PAID, color: 'primary' },
  SHIPPING: { label: ORDER_STATUS_LABELS.SHIPPING, color: 'secondary' },
  DELIVERED: { label: ORDER_STATUS_LABELS.DELIVERED, color: 'success' },
  RECEIVED: { label: ORDER_STATUS_LABELS.RECEIVED, color: 'success' },
  CANCELLED: { label: ORDER_STATUS_LABELS.CANCELLED, color: 'danger' },
  COMPLAINED: { label: ORDER_STATUS_LABELS.COMPLAINED, color: 'warning' },
  RESOLVED: { label: ORDER_STATUS_LABELS.RESOLVED, color: 'default' },
};

const COLUMNS = [
  { key: 'id', label: 'Mã đơn' },
  { key: 'customer', label: 'Khách hàng' },
  { key: 'amount', label: 'Tổng tiền' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'date', label: 'Ngày đặt' },
  { key: 'actions', label: '' },
];

interface OrderTableProps {
  orders: OrderRow[];
  isLoading?: boolean;
  onViewOrder?: (orderId: string) => void;
}

export function OrderTable({ orders, isLoading, onViewOrder }: OrderTableProps) {
  const handleView = (orderId: string) => {
    if (onViewOrder) {
      onViewOrder(orderId);
      return;
    }
  };

  return (
    <Table
      aria-label="Danh sách đơn hàng"
      isStriped
      removeWrapper
      classNames={{
        th: 'bg-primary-100/50 dark:bg-primary-800/30 text-xs text-[#8E8A8A] dark:text-[#FFDDE5] font-semibold uppercase tracking-wider first:rounded-l-lg last:rounded-r-lg',
        td: 'py-3 text-sm',
        tr: 'cursor-pointer hover:bg-primary-50/40 dark:hover:bg-[#32282d]',
      }}
    >
      <TableHeader columns={COLUMNS}>
        {(col) => <TableColumn key={col.key}>{col.label}</TableColumn>}
      </TableHeader>

      <TableBody
        items={orders}
        isLoading={isLoading}
        emptyContent={
          <div className="py-12 text-[#8E8A8A] text-sm text-center">
            Không có đơn hàng nào
          </div>
        }
      >
        {(order) => (
          <TableRow key={order.id} onClick={() => handleView(order.id)}>
            <TableCell>
              <span className="font-mono font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                {shortId(order.id)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-[#1D1D1D] dark:text-[#FFDDE5]">
                {order.userEmail ?? order.userId.slice(0, 8)}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                {formatVND(order.totalAmount)}
              </span>
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                color={STATUS_CONFIG[order.status]?.color ?? 'default'}
                variant="flat"
                className="text-[11px] font-medium"
              >
                {STATUS_CONFIG[order.status]?.label ?? order.status}
              </Chip>
            </TableCell>
            <TableCell>
              <span className="text-[#8E8A8A] dark:text-[#FFDDE5] text-xs">
                {formatDateTime(order.createdAt)}
              </span>
            </TableCell>
            <TableCell>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                aria-label="Xem chi tiết"
                className="text-[#8E8A8A] hover:text-[#1D1D1D]"
                onPress={() => handleView(order.id)}
              >
                <RiEyeLine size={16} />
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export type { OrderStatus };
