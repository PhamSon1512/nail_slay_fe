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

export type HomepageThankYouStat = {
  id: string;
  value: string;
  label: string;
};

export type HomepageThankYou = {
  title: string;
  content: string;
  stats: HomepageThankYouStat[];
};

export const DEFAULT_HOMEPAGE_THANK_YOU: HomepageThankYou = {
  title: 'Cảm ơn bạn đã tin chọn Nail Slay!',
  content:
    'Hàng ngàn khách hàng đã trải nghiệm và hài lòng với Nail Slay. Chúng tôi tự hào mang đến những thiết kế nail box thủ công tinh xảo, chuẩn form, bền đẹp như ngoài tiệm. Tự tin tỏa sáng mọi lúc mọi nơi!',
  stats: [
    { id: 'stat-1', value: '10k+', label: 'Khách hàng' },
    { id: 'stat-2', value: '500+', label: 'Mẫu thiết kế' },
    { id: 'stat-3', value: '100%', label: 'Làm thủ công' },
    { id: 'stat-4', value: '5★', label: 'Đánh giá tốt' },
  ],
};

export type HomepageConfig = {
  banners: BannerItem[];
  features: HomepageFeature[];
  featuredProductIds: string[];
  thankYou: HomepageThankYou;
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  banners: DEFAULT_BANNERS,
  features: DEFAULT_HOMEPAGE_FEATURES,
  featuredProductIds: DEFAULT_FEATURED_PRODUCT_IDS,
  thankYou: DEFAULT_HOMEPAGE_THANK_YOU,
};
