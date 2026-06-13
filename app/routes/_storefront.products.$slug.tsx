import type { Route } from './+types/_storefront.products.$slug';
import { useMemo, useState } from 'react';
import { Badge, Button, Chip, Divider } from '@heroui/react';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiHeartLine, RiShoppingBag3Line, RiTruckLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { AutoSlideGallery, ProductCard } from '~/components';
import { CATEGORY_BY_CODE, PRODUCT_BY_SLUG, PRODUCTS } from '~/data';
import { useRequireAuth } from '~/hooks';
import { cartAtom } from '~/utils/atoms';
import { formatTitleCase, formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Chi tiết sản phẩm' };
export const meta = ({ params }: Route.MetaArgs) => [
  { title: `${params.slug ?? 'Sản phẩm'} - Nailslay` },
];

export default function ProductDetailPage({ params }: Route.ComponentProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const { requireAuth } = useRequireAuth();
  const [qty, setQty] = useState(1);

  const product = useMemo(() => PRODUCT_BY_SLUG.get(params.slug ?? ''), [params.slug]);

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

  const category = CATEGORY_BY_CODE.get(product.categoryCode);
  const related = PRODUCTS.filter(
    (p) => p.categoryCode === product.categoryCode && p.id !== product.id,
  ).slice(0, 4);
  const images = (product.imageUrls.length ? product.imageUrls : ['/branding/brand-board.png']).slice(0, 5);

  const addToCart = () => {
    requireAuth(() => {
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + qty } : item,
          ),
        );
      } else {
        setCart([
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.salePrice,
            quantity: qty,
            slug: product.slug,
            imageUrl: product.imageUrls[0],
          },
        ]);
      }
      toast.success(`Đã thêm ${qty} "${product.name}" vào giỏ hàng`);
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
        <div className="space-y-3">
          <AutoSlideGallery intervalMs={3500} className="rounded-2xl overflow-hidden border border-primary-200/70">
            {images.map((src, i) => (
              <div key={src + i} className="aspect-square bg-gradient-hero">
                <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </AutoSlideGallery>
        </div>

        <div className="space-y-5">
          <div className="flex items-center flex-wrap gap-2">
            <Chip size="sm" variant="flat" color="primary">{product.categoryCode}</Chip>
            <Badge color="secondary" variant="flat">Mã: {product.sku}</Badge>
            {product.isNew ? <Badge color="primary" variant="solid">Mới</Badge> : null}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
            {product.name}
          </h1>

          <div className="flex items-end gap-3">
            <span className="font-heading text-3xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
              {formatVND(product.salePrice)}
            </span>
            <span className="text-sm text-[#8E8A8A] line-through">
              {formatVND(product.originalPrice)}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#8E8A8A] dark:text-[#FFDDE5] whitespace-pre-line">
            {product.description}
          </p>

          <Divider />

          <div className="space-y-3 text-sm">
            <p className="text-[#1D1D1D] dark:text-[#FFF3F5]">
              <strong>Danh mục:</strong> {category ? formatTitleCase(category.name) : product.categoryCode}
            </p>
            <p className="text-[#1D1D1D] dark:text-[#FFF3F5]">
              <strong>Tồn kho:</strong> {product.stock}
            </p>
            <p className="text-[#1D1D1D] dark:text-[#FFF3F5]">
              <strong>Size:</strong>{' '}
              {product.attributes.size?.length ? product.attributes.size.join(', ') : 'Không có'}
            </p>
            <p className="text-[#1D1D1D] dark:text-[#FFF3F5]">
              <strong>Form móng:</strong>{' '}
              {product.attributes.form?.length ? product.attributes.form.join(', ') : 'Không có'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8E8A8A]">Số lượng:</span>
            <div className="flex items-center border border-primary-200 rounded-lg overflow-hidden">
              <button type="button" className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>
                −
              </button>
              <span className="px-4 py-2">{qty}</span>
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              color="primary"
              size="lg"
              onPress={addToCart}
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
            <span>Giao nhanh 2–3 ngày. Hỗ trợ đổi trả trong 7 ngày.</span>
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
                  sku: item.sku,
                  name: item.name,
                  slug: item.slug,
                  price: item.salePrice,
                  originalPrice: item.originalPrice,
                  imageUrls: item.imageUrls,
                  categoryName: item.categoryCode,
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
