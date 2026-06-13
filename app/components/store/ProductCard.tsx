import { Link } from 'react-router';
import { Badge, Button, Card, CardBody, CardFooter } from '@heroui/react';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { useRequireAuth } from '~/hooks';
import { cartAtom } from '~/utils/atoms';
import { formatVND } from '~/utils/format';

export type Product = {
  id: string;
  sku?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrls: string[];
  categoryName?: string;
  stock?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const { requireAuth } = useRequireAuth();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );
      } else {
        setCart([
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            slug: product.slug,
            imageUrl: product.imageUrls?.[0],
          },
        ]);
      }
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    });
  };

  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  const thumb = product.imageUrls?.[0];
  const hasDiscount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price;

  return (
    <Card
      as={Link}
      to={`/products/${product.slug}`}
      isPressable
      shadow="sm"
      className="group border border-primary-100/60 bg-white/80 dark:bg-[#2a2226] dark:border-[#6a5a61] hover:border-primary-300 transition-all duration-300 hover:shadow-lg hover:shadow-primary-100/40 hover-3d"
    >
      <CardBody className="p-0 overflow-hidden">
        <div className="relative aspect-square bg-gradient-hero overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">N</span>
            </div>
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew ? (
              <Badge color="primary" variant="solid" size="sm" className="text-[10px] font-semibold">
                Mới
              </Badge>
            ) : null}
            {hasDiscount ? (
              <Badge color="secondary" variant="solid" size="sm" className="text-[10px] font-semibold">
                Sale
              </Badge>
            ) : null}
            {isOutOfStock ? (
              <Badge color="default" variant="flat" size="sm" className="text-[10px] font-semibold">
                Hết hàng
              </Badge>
            ) : null}
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex flex-col items-start gap-2 p-3">
        <div className="flex items-center justify-between w-full gap-2">
          {product.categoryName ? (
            <span className="text-[11px] text-primary-600 font-semibold tracking-wider">
              {product.categoryName}
            </span>
          ) : (
            <span />
          )}
          {product.sku ? (
            <span className="text-[10px] text-[#8E8A8A] font-mono">{product.sku}</span>
          ) : null}
        </div>

        <p className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] line-clamp-2 leading-snug min-h-[40px]">
          {product.name}
        </p>

        <div className="w-full flex items-end justify-between gap-2 mt-1">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
              {formatVND(product.price)}
            </span>
            {hasDiscount ? (
              <span className="text-[11px] text-[#8E8A8A] line-through">
                {formatVND(product.originalPrice!)}
              </span>
            ) : null}
          </div>

          <Button
            size="sm"
            color="primary"
            variant="flat"
            aria-label="Thêm vào giỏ"
            onPress={addToCart as any}
            isDisabled={isOutOfStock}
            startContent={<RiShoppingBag3Line size={14} />}
            className="shrink-0 text-[#1D1D1D] font-semibold text-xs px-2"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
