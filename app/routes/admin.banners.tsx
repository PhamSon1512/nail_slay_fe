import type { Route } from './+types/admin.banners';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiEditLine,
  RiInformationLine,
  RiUploadCloud2Line,
} from 'react-icons/ri';
import { AdminPageHeader, ConfirmDeleteModal } from '~/components';
import { BannerSlideImage } from '~/components/store/BannerSlideImage';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { ImagePreviewClearButton } from '~/components/admin/AdminImageUpload';
import { cn } from '~/utils';
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

const MAX_BANNERS = 6;
const BANNER_SIZE_HINT =
  'Desktop 1920×640 px · Mobile 1080×1350 px · JPG/PNG/WebP ≤ 2MB';

type DraftBanner = BannerItem & { imageFile?: File | null };

const emptyDraft = (sortOrder = 0): DraftBanner => ({
  id: '',
  imageUrl: '',
  title: '',
  subtitle: '',
  link: '/products',
  isActive: true,
  sortOrder,
  imageFile: null,
});

function buildForm(item: DraftBanner, includeImage = false) {
  const form = new FormData();
  if (includeImage && item.imageFile) form.append('image', item.imageFile);
  if (item.link) form.append('link', item.link);
  form.append('isActive', String(item.isActive));
  form.append('sortOrder', String(item.sortOrder));
  return form;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [createDraft, setCreateDraft] = useState<DraftBanner>(() => emptyDraft());
  const [editDraft, setEditDraft] = useState<DraftBanner | null>(null);
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sortedBanners = useMemo(
    () => [...banners].sort((a, b) => a.sortOrder - b.sortOrder),
    [banners],
  );
  const activeSlides = useMemo(
    () => sortedBanners.filter((b) => b.isActive),
    [sortedBanners],
  );
  const activeCount = activeSlides.length;

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

  useEffect(() => {
    setSlideIdx(0);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlideIdx((i) => (i + 1) % activeSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  const openCreate = () => {
    setCreateDraft(emptyDraft(banners.length));
    createModal.onOpen();
  };

  const openEdit = (banner: BannerItem) => {
    setEditDraft({ ...banner, imageFile: null });
    editModal.onOpen();
  };

  const handleCreate = async () => {
    if (!createDraft.imageFile) {
      toast.error('Vui lòng chọn ảnh banner');
      return;
    }
    if (banners.length >= MAX_BANNERS) {
      toast.error(`Tối đa ${MAX_BANNERS} banner`);
      return;
    }
    if (createDraft.isActive && activeCount >= MAX_BANNERS) {
      toast.error(`Đã đủ ${MAX_BANNERS} banner đang bật. Hãy tắt một banner khác trước.`);
      return;
    }
    setSaving(true);
    try {
      await createBanner(buildForm(createDraft, true));
      toast.success('Đã thêm banner');
      createModal.onClose();
      await refreshBanners();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editDraft) return;
    if (editDraft.isActive && !banners.find((b) => b.id === editDraft.id)?.isActive && activeCount >= MAX_BANNERS) {
      toast.error(`Đã đủ ${MAX_BANNERS} banner đang bật. Hãy tắt một banner khác trước.`);
      return;
    }
    setSaving(true);
    try {
      await updateBanner(editDraft.id, buildForm(editDraft, !!editDraft.imageFile));
      toast.success('Đã cập nhật banner');
      editModal.onClose();
      setEditDraft(null);
      await refreshBanners();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (id: string) => {
    setDeleteTargetId(id);
    deleteModal.onOpen();
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteBanner(deleteTargetId);
      toast.success('Đã xóa banner');
      setDeleteTargetId(null);
      await refreshBanners();
    } catch {
      // interceptor
    } finally {
      setDeleting(false);
    }
  };

  const curSlide = activeSlides[slideIdx];

  return (
    <div className="space-y-6 admin-surface">
      <AdminPageHeader
        title="Quản lý Banner"
        description={`Tối đa ${MAX_BANNERS} banner. Ảnh hiển thị đúng tỷ lệ gốc trên trang chủ.`}
        actions={
          <Button
            color="primary"
            className="text-[#1D1D1D] font-semibold"
            startContent={<RiAddLine />}
            onPress={openCreate}
            isDisabled={banners.length >= MAX_BANNERS}
          >
            Thêm banner
          </Button>
        }
      />

      <Card shadow="none" className={`${adminCardClass} bg-gradient-to-br from-primary-50/40 to-white dark:from-[#2a2226] dark:to-[#201a1d]`}>
        <CardBody className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
              Xem trước slide (đang bật)
            </h2>
            <span className="text-sm font-medium text-[#8E8A8A]">
              {activeCount}/{MAX_BANNERS} banner hoạt động
            </span>
          </div>
          <p className="text-sm text-[#8E8A8A] dark:text-[#FFDDE5]">
            Chỉ banner bật &quot;Đang hoạt động&quot;, sắp theo thứ tự hiển thị.
          </p>
          {loading ? (
            <p className="text-sm text-[#8E8A8A] py-8 text-center">Đang tải...</p>
          ) : activeSlides.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-primary-200 dark:border-[#4a3b42] py-16 text-center text-sm text-[#8E8A8A]">
              Chưa có banner nào đang bật.
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-primary-200 dark:border-[#4a3b42] bg-[#1d1d1d]/5 dark:bg-black/40">
              {curSlide ? <BannerSlideImage src={curSlide.imageUrl} alt="" /> : null}
              {activeSlides.length > 1 ? (
                <>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {activeSlides.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        aria-label={`Slide ${i + 1}`}
                        onClick={() => setSlideIdx(i)}
                        className={`h-2 rounded-full transition-all ${i === slideIdx ? 'w-8 bg-primary-500' : 'w-2 bg-primary-300/70'}`}
                      />
                    ))}
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    aria-label="Slide trước"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white"
                    onPress={() => setSlideIdx((i) => (i - 1 + activeSlides.length) % activeSlides.length)}
                  >
                    <RiArrowLeftSLine size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    aria-label="Slide sau"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white"
                    onPress={() => setSlideIdx((i) => (i + 1) % activeSlides.length)}
                  >
                    <RiArrowRightSLine size={20} />
                  </Button>
                </>
              ) : null}
            </div>
          )}
        </CardBody>
      </Card>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Danh sách banner</h2>
        {loading ? (
          <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
        ) : sortedBanners.length === 0 ? (
          <Card shadow="none" className="border border-dashed border-primary-200 bg-white dark:bg-[#2a2226]">
            <CardBody className="text-center text-sm text-[#8E8A8A] py-10">
              Chưa có banner. Nhấn &quot;Thêm banner&quot; để upload ảnh đầu tiên.
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBanners.map((banner) => (
              <Card key={banner.id} shadow="none" className={`${adminCardClass} overflow-hidden p-0`}>
                <div className="bg-[#1d1d1d]/5 dark:bg-black/30 flex items-center justify-center min-h-[140px]">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="w-full h-auto max-h-40 object-contain"
                  />
                </div>
                <CardBody className="gap-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
                      Thứ tự: {banner.sortOrder}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        banner.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-[#8E8A8A]/15 text-[#8E8A8A]'
                      }`}
                    >
                      {banner.isActive ? 'Hiển thị' : 'Tắt'}
                    </span>
                  </div>
                  {banner.link ? (
                    <p className="text-xs text-[#8E8A8A] truncate" title={banner.link}>
                      Link: {banner.link}
                    </p>
                  ) : null}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="text-[#1D1D1D] flex-1"
                      startContent={<RiEditLine />}
                      onPress={() => openEdit(banner)}
                      isDisabled={saving}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => requestDelete(banner.id)}
                      isDisabled={saving || deleting}
                      aria-label="Xóa banner"
                    >
                      <RiDeleteBinLine />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <CreateEditBannerModal
        title="Banner mới"
        isOpen={createModal.isOpen}
        onOpenChange={createModal.onOpenChange}
        draft={createDraft}
        setDraft={setCreateDraft}
        saving={saving}
        onSave={handleCreate}
        saveLabel="Thêm banner"
        imageRequired
        showSizeHint
        activeCount={activeCount}
      />

      {editDraft ? (
        <CreateEditBannerModal
          title="Sửa banner"
          isOpen={editModal.isOpen}
          onOpenChange={(open) => {
            if (open) editModal.onOpen();
            else {
              editModal.onClose();
              setEditDraft(null);
            }
          }}
          draft={editDraft}
          setDraft={(next) => {
            setEditDraft((prev) => {
              if (!prev) return prev;
              return typeof next === 'function' ? next(prev) : next;
            });
          }}
          saving={saving}
          onSave={handleEditSave}
          saveLabel="Lưu thay đổi"
          imageRequired={false}
          showSizeHint
          activeCount={activeCount}
          existingActive={banners.find((b) => b.id === editDraft.id)?.isActive}
        />
      ) : null}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => {
          if (open) deleteModal.onOpen();
          else {
            deleteModal.onClose();
            setDeleteTargetId(null);
          }
        }}
        message="Bạn có chắc muốn xóa banner này? Hành động này không thể hoàn tác."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function CreateEditBannerModal({
  title,
  isOpen,
  onOpenChange,
  draft,
  setDraft,
  saving,
  onSave,
  saveLabel,
  imageRequired,
  showSizeHint,
  activeCount,
  existingActive,
}: {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  draft: DraftBanner;
  setDraft: (next: DraftBanner | ((prev: DraftBanner) => DraftBanner)) => void;
  saving: boolean;
  onSave: () => void;
  saveLabel: string;
  imageRequired: boolean;
  showSizeHint?: boolean;
  activeCount: number;
  existingActive?: boolean;
}) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const inputRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<string | null>(null);

  const previewUrl = useMemo(() => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
    if (draft.imageFile) {
      blobRef.current = URL.createObjectURL(draft.imageFile);
      return blobRef.current;
    }
    return draft.imageUrl || undefined;
  }, [draft.imageFile, draft.imageUrl]);

  useEffect(
    () => () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    },
    [],
  );

  const wouldExceedActive =
    draft.isActive && !existingActive && activeCount >= MAX_BANNERS;

  const previewFrameClass =
    previewMode === 'mobile'
      ? '!min-h-0 !h-52 !max-h-52 sm:!h-56 sm:!max-h-56'
      : '!min-h-0 !h-40 sm:!h-44 md:!h-48 !max-h-48';

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
      <ModalContent className="bg-white dark:bg-[#2a2226]">
        {(onClose) => (
          <>
            <ModalHeader className="flex-col items-start gap-1 pb-2">
              <span className="font-heading text-xl text-[#1D1D1D] dark:text-[#FFF3F5]">{title}</span>
              <span className="text-sm font-normal text-[#8E8A8A] dark:text-[#FFDDE5]">
                Tải ảnh và xem trước như trên trang chủ
              </span>
            </ModalHeader>
            <ModalBody className="gap-6 pb-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-heading text-base font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                      {imageRequired ? (
                        <RequiredLabel required>Ảnh banner</RequiredLabel>
                      ) : (
                        'Ảnh banner'
                      )}
                    </h3>
                    {previewUrl ? (
                      <div
                        className="inline-flex shrink-0 rounded-lg border border-primary-200 dark:border-[#4a3b42] p-0.5"
                        role="tablist"
                        aria-label="Chế độ xem trước"
                      >
                        {(['desktop', 'mobile'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            role="tab"
                            aria-selected={previewMode === mode}
                            onClick={() => setPreviewMode(mode)}
                            className={cn(
                              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                              previewMode === mode
                                ? 'bg-primary text-[#1D1D1D] shadow-sm'
                                : 'text-[#8E8A8A] hover:text-[#1D1D1D] dark:hover:text-[#FFF3F5]',
                            )}
                          >
                            {mode === 'desktop' ? 'Desktop' : 'Mobile'}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setDraft((prev) => ({ ...prev, imageFile: file }));
                      e.target.value = '';
                    }}
                  />

                  {previewUrl ? (
                    <div className="space-y-3">
                      <div
                        className={cn(
                          'relative overflow-hidden rounded-xl border border-primary-200 dark:border-[#4a3b42] bg-[#FFF3F5]/40 dark:bg-[#1d1d1d]',
                          previewMode === 'mobile' && 'mx-auto max-w-[280px]',
                        )}
                      >
                        <ImagePreviewClearButton
                          className="right-2 top-2"
                          disabled={saving}
                          onClear={() => {
                            setDraft((prev) => ({ ...prev, imageFile: null, imageUrl: '' }));
                            if (inputRef.current) inputRef.current.value = '';
                          }}
                        />
                        <BannerSlideImage
                          src={previewUrl}
                          alt="Xem trước banner"
                          className={previewFrameClass}
                        />
                      </div>
                      <Button
                        variant="flat"
                        color="primary"
                        fullWidth
                        startContent={<RiUploadCloud2Line size={18} />}
                        onPress={() => inputRef.current?.click()}
                        isDisabled={saving}
                        className="font-medium"
                      >
                        Đổi ảnh
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={saving}
                      className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/30 px-4 py-10 transition-colors hover:border-primary-400 hover:bg-primary-50/60 disabled:opacity-60 dark:border-[#4a3b42] dark:bg-[#1d1d1d]/50 dark:hover:border-primary-500"
                    >
                      <RiUploadCloud2Line size={36} className="text-primary" />
                      <span className="mt-3 text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
                        Tải ảnh banner
                      </span>
                      <span className="mt-1 text-xs text-[#8E8A8A] dark:text-[#FFDDE5]">
                        Nhấn để chọn JPG, PNG hoặc WebP
                      </span>
                    </button>
                  )}

                  {showSizeHint ? (
                    <p className="flex items-start gap-1.5 text-xs leading-relaxed text-[#8E8A8A] dark:text-[#FFDDE5]">
                      <RiInformationLine className="mt-0.5 shrink-0" size={14} />
                      <span>{BANNER_SIZE_HINT}</span>
                    </p>
                  ) : null}
                </section>

                <section className="space-y-4 lg:border-l lg:border-primary-100 lg:pl-8 dark:lg:border-[#4a3b42]">
                  <h3 className="font-heading text-base font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                    Cài đặt hiển thị
                  </h3>
                  <Input
                    type="number"
                    label={<RequiredLabel required>Thứ tự hiển thị</RequiredLabel>}
                    description="Số nhỏ hơn hiển thị trước (bắt đầu từ 0)"
                    min={0}
                    value={String(draft.sortOrder)}
                    onValueChange={(v) => {
                      const n = Number.parseInt(v, 10);
                      setDraft((prev) => ({
                        ...prev,
                        sortOrder: Number.isNaN(n) ? 0 : Math.max(0, n),
                      }));
                    }}
                    classNames={adminInputClassNames}
                    isDisabled={saving}
                  />
                  <Input
                    label="Liên kết (tuỳ chọn)"
                    placeholder="/products"
                    value={draft.link ?? ''}
                    onValueChange={(v) => setDraft((prev) => ({ ...prev, link: v }))}
                    classNames={adminInputClassNames}
                    isDisabled={saving}
                  />
                  <div className="flex items-center justify-between rounded-xl border border-primary-100 bg-primary-50/40 px-4 py-3 dark:border-[#4a3b42] dark:bg-[#1d1d1d]/50">
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
                        Đang hoạt động
                      </p>
                      <p className="text-xs text-[#8E8A8A] dark:text-[#FFDDE5]">
                        Banner hiển thị trên trang chủ
                      </p>
                    </div>
                    <Switch
                      isSelected={draft.isActive}
                      onValueChange={(v) => setDraft((prev) => ({ ...prev, isActive: v }))}
                      aria-label="Đang hoạt động"
                      isDisabled={saving}
                    />
                  </div>
                  {wouldExceedActive ? (
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      Đã đủ {MAX_BANNERS} banner đang bật — tắt một banner khác trước khi bật banner
                      này.
                    </p>
                  ) : null}
                </section>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-primary-100 dark:border-[#4a3b42]">
              <Button variant="light" onPress={onClose} isDisabled={saving}>
                Hủy
              </Button>
              <Button
                color="primary"
                className="text-[#1D1D1D]"
                isDisabled={saving || wouldExceedActive || !previewUrl}
                onPress={onSave}
              >
                {saving ? 'Đang lưu...' : saveLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
