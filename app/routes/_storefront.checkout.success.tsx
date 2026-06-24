import type { Route } from './+types/_storefront.checkout.success';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { Link, useLocation, useSearchParams } from 'react-router';
import type { CheckoutResponse } from '~/utils/api/orders';
import { fetchUserOrder } from '~/utils/api/orders';
import { fetchPublicSettings } from '~/utils/api/settings';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Đặt hàng thành công' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Đặt hàng thành công - Nailslay' }];

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const orderId = searchParams.get('orderId') ?? '';
  const checkout = (location.state as { checkout?: CheckoutResponse } | null)?.checkout;
  const [fallbackBank, setFallbackBank] = useState<Record<string, string>>({});
  const [orderTotal, setOrderTotal] = useState<number | null>(checkout?.order.total_amount ?? null);

  useEffect(() => {
    if (orderId && !checkout) {
      fetchUserOrder(orderId)
        .then((order) => setOrderTotal(order.totalAmount))
        .catch(() => setOrderTotal(null));
    }
  }, [orderId, checkout]);

  useEffect(() => {
    if (checkout?.payment.qr_code_url) return;
    fetchPublicSettings()
      .then((data) => setFallbackBank(data.bank_info ?? {}))
      .catch(() => setFallbackBank({}));
  }, [checkout?.payment.qr_code_url]);

  useEffect(() => {
    document.body.classList.add('checkout-confetti-active');
    const timer = window.setTimeout(() => {
      document.body.classList.remove('checkout-confetti-active');
    }, 4000);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove('checkout-confetti-active');
    };
  }, []);

  const bankInfo = (checkout?.payment.bank_info ?? fallbackBank) as any;
  const qrUrl = checkout?.payment.qr_code_url || bankInfo.qr_code_url || '';
  const total = checkout?.order.total_amount ?? orderTotal ?? 0;
  const transferContent =
    bankInfo.transfer_content?.includes('{order_id}') && orderId
      ? bankInfo.transfer_content.replace('{order_id}', orderId)
      : bankInfo.transfer_content ?? orderId;

  if (!orderId) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="font-heading text-2xl">Không tìm thấy đơn hàng</h1>
        <Button as={Link} to="/products" color="primary" className="text-[#1D1D1D] font-semibold">
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-16 relative overflow-hidden">
      <div className="checkout-confetti" aria-hidden />

      <div className="max-w-xl mx-auto text-center space-y-6 relative z-10">
        <div className="text-5xl">🎉</div>
        <h1 className="font-heading text-3xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
          Đặt hàng thành công!
        </h1>
        <p className="text-sm text-[#8E8A8A]">
          Mã đơn: <strong className="font-mono text-[#1D1D1D] dark:text-[#FFF3F5]">{orderId.slice(0, 12)}</strong>
        </p>
        <p className="text-sm text-[#8E8A8A]">
          Vui lòng chuyển khoản <strong>{formatVND(total)}</strong> theo thông tin bên dưới. Admin sẽ xác nhận và lên đơn.
        </p>

        <Card shadow="none" className="border border-primary-200/70 bg-white/90 dark:bg-[#2a2226] text-left">
          <CardBody className="space-y-4">
            {bankInfo ? (
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-[#8E8A8A]">Ngân hàng</span>
                <span className="font-semibold">{bankInfo.bank_name}</span>
                <span className="text-[#8E8A8A]">Số TK</span>
                <span className="font-mono font-bold">{bankInfo.account_number}</span>
                <span className="text-[#8E8A8A]">Chủ TK</span>
                <span className="font-semibold">{bankInfo.account_name}</span>
                <span className="text-[#8E8A8A]">Nội dung CK</span>
                <span className="font-semibold break-all">{transferContent}</span>
              </div>
            ) : null}
            {qrUrl ? (
              <div className="flex justify-center pt-2">
                <img src={qrUrl} alt="QR thanh toán" className="w-56 h-56 sm:w-64 sm:h-64 object-contain" />
              </div>
            ) : null}
          </CardBody>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button as={Link} to={`/orders/${orderId}`} color="primary" className="text-[#1D1D1D] font-semibold">
            Xem đơn hàng
          </Button>
          <Button as={Link} to="/products" variant="flat">
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}
