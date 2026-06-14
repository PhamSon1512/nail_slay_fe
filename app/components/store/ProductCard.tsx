import { Link } from 'react-router';
import { Button, Card, CardBody, CardFooter } from '@heroui/react';
import { useAtom, useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { RiAddLine, RiShoppingBag3Line, RiSubtractLine } from 'react-icons/ri';
import { useServerCart } from '~/hooks';
import { authUserAtom, cartAtom } from '~/utils/atoms';
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
  const authUser = useAtomValue(authUserAtom);
  const [localCart, setLocalCart] = useAtom(cartAtom);
  const { items, add, changeProductQty } = useServerCart();

  const serverItem = items.find((item) => item.product.id === product.id);
  const localItem = localCart.find((item) => item.id === product.id);
  const quantity = authUser ? (serverItem?.quantity ?? 0) : (localItem?.quantity ?? 0);

  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  const thumb = product.imageUrls?.[0];
  const hasDiscount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price;

  const addToLocalCart = () => {
    if (localItem) {
      const maxStock = product.stock ?? Number.POSITIVE_INFINITY;
      setLocalCart(
        localCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(maxStock, item.quantity + 1), stock: product.stock }
            : item,
        ),
      );
    } else {
      setLocalCart([
        ...localCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          slug: product.slug,
          imageUrl: thumb,
          stock: product.stock,
        },
      ]);
    }
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const updateLocalQty = (nextQty: number) => {
    if (nextQty <= 0) {
      setLocalCart(localCart.filter((item) => item.id !== product.id));
      toast.success('Đã xóa khỏi giỏ hàng');
      return;
    }
    setLocalCart(
      localCart.map((item) =>
        item.id === product.id ? { ...item, quantity: nextQty, stock: product.stock } : item,
      ),
    );
  };

  const handleAdd = async () => {
    if (isOutOfStock) return;
    if (authUser) {
      try {
        await add(product.id, 1);
      } catch {
        // interceptor
      }
      return;
    }
    addToLocalCart();
  };

  const handleIncrease = async () => {
    if (isOutOfStock) return;
    if (authUser) {
      try {
        const maxStock = serverItem?.product.stock ?? product.stock;
        if (maxStock !== undefined && serverItem && serverItem.quantity >= maxStock) return;
        if (serverItem) {
          await changeProductQty(product.id, 1);
        } else {
          await handleAdd();
        }
      } catch {
        // interceptor
      }
      return;
    }
    updateLocalQty(quantity + 1);
  };

  const handleDecrease = async () => {
    if (authUser) {
      if (serverItem || quantity > 0) {
        try {
          await changeProductQty(product.id, -1);
        } catch {
          // interceptor
        }
        return;
      }
    }
    updateLocalQty(quantity - 1);
  };

  const stopCardNav = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card
      shadow="sm"
      className="group border border-primary-100/60 bg-white/80 dark:bg-[#2a2226] dark:border-[#6a5a61] hover:border-primary-300 transition-all duration-300 hover:shadow-lg hover:shadow-primary-100/40 hover-3d h-full"
    >
      <CardBody className="p-0 overflow-hidden">
        <Link
          to={`/products/${product.slug}`}
          className="block relative aspect-square bg-gradient-hero overflow-hidden"
        >
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

        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {product.isNew ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#C36D80] text-white shadow-md">
                Mới
              </span>
            ) : null}
            {hasDiscount ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#D64545] text-white shadow-md">
                Sale
              </span>
            ) : null}
            {isOutOfStock ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#5C5C5C] text-white shadow-md">
                Hết hàng
              </span>
            ) : null}
          </div>
        </Link>
      </CardBody>

      <CardFooter className="flex flex-col items-start gap-2 p-3">
        <div className="flex items-center justify-between w-full gap-2 min-h-[18px]">
          {product.categoryName ? (
            <span className="text-[11px] text-primary-600 font-semibold tracking-wider truncate">
              {product.categoryName}
            </span>
          ) : (
            <span />
          )}
        </div>

        {product.sku ? (
          <p className="text-[11px] font-mono font-semibold text-[#B2706E] bg-primary-50 dark:bg-primary-950/30 px-2 py-0.5 rounded w-fit">
            SKU: {product.sku}
          </p>
        ) : null}

        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] line-clamp-2 leading-snug min-h-[40px] hover:underline"
        >
          {product.name}
        </Link>

        <div className="w-full flex items-end justify-between gap-2 mt-1">
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
              {formatVND(product.price)}
            </span>
            {hasDiscount ? (
              <span className="text-[11px] text-[#8E8A8A] line-through">
                {formatVND(product.originalPrice!)}
              </span>
            ) : null}
          </div>

          {quantity > 0 ? (
            <div
              className="flex items-center shrink-0 border border-primary-200 rounded-full overflow-hidden bg-white/90 dark:bg-[#2a2226]"
              onClick={stopCardNav}
              onKeyDown={stopCardNav}
              role="group"
              aria-label={`Số lượng ${product.name} trong giỏ`}
            >
              <Button
                isIconOnly
                size="sm"
                variant="light"
                aria-label="Giảm số lượng"
                isDisabled={isOutOfStock}
                onPress={() => void handleDecrease()}
                className="min-w-8 w-8 h-8 rounded-none text-[#1D1D1D]"
              >
                <RiSubtractLine size={14} />
              </Button>
              <span className="min-w-[28px] text-center text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                {quantity}
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                aria-label="Tăng số lượng"
                isDisabled={isOutOfStock}
                onPress={() => void handleIncrease()}
                className="min-w-8 w-8 h-8 rounded-none text-[#1D1D1D]"
              >
                <RiAddLine size={14} />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              color="primary"
              variant="flat"
              aria-label="Thêm vào giỏ"
              onPress={() => void handleAdd()}
              isDisabled={isOutOfStock}
              startContent={<RiShoppingBag3Line size={14} />}
              className="shrink-0 text-[#1D1D1D] font-semibold text-xs px-2"
            >
              Thêm vào giỏ
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
