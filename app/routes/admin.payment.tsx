import type { Route } from './+types/admin.payment';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Input } from '@heroui/react';
import toast from 'react-hot-toast';
import { AdminPageHeader } from '~/components';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { AdminImageUpload } from '~/components/admin/AdminImageUpload';
import { fetchBankSettings, updateBankSettings, type BankInfo } from '~/utils/api/admin';
import { adminCardClass, adminInputClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Cấu hình Thanh toán QR' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Thanh toán QR - Admin Nailslay' }];

export default function AdminPaymentPage() {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [transferContent, setTransferContent] = useState('');
  const [qrPreview, setQrPreview] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const info = await fetchBankSettings();
      if (info) {
        setBankName(info.bank_name ?? '');
        setAccountNumber(info.account_number ?? '');
        setAccountName(info.account_name ?? '');
        setTransferContent(info.transfer_content ?? 'NAILSLAY {order_id}');
        setQrPreview(info.qr_code_url ?? '');
      }
    } catch {
      toast.error('Không tải được cấu hình thanh toán');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    if (!bankName || !accountNumber || !accountName) {
      toast.error('Vui lòng điền đủ thông tin ngân hàng bắt buộc');
      return;
    }
    if (!qrPreview && !qrFile) {
      toast.error('Vui lòng upload ảnh mã QR');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('bank_name', bankName);
      fd.append('account_number', accountNumber);
      fd.append('account_name', accountName);
      fd.append('transfer_content', transferContent);
      if (qrFile) fd.append('qr_image', qrFile);
      const result = await updateBankSettings(fd);
      setQrPreview(result.bank_info.qr_code_url);
      setQrFile(null);
      toast.success('Đã lưu cấu hình thanh toán');
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-[#8E8A8A]">Đang tải...</p>;

  return (
    <div className="space-y-6 admin-surface max-w-2xl">
      <AdminPageHeader
        title="Cấu hình Thanh toán QR"
        description="Mã QR và thông tin chuyển khoản hiển thị khi khách chọn thanh toán ngân hàng."
      />

      <Card shadow="none" className={adminCardClass}>
        <CardBody className="gap-4">
          <Input label={<RequiredLabel required>Tên ngân hàng</RequiredLabel>} placeholder="VD: Vietcombank, MB Bank..." value={bankName} onValueChange={setBankName} classNames={adminInputClassNames} />
          <Input label={<RequiredLabel required>Số tài khoản</RequiredLabel>} placeholder="VD: 0123456789" value={accountNumber} onValueChange={setAccountNumber} classNames={adminInputClassNames} />
          <Input label={<RequiredLabel required>Chủ tài khoản</RequiredLabel>} placeholder="VD: NGUYEN VAN A" value={accountName} onValueChange={setAccountName} classNames={adminInputClassNames} />
          <Input label="Nội dung chuyển khoản" placeholder="VD: NAILSLAY {order_id}" value={transferContent} onValueChange={setTransferContent} classNames={adminInputClassNames} />
          
          <div className="pt-2">
            <AdminImageUpload
              label="Ảnh mã QR"
              required={!qrPreview}
              previewUrl={qrPreview}
              onChange={(file) => {
                setQrFile(file);
                if (file) setQrPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {qrPreview ? (
            <div className="flex flex-col items-center gap-2 pt-2 border-t border-primary-100/50 mt-2">
              <p className="text-xs text-[#8E8A8A] font-medium">Xem trước mã QR lớn</p>
              <img src={qrPreview} alt="Mã QR thanh toán" className="w-48 h-48 object-contain rounded-xl border border-primary-200 bg-white p-2 shadow-sm" />
            </div>
          ) : null}
          <Button color="primary" className="text-[#1D1D1D] w-fit font-semibold" isLoading={saving} onPress={handleSave}>
            Lưu cấu hình
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
