import { http } from '../http';
import type { HomepageConfig } from '~/data/homepage';

export type PublicSettings = {
  homepage: HomepageConfig | null;
  contact_info: Record<string, string> | null;
  bank_info: Record<string, string> | null;
  qr_code_url?: string | null;
};

export async function fetchPublicSettings() {
  const { data } = await http.get<PublicSettings>('/settings/public');
  const bankInfo = { ...(data.bank_info ?? {}) };
  if (!bankInfo.qr_code_url && data.qr_code_url) {
    bankInfo.qr_code_url = data.qr_code_url;
  }
  return { ...data, bank_info: Object.keys(bankInfo).length ? bankInfo : null };
}
