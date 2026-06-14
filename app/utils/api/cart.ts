import { http } from '../http';

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrls: string[];
};

export type CartItem = {
  id: string;
  quantity: number;
  variantId?: string | null;
  product: CartProduct;
};

export type CartResponse = {
  items: CartItem[];
  subtotal: number;
};

function parseImageUrls(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((u): u is string => typeof u === 'string');
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapCartItem(raw: Record<string, unknown>): CartItem {
  const productRaw = (raw.product as Record<string, unknown> | undefined) ?? {};
  const productId = String(productRaw.id ?? raw.productId ?? raw.product_id ?? '');

  return {
    id: String(raw.id ?? raw.cart_item_id ?? raw.cartItemId ?? ''),
    quantity: Number(raw.quantity ?? 0),
    variantId: (raw.variant_id ?? raw.variantId ?? null) as string | null,
    product: {
      id: productId,
      name: String(productRaw.name ?? ''),
      slug: String(productRaw.slug ?? ''),
      price: Number(productRaw.price ?? 0),
      stock: Number(productRaw.stock ?? 0),
      imageUrls: parseImageUrls(productRaw.imageUrls ?? productRaw.image_urls),
    },
  };
}

function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export async function fetchCart() {
  const { data } = await http.get<{ items?: unknown[]; subtotal?: number }>('/cart');
  const items = Array.isArray(data.items)
    ? data.items
        .map((item) => mapCartItem(item as Record<string, unknown>))
        .filter((item) => item.id && item.product.id)
    : [];
  return {
    items,
    subtotal: Number(data.subtotal ?? calcSubtotal(items)),
  };
}

export async function addCartItem(productId: string, quantity = 1, variantId?: string) {
  const { data } = await http.post('/cart', {
    product_id: productId,
    quantity,
    ...(variantId ? { variant_id: variantId } : {}),
  });
  return data;
}

export async function updateCartItem(id: string, quantity: number) {
  const { data } = await http.put(`/cart/${id}`, { quantity });
  return data;
}

export async function removeCartItem(id: string) {
  const { data } = await http.delete(`/cart/${id}`);
  return data;
}
