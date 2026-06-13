import type { Route } from './+types/_storefront.cart';
import { Link } from 'react-router';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { useAtom, useAtomValue } from 'jotai';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import { useServerCart } from '~/hooks';
import { authUserAtom, cartAtom, cartSubtotalAtom, cartVatAtom } from '~/utils/atoms';
import { calcVat, formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Giỏ hàng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Giỏ hàng - Nailslay' }];

export default function CartPage() {
  const authUser = useAtomValue(authUserAtom);
  const [localCart, setLocalCart] = useAtom(cartAtom);
  const localSubtotal = useAtomValue(cartSubtotalAtom);
  const localVat = useAtomValue(cartVatAtom);
  const { items, subtotal, loading, updateQty, remove } = useServerCart();

  const usingServer = !!authUser;
  const isEmpty = usingServer ? items.length === 0 : localCart.length === 0;
  const displaySubtotal = usingServer ? subtotal : localSubtotal;
  const displayVat = usingServer ? calcVat(subtotal) : localVat;
  const displayTotal = displaySubtotal + displayVat;

  const updateLocalQty = (productId: string, nextQty: number) => {
    if (nextQty <= 0) {
      setLocalCart(localCart.filter((item) => item.id !== productId));
      return;
    }
    setLocalCart(
      localCart.map((item) =>
        item.id === productId ? { ...item, quantity: nextQty } : item,
      ),
    );
  };

  if (loading && usingServer) {
    return <div className="container py-20 text-center text-sm text-[#8E8A8A]">Đang tải giỏ hàng...</div>;
  }

  if (isEmpty) {
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
    <div className="container py-10 space-y-6">
      <h1 className="section-title">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card shadow="none" className="lg:col-span-2 border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
          <CardBody className="space-y-4">
            {usingServer
              ? items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 flex-wrap border-b border-primary-100/80 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.product.imageUrls?.[0] ? (
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover border border-primary-200 shrink-0"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] hover:underline line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-[#8E8A8A] mt-0.5">{formatVND(item.product.price)} / sản phẩm</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-primary-200 rounded-full overflow-hidden bg-white dark:bg-[#2a2226]">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary-50"
                          onClick={() => void updateQty(item.id, item.quantity - 1)}
                          aria-label="Giảm số lượng"
                        >
                          <RiSubtractLine size={14} />
                        </button>
                        <span className="min-w-[32px] text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary-50"
                          onClick={() => void updateQty(item.id, Math.min(item.product.stock, item.quantity + 1))}
                          aria-label="Tăng số lượng"
                        >
                          <RiAddLine size={14} />
                        </button>
                      </div>
                      <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] min-w-[90px] text-right">
                        {formatVND(item.product.price * item.quantity)}
                      </span>
                      <Button size="sm" variant="light" color="danger" onPress={() => void remove(item.id)}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))
              : localCart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 flex-wrap border-b border-primary-100/80 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-primary-200 shrink-0"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.slug}`}
                          className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] hover:underline line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#8E8A8A] mt-0.5">{formatVND(item.price)} / sản phẩm</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-primary-200 rounded-full overflow-hidden bg-white dark:bg-[#2a2226]">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary-50"
                          onClick={() => updateLocalQty(item.id, item.quantity - 1)}
                          aria-label="Giảm số lượng"
                        >
                          <RiSubtractLine size={14} />
                        </button>
                        <span className="min-w-[32px] text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary-50"
                          onClick={() => updateLocalQty(item.id, item.quantity + 1)}
                          aria-label="Tăng số lượng"
                        >
                          <RiAddLine size={14} />
                        </button>
                      </div>
                      <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] min-w-[90px] text-right">
                        {formatVND(item.price * item.quantity)}
                      </span>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => setLocalCart(localCart.filter((c) => c.id !== item.id))}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] sticky top-24">
          <CardBody className="space-y-4">
            <h2 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-sm">
              <span className="text-[#8E8A8A]">Tạm tính</span>
              <span>{formatVND(displaySubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8E8A8A]">Thuế VAT (10%)</span>
              <span>{formatVND(displayVat)}</span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8E8A8A]">Tổng cộng</span>
              <span className="text-2xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
                {formatVND(displayTotal)}
              </span>
            </div>
            {usingServer ? (
              <>
                <p className="text-xs text-[#8E8A8A] bg-[#FFDDE5]/40 dark:bg-[#2a2226] border border-primary-200/60 rounded-lg px-3 py-2 leading-relaxed">
                  Yên tâm — bạn chưa cần chuyển khoản ở bước này. Trang tiếp theo sẽ hiển thị thông tin thanh toán chi tiết.
                </p>
                <Button as={Link} to="/checkout" color="primary" size="lg" className="text-[#1D1D1D] font-semibold w-full">
                  Tiến hành thanh toán
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" color="primary" size="lg" className="text-[#1D1D1D] font-semibold w-full">
                Đăng nhập để thanh toán
              </Button>
            )}
            <Button as={Link} to="/products" variant="flat" size="sm" className="w-full">
              Tiếp tục mua sắm
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
