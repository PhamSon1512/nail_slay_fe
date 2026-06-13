import { http } from '../http';
import type { HomepageConfig } from '~/data/homepage';

export type PublicSettings = {
  homepage: HomepageConfig | null;
  contact_info: Record<string, string> | null;
  bank_info: Record<string, string> | null;
};

export async function fetchPublicSettings() {
  const { data } = await http.get<PublicSettings>('/settings/public');
  return data;
}
