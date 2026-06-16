import type { Route } from './+types/_storefront.products.$slug';
import { useEffect, useMemo, useState } from 'react';
import { Badge, Button } from '@heroui/react';
import { useAtom, useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiShoppingBag3Line, RiTruckLine } from 'react-icons/ri';
import { Link, useParams } from 'react-router';
import { ProductCard, ProductDiscountBadge, ProductImageGallery, ProductPriceDisplay, RichContent } from '~/components';
import { useRequireAuth, useServerCart } from '~/hooks';
import { authUserAtom, cartAtom } from '~/utils/atoms';
import { fetchStoreProduct, fetchStoreProducts, type StoreProduct } from '~/utils/api/catalog';
import { calcDiscountPercent, formatPriceDisplay } from '~/utils/format';

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

const sectionCardClass =
  'relative rounded-3xl border border-primary-200/50 bg-gradient-to-br from-white via-[#FFFBFC] to-primary-50/40 dark:from-[#2a2226] dark:via-[#2f2529] dark:to-[#2a2226] p-6 shadow-[0_20px_50px_-15px_rgba(195,109,128,0.28)] hover-3d transition-all duration-300 overflow-hidden';

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
  const originalPrice = product?.originalPrice ?? 0;
  const hasDiscount = originalPrice > displayPrice;
  const discountPercent = hasDiscount ? calcDiscountPercent(originalPrice, displayPrice) : 0;

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
    <div className="container py-8 space-y-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-[#8E8A8A] hover:text-[#1D1D1D] dark:hover:text-[#FFF3F5] transition-colors"
      >
        <RiArrowLeftLine size={16} />
        Quay lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductImageGallery images={images} alt={product.name} />

        <div className="space-y-6">
          <div className={sectionCardClass}>
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary-200/30 blur-3xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center flex-wrap gap-2">
                {product.sku ? (
                  <Badge color="secondary" variant="flat" className="font-mono text-[11px]">
                    Mã: {product.sku}
                  </Badge>
                ) : null}
                {hasDiscount ? <ProductDiscountBadge percent={discountPercent} /> : null}
              </div>

              <h1 className="font-heading text-2xl md:text-[1.75rem] font-bold leading-snug text-[#1D1D1D] dark:text-[#FFF3F5]">
                {product.name}
              </h1>

              <ProductPriceDisplay
                price={displayPrice}
                originalPrice={originalPrice}
                hasDiscount={hasDiscount}
              />
            </div>
          </div>

          {product.description ? (
            <div className={sectionCardClass}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
                <p className="text-sm font-bold uppercase tracking-wide text-[#1D1D1D] dark:text-[#FFF3F5]">
                  Mô tả sản phẩm
                </p>
              </div>
              <RichContent html={product.description} />
            </div>
          ) : null}

          {hasVariants ? (
            <div className={sectionCardClass}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
                <p className="text-sm font-bold uppercase tracking-wide text-[#1D1D1D] dark:text-[#FFF3F5]">
                  Chọn biến thể
                </p>
              </div>
              <p className="text-xs text-[#8E8A8A] mb-3">Bắt buộc chọn một biến thể trước khi thêm vào giỏ.</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    size="sm"
                    variant={selectedVariantId === v.id ? 'solid' : 'bordered'}
                    color={selectedVariantId === v.id ? 'primary' : 'default'}
                    className={
                      selectedVariantId === v.id
                        ? 'text-[#1D1D1D] shadow-md shadow-primary-200/50'
                        : 'bg-white/80 dark:bg-[#32282c]'
                    }
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

          <div
            className={`${sectionCardClass} shadow-[0_28px_60px_-12px_rgba(195,109,128,0.4)] border-primary-300/60`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-[#D64545]" />
            <div className="relative space-y-5 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
                <p className="text-sm font-bold uppercase tracking-wide text-[#1D1D1D] dark:text-[#FFF3F5]">
                  Mua hàng
                </p>
              </div>

              <p className="text-sm text-[#1D1D1D] dark:text-[#FFF3F5]">
                <strong>Tồn kho:</strong>{' '}
                {hasVariants && !selectedVariantId ? (
                  <span className="text-[#8E8A8A]">Chọn biến thể để xem tồn kho</span>
                ) : (
                  <span className="font-semibold text-primary-700 dark:text-primary-300">{displayStock}</span>
                )}
              </p>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Số lượng</span>
                <div className="flex items-center border-2 border-primary-200 rounded-xl overflow-hidden bg-white dark:bg-[#32282c] shadow-sm">
                  <button
                    type="button"
                    className="px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-[#3a2a30] transition-colors"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 font-semibold tabular-nums min-w-[3rem] text-center">{qty}</span>
                  <button
                    type="button"
                    className="px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-[#3a2a30] transition-colors disabled:opacity-40"
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
                startContent={<RiShoppingBag3Line size={20} />}
                className="w-full font-bold text-[#1D1D1D] text-base h-14 shadow-xl shadow-primary-300/50 hover:shadow-2xl hover:shadow-primary-400/40 transition-shadow"
              >
                Thêm vào giỏ
              </Button>

              <div className="flex items-center gap-2 text-xs text-[#8E8A8A] pt-1">
                <RiTruckLine size={14} className="shrink-0 text-primary-500" />
                <span>Giao nhanh 2–3 ngày. Thanh toán chuyển khoản trước khi lên đơn.</span>
              </div>
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
