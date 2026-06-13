import type { Route } from './+types/_storefront.checkout';
import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { RiBankLine, RiCheckLine, RiMapPinLine, RiShieldCheckLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { BRAND } from '~/data';
import { cartAtom, cartTotalAtom } from '~/utils/atoms';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Thanh toan' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Thanh toan - Nailslay' }];

const BANK_INFO = {
  bank_name: 'Vietcombank',
  account_number: '1234567890',
  account_name: 'NAIL SLAY CO LTD',
  transfer_content: 'NAILSLAY {order_id}',
  qr_code_url: '',
};

export default function CheckoutPage() {
  const [cartItems] = useAtom(cartAtom);
  const [total] = useAtom(cartTotalAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    detail: '',
    city: '',
  });

  const shipping = total >= 500000 ? 0 : 30000;
  const grandTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.detail || !form.city) {
      toast.error('Vui long nhap day du thong tin giao hang');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    toast.success('Da tao don. Vui long chuyen khoan theo thong tin QR.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl text-[#1D1D1D] dark:text-[#FFF3F5]">Gio hang trong</h2>
        <Button as={Link} to="/products" color="primary" className="text-[#1D1D1D] font-semibold">
          Tiep tuc mua sam
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-heading text-3xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5] mb-8">
        Thanh toan don hang
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
              <CardHeader className="flex items-center gap-2 pb-0">
                <RiMapPinLine size={18} className="text-[#1D1D1D]" />
                <h2 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                  Dia chi giao hang
                </h2>
              </CardHeader>
              <CardBody className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ho va ten"
                    isRequired
                    value={form.fullName}
                    onValueChange={(v) => setForm({ ...form, fullName: v })}
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-primary-200 bg-white/80 dark:bg-[#3b3237]' }}
                  />
                  <Input
                    label="So dien thoai"
                    isRequired
                    value={form.phone}
                    onValueChange={(v) => setForm({ ...form, phone: v })}
                    variant="bordered"
                    classNames={{ inputWrapper: 'border-primary-200 bg-white/80 dark:bg-[#3b3237]' }}
                  />
                </div>
                <Input
                  label="Tinh / Thanh pho"
                  isRequired
                  value={form.city}
                  onValueChange={(v) => setForm({ ...form, city: v })}
                  variant="bordered"
                  classNames={{ inputWrapper: 'border-primary-200 bg-white/80 dark:bg-[#3b3237]' }}
                />
                <Input
                  label="Dia chi cu the"
                  isRequired
                  value={form.detail}
                  onValueChange={(v) => setForm({ ...form, detail: v })}
                  variant="bordered"
                  classNames={{ inputWrapper: 'border-primary-200 bg-white/80 dark:bg-[#3b3237]' }}
                />
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
              <CardHeader className="flex items-center gap-2 pb-0">
                <RiBankLine size={18} className="text-[#1D1D1D]" />
                <h2 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                  Thanh toan chuyen khoan
                </h2>
              </CardHeader>
              <CardBody className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-[#8E8A8A]">Ngan hang</span>
                  <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{BANK_INFO.bank_name}</span>
                  <span className="text-[#8E8A8A]">So tai khoan</span>
                  <span className="font-mono font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">{BANK_INFO.account_number}</span>
                  <span className="text-[#8E8A8A]">Chu the</span>
                  <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{BANK_INFO.account_name}</span>
                  <span className="text-[#8E8A8A]">Noi dung CK</span>
                  <span className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{BANK_INFO.transfer_content}</span>
                </div>

                <Divider />

                <div className="flex justify-center">
                  {BANK_INFO.qr_code_url ? (
                    <img src={BANK_INFO.qr_code_url} alt="QR chuyen khoan" className="w-48 h-48 rounded-xl border border-primary-200" />
                  ) : (
                    <img src={BRAND.assets.logo} alt={BRAND.name} className="w-40 h-40 object-contain opacity-70" />
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] sticky top-24">
              <CardHeader className="pb-0">
                <h2 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                  Tom tat don hang
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">{item.name}</p>
                        <p className="text-xs text-[#8E8A8A]">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Divider />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#8E8A8A]">
                    <span>Tam tinh</span>
                    <span>{formatVND(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#8E8A8A]">
                    <span>Phi giao hang</span>
                    <span>{shipping === 0 ? 'Mien phi' : formatVND(shipping)}</span>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between font-bold">
                  <span className="text-[#1D1D1D] dark:text-[#FFF3F5]">Tong cong</span>
                  <span className="text-lg text-[#1D1D1D] dark:text-[#FFF3F5]">{formatVND(grandTotal)}</span>
                </div>

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  startContent={!isSubmitting && <RiCheckLine size={18} />}
                  className="font-semibold text-[#1D1D1D]"
                >
                  Dat hang
                </Button>

                <div className="flex items-center gap-1.5 text-[11px] text-[#8E8A8A] justify-center">
                  <RiShieldCheckLine size={12} className="text-emerald-500" />
                  Bao mat thanh toan
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

