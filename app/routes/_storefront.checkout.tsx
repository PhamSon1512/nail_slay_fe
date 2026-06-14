import type { Route } from './+types/_storefront.checkout';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiBankLine, RiCheckLine, RiMapPinLine, RiShieldCheckLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router';
import { useRequireAuth, useServerCart } from '~/hooks';
import { createAddress, fetchAddresses, type Address } from '~/utils/api/addresses';
import { checkoutOrder } from '~/utils/api/orders';
import { fetchPublicSettings } from '~/utils/api/settings';
import { formatVND, calcVatIncluded } from '~/utils/format';

export const handle = { pageTitle: 'Thanh toán' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Thanh toán - Nailslay' }];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { authUser, requireAuth } = useRequireAuth();
  const { items, subtotal, loading } = useServerCart();
  const vatIncluded = calcVatIncluded(subtotal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankInfo, setBankInfo] = useState<Record<string, string>>({});
  const qrPreviewUrl = bankInfo.qr_code_url ?? '';
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
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
    if (!authUser) return;
    fetchAddresses()
      .then((list) => {
        setSavedAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      })
      .catch(() => setSavedAddresses([]));
  }, [authUser]);

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
    if (!items.length) {
      toast.error('Giỏ hàng trống');
      return;
    }

    setIsSubmitting(true);
    try {
      let addressId = selectedAddressId;
      if (selectedAddressId === 'new') {
        if (!form.fullName || !form.phone || !form.detail || !form.city) {
          toast.error('Vui lòng nhập đầy đủ thông tin giao hàng');
          setIsSubmitting(false);
          return;
        }
        const addressDetail = `${form.detail}, ${form.city}. Người nhận: ${form.fullName} — ${form.phone}`;
        const address = await createAddress(addressDetail, savedAddresses.length === 0);
        addressId = address.id;
      }

      const result = await checkoutOrder(addressId);
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
                {savedAddresses.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">Chọn địa chỉ đã lưu</p>
                    <div className="space-y-2">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm ${
                            selectedAddressId === addr.id
                              ? 'border-primary bg-primary-50/40'
                              : 'border-primary-200/70'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1"
                          />
                          <span>{addr.detail}</span>
                        </label>
                      ))}
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                          selectedAddressId === 'new' ? 'border-primary bg-primary-50/40' : 'border-primary-200/70'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === 'new'}
                          onChange={() => setSelectedAddressId('new')}
                        />
                        <span>Thêm địa chỉ mới</span>
                      </label>
                    </div>
                  </div>
                ) : null}
                {selectedAddressId === 'new' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Họ và tên" isRequired value={form.fullName} onValueChange={(v) => setForm({ ...form, fullName: v })} variant="bordered" />
                      <Input label="Số điện thoại" isRequired value={form.phone} onValueChange={(v) => setForm({ ...form, phone: v })} variant="bordered" />
                    </div>
                    <Input label="Tỉnh / Thành phố" isRequired value={form.city} onValueChange={(v) => setForm({ ...form, city: v })} variant="bordered" />
                    <Input label="Địa chỉ cụ thể" isRequired value={form.detail} onValueChange={(v) => setForm({ ...form, detail: v })} variant="bordered" />
                  </>
                ) : null}
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8E8A8A]">Tạm tính</span>
                    <span>{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A8A]">Trong đó thuế VAT (10%)</span>
                    <span className="text-[#8E8A8A]">{formatVND(vatIncluded)}</span>
                  </div>
                  <p className="text-xs text-[#8E8A8A] leading-relaxed">
                    Giá đã bao gồm VAT 10%. Tổng chuyển khoản bằng tạm tính, không cộng thêm thuế.
                  </p>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-primary-100/80">
                  <span>Tổng thanh toán</span>
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
