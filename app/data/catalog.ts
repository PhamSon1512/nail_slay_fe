export type CatalogCategory = {
  id: string;
  code: string;
  name: string;
  slug: string;
  level: 'parent' | 'child';
  parentCode?: string;
  imageUrl?: string;
};

export type CatalogProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  salePrice: number;
  originalPrice: number;
  description: string;
  categoryCode: string;
  imageUrls: string[];
  attributes: {
    size?: string[];
    form?: string[];
  };
  isFeatured?: boolean;
  isNew?: boolean;
  stock: number;
};

export const CATEGORIES: CatalogCategory[] = [
  {
    id: 'cat-parent-nb01',
    code: 'NB-01',
    name: 'Nail box thiết kế',
    slug: 'nail-box-thiet-ke',
    level: 'parent',
    imageUrl: '/branding/brand-board.png',
  },
  {
    id: 'cat-child-nby2k',
    code: 'NB-Y2K',
    name: 'Style cá tính & Y2K',
    slug: 'style-ca-tinh-y2k',
    level: 'child',
    parentCode: 'NB-01',
    imageUrl: '/branding/banner-web.png',
  },
  {
    id: 'cat-child-nbtt',
    code: 'NB-TT',
    name: 'Style tiểu thư & đính đá',
    slug: 'style-tieu-thu-dinh-da',
    level: 'child',
    parentCode: 'NB-01',
    imageUrl: '/branding/brand-board.png',
  },
  {
    id: 'cat-child-nbcs',
    code: 'NB-CS',
    name: 'Style nhẹ nhàng & công sở',
    slug: 'style-nhe-nhang-cong-so',
    level: 'child',
    parentCode: 'NB-01',
    imageUrl: '/branding/banner-web.png',
  },
  {
    id: 'cat-parent-pk02',
    code: 'PK-02',
    name: 'Phụ kiện móng',
    slug: 'phu-kien-mong',
    level: 'parent',
    imageUrl: '/branding/brand-board.png',
  },
];

const DEFAULT_IMAGES = ['/branding/banner-web.png', '/branding/brand-board.png'];

export const PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod-cyber-slay',
    sku: 'NS-Y2K-001',
    name: 'Nail Box Nailslay - Cyber Slay',
    slug: 'nail-box-cyber-slay',
    salePrice: 149000,
    originalPrice: 199000,
    description:
      'Mang dam phong cach Y2K va vi lai (Futuristic). Ket hop son thach den, line bac metallic va dinh xich ca tinh. Phu hop cho tiec tung, di club hoac chup anh concept.',
    categoryCode: 'NB-Y2K',
    imageUrls: DEFAULT_IMAGES,
    attributes: {
      size: ['XS', 'S', 'M', 'L'],
      form: ['Nhon', 'Thang'],
    },
    isFeatured: true,
    isNew: true,
    stock: 48,
  },
  {
    id: 'prod-pink-punk',
    sku: 'NS-Y2K-002',
    name: 'Nail Box Nailslay - Pink Punk',
    slug: 'nail-box-pink-punk',
    salePrice: 135000,
    originalPrice: 180000,
    description:
      'Su noi loan ngot ngao voi su pha tron mau hong neon va den metallic. Hoa tiet ve lua ket hop dinh khuyen mong trend. Danh cho co nang muon chiem spotlight.',
    categoryCode: 'NB-Y2K',
    imageUrls: DEFAULT_IMAGES,
    attributes: {
      size: ['XS', 'S', 'M', 'L'],
      form: ['Thang', 'Tron vuong'],
    },
    isFeatured: true,
    stock: 40,
  },
  {
    id: 'prod-glitz-glam',
    sku: 'NS-TT-001',
    name: 'Nail Box Nailslay - Glitz & Glam',
    slug: 'nail-box-glitz-and-glam',
    salePrice: 199000,
    originalPrice: 250000,
    description:
      'Tuyet tac danh cho nang dau hoac di tiec. Nen son thach hong ombre trang, dinh da khoi swarovski lap lanh va no ngoc trai cao cap.',
    categoryCode: 'NB-TT',
    imageUrls: DEFAULT_IMAGES,
    attributes: {
      size: ['XS', 'S', 'M', 'L'],
      form: ['Nhon dai', 'Thang'],
    },
    isFeatured: true,
    stock: 30,
  },
  {
    id: 'prod-aurora-dream',
    sku: 'NS-TT-002',
    name: 'Nail Box Nailslay - Aurora Dream',
    slug: 'nail-box-aurora-dream',
    salePrice: 169000,
    originalPrice: 210000,
    description:
      'Hieu ung xa cu cau vong (Aurora) doi mau theo goc nhin. Diem xuyet ngoc trai nho va an xa cu tu nhien duoi lop gel thuy tinh trong suot.',
    categoryCode: 'NB-TT',
    imageUrls: DEFAULT_IMAGES,
    attributes: {
      size: ['XS', 'S', 'M', 'L'],
      form: ['Tron nhon', 'Oval'],
    },
    stock: 28,
  },
  {
    id: 'prod-milk-tea-chiffon',
    sku: 'NS-CS-001',
    name: 'Nail Box Nailslay - Milk Tea Chiffon',
    slug: 'nail-box-milk-tea-chiffon',
    salePrice: 129000,
    originalPrice: 160000,
    description:
      'Tong mau tra sua nude nhe nhang, ton da. Hoa tiet blush nails hot tai Han Quoc ket hop vien nhu vang thanh lich. Thich hop di hoc, di lam hang ngay.',
    categoryCode: 'NB-CS',
    imageUrls: DEFAULT_IMAGES,
    attributes: {
      size: ['XS', 'S', 'M', 'L'],
      form: ['Tron vuong', 'Oval'],
    },
    stock: 55,
  },
  {
    id: 'prod-care-kit',
    sku: 'NS-PK-001',
    name: 'Combo Dung Cu Dan Mong Hoan Hao (Nailslay Care Kit)',
    slug: 'nailslay-care-kit',
    salePrice: 29000,
    originalPrice: 50000,
    description:
      'Bo phu kien giup ban de dang tu dan va thao mong tai nha. Bao gom: keo nuoc sieu dinh, keo silicon tam thoi, dua mini, que day da chet va bong tam con.',
    categoryCode: 'PK-02',
    imageUrls: DEFAULT_IMAGES,
    attributes: {},
    isNew: true,
    stock: 200,
  },
];

export const CATEGORY_BY_CODE = new Map(CATEGORIES.map((c) => [c.code, c]));
export const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));

export function getProductsByCategoryCode(code: string) {
  return PRODUCTS.filter((p) => p.categoryCode === code);
}

