import { http } from '../http';

export type Address = {
  id: string;
  userId: string;
  detail: string;
  isDefault: boolean;
};

function mapAddress(raw: Record<string, unknown>): Address {
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? raw.user_id ?? ''),
    detail: String(raw.detail ?? ''),
    isDefault: Boolean(raw.isDefault ?? raw.is_default ?? false),
  };
}

export async function fetchAddresses() {
  const { data } = await http.get<Record<string, unknown>[]>('/addresses');
  return Array.isArray(data) ? data.map(mapAddress) : [];
}

export async function createAddress(detail: string, isDefault = true) {
  const { data } = await http.post<Record<string, unknown>>('/addresses', { detail, isDefault });
  const address = mapAddress(data);
  if (!address.id) {
    throw new Error('Invalid address response');
  }
  return address;
}

export async function updateAddress(id: string, detail: string) {
  const { data } = await http.put<Record<string, unknown>>(`/addresses/${id}`, { detail });
  return mapAddress(data);
}

export async function deleteAddress(id: string) {
  const { data } = await http.delete(`/addresses/${id}`);
  return data;
}
