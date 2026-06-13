import type { Route } from './+types/_storefront.checkout';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiBankLine, RiCheckLine, RiMapPinLine, RiShieldCheckLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router';
import { useRequireAuth, useServerCart } from '~/hooks';
import { createAddress } from '~/utils/api/addresses';
import { checkoutOrder } from '~/utils/api/orders';
import { fetchPublicSettings } from '~/utils/api/settings';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Thanh toán' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Thanh toán - Nailslay' }];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { authUser, requireAuth } = useRequireAuth();
  const { items, subtotal, loading } = useServerCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankInfo, setBankInfo] = useState<Record<string, string>>({});
  const qrPreviewUrl = bankInfo.qr_code_url ?? '';
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    detail: '',
    city: '',
  });

  useEffect(() => {
    fetchPublicSettings()
      .then((data) => setBankInfo(data.bank_info ?? {}))
      .catch(() => setBankInfo({}));
  }, []);

  useEffect(() => {
    if (authUser) {
      setForm((prev) => ({
        ...prev,
        fullName: authUser.fullName ?? prev.fullName,
        phone: authUser.phone ?? prev.phone,
      }));
    }
  }, [authUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!form.fullName || !form.phone || !form.detail || !form.city) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }
    if (!items.length) {
      toast.error('Giỏ hàng trống');
      return;
    }

    setIsSubmitting(true);
    try {
      const addressDetail = `${form.detail}, ${form.city}. Người nhận: ${form.fullName} — ${form.phone}`;
      const address = await createAddress(addressDetail, true);
      const result = await checkoutOrder(address.id);
      navigate(`/checkout/success?orderId=${result.order.id}`, {
        state: { checkout: result },
      });
    } catch {
      // interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl">Vui lòng đăng nhập để thanh toán</h2>
        <Button as={Link} to="/login" color="primary" className="text-[#1D1D1D] font-semibold">
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="container py-20 text-center text-sm text-[#8E8A8A]">Đang tải...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl">Giỏ hàng trống</h2>
        <Button as={Link} to="/products" color="primary" className="text-[#1D1D1D] font-semibold">
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-heading text-3xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5] mb-8">
        Thanh toán đơn hàng
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
              <CardHeader className="flex items-center gap-2 pb-0">
                <RiMapPinLine size={18} />
                <h2 className="font-heading font-semibold">Địa chỉ giao hàng</h2>
              </CardHeader>
              <CardBody className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Họ và tên" isRequired value={form.fullName} onValueChange={(v) => setForm({ ...form, fullName: v })} variant="bordered" />
                  <Input label="Số điện thoại" isRequired value={form.phone} onValueChange={(v) => setForm({ ...form, phone: v })} variant="bordered" />
                </div>
                <Input label="Tỉnh / Thành phố" isRequired value={form.city} onValueChange={(v) => setForm({ ...form, city: v })} variant="bordered" />
                <Input label="Địa chỉ cụ thể" isRequired value={form.detail} onValueChange={(v) => setForm({ ...form, detail: v })} variant="bordered" />
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
              <CardHeader className="flex items-center gap-2 pb-0">
                <RiBankLine size={18} />
                <h2 className="font-heading font-semibold">Thanh toán chuyển khoản</h2>
              </CardHeader>
              <CardBody className="pt-4 space-y-4">
                <p className="text-sm text-[#8E8A8A]">
                  Chuyển khoản theo thông tin bên dưới, sau đó quét mã QR. Admin xác nhận thanh toán trước khi lên đơn.
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-[#8E8A8A]">Ngân hàng</span>
                  <span className="font-semibold">{bankInfo.bank_name ?? '—'}</span>
                  <span className="text-[#8E8A8A]">Số tài khoản</span>
                  <span className="font-mono font-bold">{bankInfo.account_number ?? '—'}</span>
                  <span className="text-[#8E8A8A]">Chủ thẻ</span>
                  <span className="font-semibold">{bankInfo.account_name ?? '—'}</span>
                </div>
                {qrPreviewUrl ? (
                  <div className="flex justify-center pt-2">
                    <img
                      src={qrPreviewUrl}
                      alt="QR thanh toán"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Chưa có mã QR. Admin cần cấu hình tại mục Thanh toán QR.
                  </p>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] sticky top-24">
              <CardHeader className="pb-0">
                <h2 className="font-heading font-semibold">Tóm tắt đơn hàng</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-[#8E8A8A]">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatVND(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Divider />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-lg">{formatVND(subtotal)}</span>
                </div>
                <p className="text-xs text-amber-800 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg px-3 py-2 leading-relaxed">
                  Hãy chuyển khoản thành công theo thông tin ngân hàng bên trái, rồi mới ấn <strong>Đặt hàng</strong> để gửi đơn.
                </p>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  startContent={!isSubmitting && <RiCheckLine size={18} />}
                  className="font-semibold text-[#1D1D1D]"
                >
                  Đặt hàng
                </Button>
                <div className="flex items-center gap-1.5 text-[11px] text-[#8E8A8A] justify-center">
                  <RiShieldCheckLine size={12} className="text-emerald-500" />
                  Chỉ hỗ trợ chuyển khoản ngân hàng
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
