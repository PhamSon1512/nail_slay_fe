import type { Route } from './+types/_storefront.products.$slug';
import { useEffect, useState } from 'react';
import { Badge, Button, Chip, Divider } from '@heroui/react';
import { RiArrowLeftLine, RiHeartLine, RiShoppingBag3Line, RiTruckLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { AutoSlideGallery, ProductCard } from '~/components';
import { useRequireAuth, useServerCart } from '~/hooks';
import { fetchStoreProduct, fetchStoreProducts, type StoreProduct } from '~/utils/api/catalog';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Chi tiết sản phẩm' };
export const meta = ({ params }: Route.MetaArgs) => [
  { title: `${params.slug ?? 'Sản phẩm'} - Nailslay` },
];

type ProductVariant = {
  id: string;
  name: string;
  color?: string | null;
  size?: string | null;
  price: number;
  stock: number;
};

export default function ProductDetailPage({ params }: Route.ComponentProps) {
  const { requireAuth } = useRequireAuth();
  const { add } = useServerCart();
  const [product, setProduct] = useState<(StoreProduct & { variants?: ProductVariant[] }) | null>(null);
  const [related, setRelated] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true);
    fetchStoreProduct(params.slug)
      .then((data) => {
        setProduct(data as StoreProduct & { variants?: ProductVariant[] });
        return fetchStoreProducts({ limit: 20 });
      })
      .then((list) => {
        setRelated(list.filter((p) => p.slug !== params.slug).slice(0, 4));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return <div className="container py-20 text-center text-sm text-[#8E8A8A]">Đang tải...</div>;
  }

  if (!product) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="section-title">Không tìm thấy sản phẩm</h1>
        <Button as={Link} to="/products" color="primary" className="text-[#1D1D1D] font-semibold">
          Quay về danh sách
        </Button>
      </div>
    );
  }

  const images = (product.imageUrls?.length ? product.imageUrls : ['/branding/brand-board.png']).slice(0, 5);
  const variants = product.variants ?? [];

  const addToCart = () => {
    requireAuth(async () => {
      try {
        await add(product.id, qty);
      } catch {
        // interceptor
      }
    });
  };

  return (
    <div className="container py-8 space-y-8">
      <nav className="flex items-center gap-2 text-xs text-[#8E8A8A]">
        <Link to="/" className="hover:text-[#1D1D1D]">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#1D1D1D]">Sản phẩm</Link>
        <span>/</span>
        <span className="text-[#1D1D1D] dark:text-[#FFF3F5]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <AutoSlideGallery intervalMs={3500} className="rounded-2xl overflow-hidden border border-primary-200/70">
          {images.map((src, i) => (
            <div key={src + i} className="aspect-square bg-gradient-hero">
              <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </AutoSlideGallery>

        <div className="space-y-5">
          <div className="flex items-center flex-wrap gap-2">
            {product.sku ? <Badge color="secondary" variant="flat">Mã: {product.sku}</Badge> : null}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
            {product.name}
          </h1>

          <div className="flex items-end gap-3">
            <span className="font-heading text-3xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price ? (
              <span className="text-sm text-[#8E8A8A] line-through">{formatVND(product.originalPrice)}</span>
            ) : null}
          </div>

          {product.description ? (
            <p className="text-sm leading-relaxed text-[#8E8A8A] dark:text-[#FFDDE5] whitespace-pre-line">
              {product.description}
            </p>
          ) : null}

          <Divider />

          <p className="text-sm text-[#1D1D1D] dark:text-[#FFF3F5]">
            <strong>Tồn kho:</strong> {product.stock}
          </p>

          {variants.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Biến thể</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Chip key={v.id} size="sm" variant="flat">
                    {[v.name, v.color, v.size].filter(Boolean).join(' · ')} — {formatVND(v.price)} (SL: {v.stock})
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8E8A8A]">Số lượng:</span>
            <div className="flex items-center border border-primary-200 rounded-lg overflow-hidden">
              <button type="button" className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="px-4 py-2">{qty}</span>
              <button type="button" className="px-3 py-2" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              color="primary"
              size="lg"
              onPress={addToCart}
              isDisabled={product.stock <= 0}
              startContent={<RiShoppingBag3Line size={18} />}
              className="font-semibold text-[#1D1D1D]"
            >
              Thêm vào giỏ
            </Button>
            <Button isIconOnly variant="bordered" aria-label="Yêu thích">
              <RiHeartLine size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8E8A8A]">
            <RiTruckLine size={14} />
            <span>Giao nhanh 2–3 ngày. Thanh toán chuyển khoản trước khi lên đơn.</span>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="space-y-4">
          <h2 className="section-title">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  sku: item.sku ?? '',
                  name: item.name,
                  slug: item.slug,
                  price: item.price,
                  originalPrice: item.originalPrice ?? item.price,
                  imageUrls: item.imageUrls ?? [],
                  categoryName: '',
                  stock: item.stock,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-[#8E8A8A] hover:text-[#1D1D1D]">
        <RiArrowLeftLine size={14} />
        Quay lại danh sách sản phẩm
      </Link>
    </div>
  );
}
