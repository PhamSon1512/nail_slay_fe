import type { Route } from './+types/_storefront.products.$slug';
import { useEffect, useMemo, useState } from 'react';
import { Badge, Button } from '@heroui/react';
import { useAtom, useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiShoppingBag3Line, RiTruckLine } from 'react-icons/ri';
import { Link, useParams } from 'react-router';
import { ProductCard, ProductImageGallery, RichContent } from '~/components';
import { useRequireAuth, useServerCart } from '~/hooks';
import { authUserAtom, cartAtom } from '~/utils/atoms';
import { fetchStoreProduct, fetchStoreProducts, type StoreProduct } from '~/utils/api/catalog';
import { formatPriceDisplay } from '~/utils/format';

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

export default function ProductDetailPage() {
  const { slug: slugParam } = useParams();
  const slug = slugParam ?? '';
  const authUser = useAtomValue(authUserAtom);
  const [localCart, setLocalCart] = useAtom(cartAtom);
  const { requireAuth } = useRequireAuth();
  const { add } = useServerCart();
  const [product, setProduct] = useState<(StoreProduct & { variants?: ProductVariant[] }) | null>(null);
  const [related, setRelated] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const variants = product?.variants ?? [];
  const hasVariants = variants.length > 0;
  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  );
  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displayStock = selectedVariant?.stock ?? (hasVariants ? 0 : product?.stock ?? 0);
  const maxQty = hasVariants && !selectedVariantId ? 1 : Math.max(displayStock, 1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setSelectedVariantId(null);
    setQty(1);
    fetchStoreProduct(slug)
      .then((data) => {
        setProduct(data as StoreProduct & { variants?: ProductVariant[] });
        return fetchStoreProducts({ limit: 20 });
      })
      .then((list) => {
        setRelated(list.filter((p) => p.slug !== slug).slice(0, 4));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

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

  const addToCart = () => {
    if (hasVariants && !selectedVariantId) {
      toast.error('Bạn chưa chọn biến thể. Vui lòng chọn phân loại trước khi thêm vào giỏ hàng.');
      return;
    }
    if (displayStock <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    if (authUser) {
      requireAuth(async () => {
        try {
          await add(product.id, qty, selectedVariantId ?? undefined);
        } catch {
          // interceptor
        }
      });
      return;
    }

    const existing = localCart.find((item) =>
      selectedVariantId ? item.id === product.id && item.variantId === selectedVariantId : item.id === product.id,
    );
    if (existing) {
      setLocalCart(
        localCart.map((item) =>
          (selectedVariantId ? item.variantId === selectedVariantId && item.id === product.id : item.id === product.id)
            ? { ...item, quantity: Math.min(displayStock, item.quantity + qty) }
            : item,
        ),
      );
    } else {
      setLocalCart([
        ...localCart,
        {
          id: product.id,
          variantId: selectedVariantId ?? undefined,
          name: selectedVariant ? `${product.name} — ${selectedVariant.name}` : product.name,
          price: displayPrice,
          quantity: Math.min(displayStock, qty),
          slug: product.slug,
          imageUrl: images[0],
          stock: displayStock,
        },
      ]);
    }
    toast.success('Đã thêm vào giỏ hàng');
  };

  return (
    <div className="container py-8 space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-[#8E8A8A] hover:text-[#1D1D1D] dark:hover:text-[#FFF3F5] transition-colors"
      >
        <RiArrowLeftLine size={16} />
        Quay lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductImageGallery images={images} alt={product.name} />

        <div className="space-y-5">
          <div className="rounded-2xl border border-primary-200/70 bg-white/95 dark:bg-[#2a2226] p-5 shadow-sm space-y-3">
            <div className="flex items-center flex-wrap gap-2">
              {product.sku ? (
                <Badge color="secondary" variant="flat">
                  Mã: {product.sku}
                </Badge>
              ) : null}
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
              {product.name}
            </h1>

            <div className="flex items-end gap-3">
              <span className="font-sans text-3xl font-bold tabular-nums text-[#1D1D1D] dark:text-[#FFF3F5]">
                {formatPriceDisplay(displayPrice)}
              </span>
              {product.originalPrice && product.originalPrice > displayPrice ? (
                <span className="font-sans text-sm text-[#8E8A8A] line-through tabular-nums">
                  {formatPriceDisplay(product.originalPrice)}
                </span>
              ) : null}
            </div>
          </div>

          {product.description ? (
            <div className="rounded-2xl border border-primary-200/70 bg-white/95 dark:bg-[#2a2226] p-5 shadow-sm">
              <p className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] mb-3">Mô tả sản phẩm</p>
              <RichContent html={product.description} />
            </div>
          ) : null}

          {hasVariants ? (
            <div className="rounded-2xl border border-primary-200/70 bg-white/95 dark:bg-[#2a2226] p-5 shadow-sm space-y-2">
              <p className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Chọn biến thể</p>
              <p className="text-xs text-[#8E8A8A]">Bắt buộc chọn một biến thể trước khi thêm vào giỏ.</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    size="sm"
                    variant={selectedVariantId === v.id ? 'solid' : 'bordered'}
                    color={selectedVariantId === v.id ? 'primary' : 'default'}
                    className={selectedVariantId === v.id ? 'text-[#1D1D1D]' : ''}
                    onPress={() => {
                      setSelectedVariantId((prev) => (prev === v.id ? null : v.id));
                      setQty(1);
                    }}
                    isDisabled={v.stock <= 0}
                  >
                    {[v.name, v.color, v.size].filter(Boolean).join(' · ')} — {formatPriceDisplay(v.price)}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-primary-200/70 bg-white dark:bg-[#2a2226] p-6 shadow-md space-y-4">
            <p className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Mua hàng</p>

            <p className="text-sm text-[#1D1D1D] dark:text-[#FFF3F5]">
              <strong>Tồn kho:</strong>{' '}
              {hasVariants && !selectedVariantId ? (
                <span className="text-[#8E8A8A]">Chọn biến thể để xem tồn kho</span>
              ) : (
                displayStock
              )}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Số lượng</span>
              <div className="flex items-center border border-primary-200 rounded-lg overflow-hidden">
                <button type="button" className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>
                  −
                </button>
                <span className="px-4 py-2">{qty}</span>
                <button
                  type="button"
                  className="px-3 py-2 disabled:opacity-40"
                  disabled={hasVariants && !selectedVariantId}
                  onClick={() => setQty(Math.min(maxQty, qty + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <Button
              color="primary"
              size="lg"
              onPress={addToCart}
              isDisabled={!hasVariants ? displayStock <= 0 : Boolean(selectedVariantId) && displayStock <= 0}
              startContent={<RiShoppingBag3Line size={18} />}
              className="w-full font-semibold text-[#1D1D1D]"
            >
              Thêm vào giỏ
            </Button>

            <div className="flex items-center gap-2 text-xs text-[#8E8A8A]">
              <RiTruckLine size={14} />
              <span>Giao nhanh 2–3 ngày. Thanh toán chuyển khoản trước khi lên đơn.</span>
            </div>
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
    </div>
  );
}
