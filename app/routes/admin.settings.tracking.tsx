import type { Route } from './+types/admin.settings.tracking';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Switch,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { AdminPageHeader } from '~/components';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { fetchAdminSettings, updateAdminSettings } from '~/utils/api/admin';
import { adminCardClass, adminInputClassNames, adminTextareaClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'SEO & Tracking' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Quản lý Mã theo dõi - Admin Nailslay' }];

export type TrackingCode = {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
};

export default function AdminTrackingPage() {
  const [codes, setCodes] = useState<TrackingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingCode, setEditingCode] = useState<TrackingCode | null>(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await fetchAdminSettings();
      setCodes((settings.tracking_codes as TrackingCode[]) || []);
    } catch {
      toast.error('Không tải được cài đặt tracking');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveToServer = async (newCodes: TrackingCode[]) => {
    setSaving(true);
    try {
      await updateAdminSettings({ tracking_codes: newCodes });
      setCodes(newCodes);
      toast.success('Đã lưu thành công!');
      onOpenChange(); // Close modal
    } catch {
      toast.error('Có lỗi xảy ra khi lưu');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (id: string, enabled: boolean) => {
    const newCodes = codes.map((c) => (c.id === id ? { ...c, enabled } : c));
    void saveToServer(newCodes);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã này?')) return;
    const newCodes = codes.filter((c) => c.id !== id);
    void saveToServer(newCodes);
  };

  const openAddModal = () => {
    setEditingCode(null);
    setFormName('');
    setFormCode('');
    onOpen();
  };

  const openEditModal = (code: TrackingCode) => {
    setEditingCode(code);
    setFormName(code.name);
    setFormCode(code.code);
    onOpen();
  };

  const handleSubmit = () => {
    if (!formName.trim() || !formCode.trim()) {
      toast.error('Vui lòng nhập đầy đủ Tên mã và Nội dung mã');
      return;
    }

    if (editingCode) {
      const newCodes = codes.map((c) =>
        c.id === editingCode.id ? { ...c, name: formName, code: formCode } : c
      );
      void saveToServer(newCodes);
    } else {
      const newCode: TrackingCode = {
        id: crypto.randomUUID(),
        name: formName,
        code: formCode,
        enabled: true,
      };
      void saveToServer([...codes, newCode]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl admin-surface">
      <AdminPageHeader
        title="SEO & Tracking"
        description="Quản lý các đoạn mã theo dõi (Google Analytics, Google Search Console, Facebook Pixel...). Website sẽ tự động nhúng các mã đang Bật."
        actions={
          <Button
            color="primary"
            startContent={<RiAddLine size={20} />}
            className="text-[#1D1D1D] font-semibold"
            onPress={openAddModal}
          >
            Thêm mã mới
          </Button>
        }
      />

      <section className="space-y-4">
        {codes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#2a2226] rounded-2xl border border-dashed border-primary-200">
            <p className="text-[#8E8A8A] text-sm">Chưa có mã theo dõi nào.</p>
          </div>
        ) : (
          codes.map((item) => (
            <Card key={item.id} shadow="none" className={adminCardClass}>
              <CardBody className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading font-semibold text-lg text-[#1D1D1D] dark:text-[#FFF3F5]">
                      {item.name}
                    </h3>
                    <Switch
                      size="sm"
                      isSelected={item.enabled}
                      onValueChange={(v) => handleToggle(item.id, v)}
                      color="primary"
                    />
                    <span className="text-xs text-[#8E8A8A]">{item.enabled ? 'Đang hoạt động' : 'Đã tắt'}</span>
                  </div>
                  <pre className="text-xs text-[#8E8A8A] bg-[#f9f9f9] dark:bg-black/20 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap line-clamp-3">
                    {item.code}
                  </pre>
                </div>
                <div className="flex items-center gap-2 pt-1 md:pt-0">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => openEditModal(item)}
                    className="text-[#1D1D1D] dark:text-[#FFF3F5]"
                  >
                    <RiEdit2Line size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => handleDelete(item.id)}
                  >
                    <RiDeleteBin6Line size={18} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" classNames={{ base: 'bg-white dark:bg-[#1a1518]' }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-heading text-xl">
                {editingCode ? 'Chỉnh sửa mã theo dõi' : 'Thêm mã theo dõi mới'}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4 py-2">
                  <Input
                    label={<RequiredLabel required>Tên mã (VD: Google Analytics)</RequiredLabel>}
                    value={formName}
                    onValueChange={setFormName}
                    classNames={adminInputClassNames}
                    placeholder="Nhập tên gợi nhớ..."
                  />
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
                      <RequiredLabel required>Nội dung mã</RequiredLabel>
                    </p>
                    <p className="text-xs text-[#8E8A8A] mb-2">
                      Dán toàn bộ đoạn &lt;script&gt; hoặc &lt;meta&gt; được cấp. Nếu là file HTML của Google Search Console, bạn có thể dán nội dung file (VD: google-site-verification: xyz.html) vào đây.
                    </p>
                    <Textarea
                      minRows={8}
                      value={formCode}
                      onValueChange={setFormCode}
                      classNames={adminTextareaClassNames}
                      placeholder="<!-- Google tag (gtag.js) -->&#10;<script>...</script>"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" onPress={handleSubmit} isLoading={saving} className="text-[#1D1D1D] font-semibold">
                  {saving ? 'Đang lưu...' : 'Lưu mã'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
