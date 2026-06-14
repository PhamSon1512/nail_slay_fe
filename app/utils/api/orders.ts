import { http } from '../http';
import type { OrderStatus } from '~/utils/orderStatus';

export type UserOrder = {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
};

export type UserOrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrls: string[];
  };
};

export type UserOrderDetail = UserOrder & {
  address: { detail: string } | null;
  items: UserOrderItem[];
  complaint: {
    reason: string;
    imageUrls: string[];
    adminResponse?: string | null;
    status: string;
  } | null;
};

export type CheckoutResponse = {
  order: {
    id: string;
    total_amount: number;
    status: OrderStatus;
    created_at: string;
  };
  payment: {
    qr_code_url: string;
    bank_info: {
      bank_name?: string;
      account_number?: string;
      account_name?: string;
      transfer_content?: string;
    } | null;
  };
};

function mapUserOrder(raw: Record<string, unknown>): UserOrder {
  return {
    id: String(raw.id),
    totalAmount: Number(raw.totalAmount ?? raw.total_amount ?? 0),
    paymentMethod: String(raw.paymentMethod ?? raw.payment_method ?? 'BANK_TRANSFER'),
    status: String(raw.status ?? 'PENDING_PAYMENT') as OrderStatus,
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}

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

export function mapUserOrderDetail(raw: Record<string, unknown>): UserOrderDetail {
  const base = mapUserOrder(raw);
  const addressRaw = raw.address as Record<string, unknown> | null | undefined;
  const itemsRaw = (raw.items as Record<string, unknown>[]) ?? [];
  const complaintRaw = raw.complaint as Record<string, unknown> | null | undefined;

  return {
    ...base,
    address: addressRaw ? { detail: String(addressRaw.detail ?? '') } : null,
    items: itemsRaw.map((item) => {
      const product = (item.product as Record<string, unknown> | undefined) ?? item;
      return {
        id: String(item.id),
        quantity: Number(item.quantity ?? 0),
        price: Number(item.price ?? 0),
        product: {
          id: String(product.id ?? item.productId ?? ''),
          name: String(product.name ?? item.productName ?? ''),
          slug: String(product.slug ?? ''),
          imageUrls: parseImageUrls(product.imageUrls ?? product.productImageUrls ?? item.productImageUrls),
        },
      };
    }),
    complaint: complaintRaw
      ? {
          reason: String(complaintRaw.reason ?? ''),
          imageUrls: parseImageUrls(complaintRaw.imageUrls ?? complaintRaw.image_urls),
          adminResponse: (complaintRaw.adminResponse ?? complaintRaw.admin_response) as string | null | undefined,
          status: String(complaintRaw.status ?? 'OPEN'),
        }
      : null,
  };
}

export async function checkoutOrder(addressId: string) {
  const idempotencyKey = crypto.randomUUID();
  const { data } = await http.post<CheckoutResponse>(
    '/checkout',
    {
      address_id: addressId,
      payment_method: 'BANK_TRANSFER',
    },
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    },
  );
  return data;
}

export async function fetchUserOrders() {
  const { data } = await http.get<Record<string, unknown>[]>('/orders');
  return data.map(mapUserOrder);
}

export async function fetchUserOrder(id: string) {
  const { data } = await http.get<Record<string, unknown>>(`/orders/${id}`);
  return mapUserOrderDetail(data);
}

export async function updateUserOrderStatus(
  id: string,
  input: { status: 'RECEIVED' | 'COMPLAINED'; reason?: string; image_urls?: string[] },
) {
  const { data } = await http.post(`/orders/${id}/status`, input);
  return data;
}

export async function uploadComplaintImage(file: File) {
  const fd = new FormData();
  fd.append('image', file);
  const { data } = await http.post<{ url: string }>('/upload/complaints', fd);
  return data.url;
}
