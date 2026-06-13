import type { Route } from './+types/admin.banners';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiAddLine, RiArrowDownLine, RiArrowUpLine, RiDeleteBinLine } from 'react-icons/ri';
import { AdminPageHeader } from '~/components';
import { AdminImageUpload } from '~/components/admin/AdminImageUpload';
import type { BannerItem } from '~/data/homepage';
import {
  createBanner,
  deleteBanner,
  fetchBanners,
  updateBanner,
} from '~/utils/api/admin';
import { adminCardClass, adminInputClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Quản lý Banner' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Banner - Admin Nailslay' }];

type DraftBanner = BannerItem & { imageFile?: File | null };

const emptyDraft = (): DraftBanner => ({
  id: '',
  imageUrl: '',
  title: '',
  subtitle: '',
  link: '/products',
  isActive: true,
  sortOrder: 0,
  imageFile: null,
});

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftBanner>(emptyDraft());
  const createModal = useDisclosure();

  const refreshBanners = useCallback(async () => {
    const list = await fetchBanners();
    setBanners([...list].sort((a, b) => a.sortOrder - b.sortOrder));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await refreshBanners();
    } catch {
      toast.error('Không tải được danh sách banner');
    } finally {
      setLoading(false);
    }
  }, [refreshBanners]);

  useEffect(() => {
    void load();
  }, [load]);

  const buildForm = (item: DraftBanner, includeImage = false) => {
    const form = new FormData();
    if (includeImage && item.imageFile) form.append('image', item.imageFile);
    if (item.link) form.append('link', item.link);
    form.append('isActive', String(item.isActive));
    form.append('sortOrder', String(item.sortOrder));
    return form;
  };

  const openCreate = () => {
    setDraft(emptyDraft());
    createModal.onOpen();
  };

  const handleCreate = async () => {
    if (!draft.imageFile) {
      toast.error('Vui lòng chọn ảnh banner');
      return;
    }
    if (banners.length >= 6) {
      toast.error('Tối đa 6 banner');
      return;
    }
    setSavingId('new');
    try {
      await createBanner(buildForm({ ...draft, sortOrder: banners.length }, true));
      toast.success('Đã tạo banner');
      createModal.onClose();
      setDraft(emptyDraft());
      await refreshBanners();
    } catch {
      // interceptor
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdate = async (item: DraftBanner) => {
    setSavingId(item.id);
    try {
      await updateBanner(item.id, buildForm(item, !!item.imageFile));
      toast.success('Đã cập nhật banner');
      await refreshBanners();
    } catch {
      // interceptor
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa banner này?')) return;
    try {
      await deleteBanner(id);
      toast.success('Đã xóa banner');
      await refreshBanners();
    } catch {
      // interceptor
    }
  };

  const moveBanner = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= banners.length) return;
    const current = banners[index];
    const swap = banners[target];
    setSavingId(current.id);
    try {
      await Promise.all([
        updateBanner(current.id, buildForm({ ...current, sortOrder: target, imageFile: null })),
        updateBanner(swap.id, buildForm({ ...swap, sortOrder: index, imageFile: null })),
      ]);
      await refreshBanners();
    } catch {
      toast.error('Không thể đổi thứ tự');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 admin-surface max-w-4xl">
      <AdminPageHeader
        title="Quản lý Banner"
        description="Upload ảnh banner (tối đa 6). Chỉ cần ảnh, liên kết và thứ tự hiển thị."
        actions={
          <Button
            color="primary"
            className="text-[#1D1D1D] font-semibold"
            startContent={<RiAddLine />}
            onPress={openCreate}
            isDisabled={banners.length >= 6}
          >
            Thêm banner
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
      ) : banners.length === 0 ? (
        <Card shadow="none" className="border border-dashed border-primary-200 bg-white">
          <CardBody className="text-center text-sm text-[#8E8A8A] py-10">
            Chưa có banner. Nhấn &quot;Thêm banner&quot; để upload ảnh đầu tiên.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <BannerEditor
              key={banner.id}
              banner={banner}
              index={index}
              total={banners.length}
              saving={savingId === banner.id}
              onSave={handleUpdate}
              onDelete={() => handleDelete(banner.id)}
              onMoveUp={() => moveBanner(index, -1)}
              onMoveDown={() => moveBanner(index, 1)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={createModal.isOpen} onOpenChange={createModal.onOpenChange} size="lg">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">Banner mới</ModalHeader>
              <ModalBody className="gap-4">
                <div className="pt-2 pb-2">
                  <AdminImageUpload
                    label="Ảnh banner"
                    required
                    previewUrl={draft.imageFile ? URL.createObjectURL(draft.imageFile) : undefined}
                    onChange={(file) => setDraft({ ...draft, imageFile: file })}
                  />
                </div>
                <Input
                  label="Liên kết (tuỳ chọn)"
                  placeholder="/products"
                  value={draft.link ?? ''}
                  onValueChange={(v) => setDraft({ ...draft, link: v })}
                  classNames={adminInputClassNames}
                />
                <div className="flex items-center gap-3">
                  <Switch
                    isSelected={draft.isActive}
                    onValueChange={(v) => setDraft({ ...draft, isActive: v })}
                    aria-label="Đang hoạt động"
                  />
                  <span className="text-sm text-[#1D1D1D]">Đang hoạt động</span>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Hủy</Button>
                <Button color="primary" className="text-[#1D1D1D]" isLoading={savingId === 'new'} onPress={handleCreate}>
                  Lưu banner
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function BannerEditor({
  banner,
  index,
  total,
  saving,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  banner: BannerItem;
  index: number;
  total: number;
  saving: boolean;
  onSave: (item: DraftBanner) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [item, setItem] = useState<DraftBanner>({ ...banner, imageFile: null });

  useEffect(() => {
    setItem({ ...banner, imageFile: null });
  }, [banner]);

  return (
    <Card shadow="none" className={adminCardClass}>
      <CardBody className="gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#8E8A8A]">#{index + 1}</span>
            <div className="flex items-center gap-2">
              <Switch
                isSelected={item.isActive}
                onValueChange={(v) => setItem({ ...item, isActive: v })}
                color="primary"
                aria-label="Đang hoạt động"
              />
              <span className="text-sm text-[#1D1D1D]">Đang hoạt động</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button isIconOnly size="sm" variant="flat" isDisabled={index === 0} onPress={onMoveUp} aria-label="Lên trên">
              <RiArrowUpLine />
            </Button>
            <Button isIconOnly size="sm" variant="flat" isDisabled={index === total - 1} onPress={onMoveDown} aria-label="Xuống dưới">
              <RiArrowDownLine />
            </Button>
            <Button isIconOnly size="sm" color="danger" variant="light" onPress={onDelete}>
              <RiDeleteBinLine />
            </Button>
          </div>
        </div>
        <div className="pt-2">
          <AdminImageUpload
            label="Ảnh banner"
            previewUrl={item.imageFile ? URL.createObjectURL(item.imageFile) : item.imageUrl}
            onChange={(file) => setItem({ ...item, imageFile: file })}
          />
        </div>
        <Input
          label="Liên kết"
          placeholder="/products"
          value={item.link ?? ''}
          onValueChange={(v) => setItem({ ...item, link: v })}
          classNames={adminInputClassNames}
        />
        <Button color="primary" className="text-[#1D1D1D] w-fit" isLoading={saving} onPress={() => onSave(item)}>
          Cập nhật
        </Button>
      </CardBody>
    </Card>
  );
}
