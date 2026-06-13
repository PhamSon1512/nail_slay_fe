export type BannerItem = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomepageFeature = {
  id: string;
  icon: 'truck' | 'shield' | 'bag';
  title: string;
  description: string;
};

export const DEFAULT_BANNERS: BannerItem[] = [];

export const DEFAULT_HOMEPAGE_FEATURES: HomepageFeature[] = [
  {
    id: 'feat-1',
    icon: 'truck',
    title: 'Giao nhanh toàn quốc',
    description: 'Nhận hàng sau 2–3 ngày làm việc.',
  },
  {
    id: 'feat-2',
    icon: 'shield',
    title: 'An toàn cho móng',
    description: 'Chất liệu đã qua kiểm định, dễ sử dụng tại nhà.',
  },
  {
    id: 'feat-3',
    icon: 'bag',
    title: 'Nail box theo style',
    description: 'Đa dạng bộ sưu tập: Y2K, tiểu thư, công sở.',
  },
];

export const DEFAULT_FEATURED_PRODUCT_IDS = [
  'prod-cyber-slay',
  'prod-pink-punk',
  'prod-glitz-glam',
  'prod-aurora-dream',
  'prod-milk-tea-chiffon',
  'prod-care-kit',
];

export type HomepageConfig = {
  banners: BannerItem[];
  features: HomepageFeature[];
  featuredProductIds: string[];
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  banners: DEFAULT_BANNERS,
  features: DEFAULT_HOMEPAGE_FEATURES,
  featuredProductIds: DEFAULT_FEATURED_PRODUCT_IDS,
};
