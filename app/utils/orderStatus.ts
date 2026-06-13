export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'RECEIVED'
  | 'COMPLAINED'
  | 'CANCELLED'
  | 'RESOLVED';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  RECEIVED: 'Đã nhận',
  COMPLAINED: 'Khiếu nại',
  CANCELLED: 'Đã hủy',
  RESOLVED: 'Đã giải quyết',
};

const ADMIN_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPING'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  RECEIVED: [],
  COMPLAINED: ['RESOLVED'],
  CANCELLED: [],
  RESOLVED: [],
};

export const ADMIN_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  PAID: 'Xác nhận đã thanh toán',
  CANCELLED: 'Hủy đơn',
  SHIPPING: 'Lên đơn / Đang giao',
  DELIVERED: 'Đã giao hàng',
  RESOLVED: 'Giải quyết khiếu nại',
};

export function getAdminNextStatuses(status: OrderStatus): OrderStatus[] {
  return ADMIN_TRANSITIONS[status] ?? [];
}

export const ORDER_TIMELINE: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAID',
  'SHIPPING',
  'DELIVERED',
  'RECEIVED',
];

export function paymentStatusLabel(status: OrderStatus): string {
  if (status === 'PENDING_PAYMENT') return 'Chưa thanh toán';
  if (status === 'CANCELLED') return 'Đã hủy';
  return 'Đã xác nhận thanh toán';
}

const USER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [],
  PAID: [],
  SHIPPING: [],
  DELIVERED: ['RECEIVED', 'COMPLAINED'],
  RECEIVED: [],
  COMPLAINED: [],
  CANCELLED: [],
  RESOLVED: [],
};

export const USER_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  RECEIVED: 'Đã nhận hàng',
  COMPLAINED: 'Khiếu nại',
};

export function getUserNextStatuses(status: OrderStatus): OrderStatus[] {
  return USER_TRANSITIONS[status] ?? [];
}
