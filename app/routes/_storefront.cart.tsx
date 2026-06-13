import type { Route } from './+types/_storefront.cart';
import { Link } from 'react-router';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { useAtom } from 'jotai';
import {
  cartAtom,
  cartGrandTotalAtom,
  cartSubtotalAtom,
  cartVatAtom,
} from '~/utils/atoms';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Giỏ hàng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Giỏ hàng - Nailslay' }];

export default function CartPage() {
  const [cart, setCart] = useAtom(cartAtom);
  const [subtotal] = useAtom(cartSubtotalAtom);
  const [vat] = useAtom(cartVatAtom);
  const [grandTotal] = useAtom(cartGrandTotalAtom);

  const updateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="section-title">Giỏ hàng trống</h1>
        <p className="text-sm text-[#8E8A8A]">Hãy thêm sản phẩm yêu thích để bắt đầu mua sắm.</p>
        <Button as={Link} to="/products" color="primary" className="text-[#1D1D1D] font-semibold">
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-5">
      <h1 className="section-title">Giỏ hàng của bạn</h1>

      <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
        <CardBody className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border border-primary-200"
                  />
                ) : null}
                <div className="min-w-0">
                  <Link
                    to={`/products/${item.slug}`}
                    className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] hover:underline line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-[#8E8A8A]">{formatVND(item.price)} / sản phẩm</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-primary-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="px-3 py-1.5 hover:bg-primary-50"
                    onClick={() => updateQty(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 hover:bg-primary-50"
                    onClick={() => updateQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] min-w-[100px] text-right">
                  {formatVND(item.price * item.quantity)}
                </p>
                <Button size="sm" variant="light" color="danger" onPress={() => removeItem(item.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}

          <Divider />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#8E8A8A]">Tạm tính</span>
              <span className="font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">{formatVND(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8E8A8A]">VAT (10%)</span>
              <span className="font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">{formatVND(vat)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Tổng thanh toán</span>
              <span className="text-lg font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
                {formatVND(grandTotal)}
              </span>
            </div>
          </div>

          <Button as={Link} to="/checkout" color="primary" className="text-[#1D1D1D] font-semibold w-full sm:w-auto">
            Tiến hành thanh toán
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
