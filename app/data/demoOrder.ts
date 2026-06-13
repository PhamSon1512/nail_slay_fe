import type { OrderRow } from '~/components/admin/OrderTable';

export const DEMO_ORDER_ID = 'demo-sample-order';

export const DEMO_ORDER_ROW: OrderRow = {
  id: DEMO_ORDER_ID,
  userId: 'demo-user-id',
  userEmail: 'nguyenvana@email.vn · Đơn mẫu',
  totalAmount: 447_000,
  status: 'PAID',
  paymentMethod: 'BANK_TRANSFER',
  createdAt: '2026-06-10T14:30:00.000Z',
};

export const DEMO_ORDER_DETAIL: Record<string, unknown> = {
  id: DEMO_ORDER_ID,
  totalAmount: 447_000,
  total_amount: 447_000,
  paymentMethod: 'BANK_TRANSFER',
  status: 'PAID',
  createdAt: '2026-06-10T14:30:00.000Z',
  created_at: '2026-06-10T14:30:00.000Z',
  user: {
    id: 'demo-user-id',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.vn',
    phone: '0901234567',
  },
  address: {
    detail: '123 Nguyễn Huệ, Quận 1, TP.HCM. Người nhận: Nguyễn Văn A — 0901234567',
  },
  items: [
    {
      id: 'demo-item-1',
      quantity: 2,
      price: 149_000,
      productSku: 'NB-CYBER-01',
      productName: 'Nail Box Nailslay - Cyber Slay',
      productImageUrls: ['/branding/banner-web.png'],
    },
    {
      id: 'demo-item-2',
      quantity: 1,
      price: 149_000,
      productSku: 'NB-PINK-02',
      productName: 'Nail Box Nailslay - Pink Bloom',
      productImageUrls: ['/branding/banner-web.png'],
    },
  ],
  complaint: null,
};
