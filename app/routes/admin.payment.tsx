import type { Route } from './+types/admin.payment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Input } from '@heroui/react';
import toast from 'react-hot-toast';
import { AdminPageHeader } from '~/components';
import { AdminImageUpload } from '~/components/admin/AdminImageUpload';
import { fetchBankSettings, updateBankSettings } from '~/utils/api/admin';
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
  const blobUrlRef = useRef<string | null>(null);

  const setPreviewUrl = useCallback((url: string) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    if (url.startsWith('blob:')) {
      blobUrlRef.current = url;
    }
    setQrPreview(url);
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const info = await fetchBankSettings();
      if (info) {
        setBankName(info.bank_name ?? '');
        setAccountNumber(info.account_number ?? '');
        setAccountName(info.account_name ?? '');
        setTransferContent(info.transfer_content ?? 'NAILSLAY {order_id}');
        if (info.qr_code_url) setPreviewUrl(info.qr_code_url);
      }
    } catch {
      toast.error('Không tải được cấu hình thanh toán');
    } finally {
      setLoading(false);
    }
  }, [setPreviewUrl]);

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
      setQrFile(null);
      if (result.bank_info.qr_code_url) {
        setPreviewUrl(result.bank_info.qr_code_url);
      }
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
          <AdminImageUpload
            label="Ảnh mã QR"
            required={!qrPreview}
            previewUrl={qrPreview}
            previewClassName="w-48 h-48 object-contain rounded-xl border border-primary-200 bg-white p-2 shadow-sm"
            onChange={(file) => {
              setQrFile(file);
              if (file) setPreviewUrl(URL.createObjectURL(file));
            }}
          />
          <p className="text-xs text-[#8E8A8A]">Khuyến nghị: ảnh QR vuông, tối thiểu 300×300 px, PNG/JPG.</p>

          <Input
            label="Tên ngân hàng *"
            placeholder="VD: Vietcombank, MB Bank..."
            value={bankName}
            onValueChange={setBankName}
            classNames={adminInputClassNames}
          />
          <Input
            label="Số tài khoản *"
            placeholder="VD: 0123456789"
            value={accountNumber}
            onValueChange={setAccountNumber}
            classNames={adminInputClassNames}
          />
          <Input
            label="Chủ tài khoản *"
            placeholder="VD: NGUYEN VAN A"
            value={accountName}
            onValueChange={setAccountName}
            classNames={adminInputClassNames}
          />
          <Input
            label="Nội dung chuyển khoản"
            placeholder="VD: NAILSLAY {order_id}"
            value={transferContent}
            onValueChange={setTransferContent}
            classNames={adminInputClassNames}
          />

          <Button color="primary" className="text-[#1D1D1D] w-fit font-semibold" isLoading={saving} onPress={handleSave}>
            Lưu cấu hình
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
