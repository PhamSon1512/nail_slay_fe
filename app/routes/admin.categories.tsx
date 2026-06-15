import type { Route } from './+types/admin.categories';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDeleteBinLine,
  RiPencilLine,
  RiSearchLine,
} from 'react-icons/ri';
import { AdminPageHeader, ConfirmDeleteModal } from '~/components';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { AdminImageUpload } from '~/components/admin/AdminImageUpload';
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
  type AdminCategory,
} from '~/utils/api/admin';
import { adminInputClassNames, adminSelectClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Quản lý Danh mục' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Danh mục - Admin Nailslay' }];

type FormState = {
  code: string;
  name: string;
  slug: string;
  parentId: string;
  imageFile: File | null;
  existingImageUrl?: string;
};

type SortKey = 'name-asc' | 'name-desc' | 'code-asc' | 'code-desc';

const emptyForm = (): FormState => ({
  code: '',
  name: '',
  slug: '',
  parentId: '',
  imageFile: null,
});

function isRootCategory(cat: AdminCategory) {
  return !cat.parentId;
}

function childrenOf(parent: AdminCategory, all: AdminCategory[]) {
  return all.filter((c) => c.parentId === parent.id);
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const formModal = useDisclosure();
  const deleteModal = useDisclosure();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await fetchAdminCategories());
    } catch {
      toast.error('Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rootCategories = useMemo(() => {
    let roots = categories.filter(isRootCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      roots = categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.code ?? '').toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q),
      );
    } else {
      roots.sort((a, b) => {
        switch (sortKey) {
          case 'name-desc':
            return b.name.localeCompare(a.name, 'vi');
          case 'code-asc':
            return (a.code ?? '').localeCompare(b.code ?? '', 'vi');
          case 'code-desc':
            return (b.code ?? '').localeCompare(a.code ?? '', 'vi');
          default:
            return a.name.localeCompare(b.name, 'vi');
        }
      });
    }
    return roots;
  }, [categories, search, sortKey]);

  const parentOptions = categories.filter(isRootCategory);

  const toFormData = (data: FormState) => {
    const fd = new FormData();
    fd.append('code', data.code);
    fd.append('name', data.name);
    fd.append('slug', data.slug);
    if (data.parentId) fd.append('parentId', data.parentId);
    if (data.imageFile) fd.append('image', data.imageFile);
    if (editingId && !data.imageFile && !data.existingImageUrl) {
      fd.append('remove_image', 'true');
    }
    return fd;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    formModal.onOpen();
  };

  const openEdit = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setForm({
      code: cat.code ?? '',
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId ?? '',
      imageFile: null,
      existingImageUrl: cat.imageUrl ?? undefined,
    });
    formModal.onOpen();
  };

  const requestDelete = (cat: AdminCategory) => {
    setDeleteTarget({ id: cat.id, name: cat.name });
    deleteModal.onOpen();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success('Đã xóa');
      setDeleteTarget(null);
      await load();
    } catch {
      // interceptor
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.code || !form.name || !form.slug) {
      toast.error('Vui lòng điền mã, tên và slug');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, toFormData(form));
        toast.success('Đã cập nhật danh mục');
      } else {
        await createCategory(toFormData(form));
        toast.success('Đã tạo danh mục');
      }
      formModal.onClose();
      await load();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat: AdminCategory) => {
    requestDelete(cat);
  };

  const renderRow = (cat: AdminCategory, index: number, isChild = false) => (
    <tr key={cat.id} className={isChild ? 'bg-primary-50/30 dark:bg-[#241e22]' : 'hover:bg-primary-50/20'}>
      <td className="px-4 py-3 text-sm">{isChild ? '' : index + 1}</td>
      <td className="px-4 py-3">
        {cat.imageUrl ? (
          <img src={cat.imageUrl} alt={cat.name} className="w-8 h-8 object-cover rounded-md shadow-sm" />
        ) : (
          <div className="w-8 h-8 bg-[#f5f5f5] dark:bg-[#1f1f1f] rounded-md border border-dashed border-gray-300"></div>
        )}
      </td>
      <td className="px-4 py-3 text-sm font-mono">{cat.code}</td>
      <td className={`px-4 py-3 text-sm font-medium ${isChild ? 'pl-10' : ''}`}>
        {isChild ? <span className="text-[#8E8A8A] mr-1">↳</span> : null}
        {cat.name}
      </td>
      <td className="px-4 py-3 text-sm text-[#8E8A8A]">/{cat.slug}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Button isIconOnly size="sm" variant="flat" aria-label="Sửa" onPress={() => openEdit(cat)}>
            <RiPencilLine size={16} />
          </Button>
          <Button isIconOnly size="sm" color="danger" variant="light" aria-label="Xóa" onPress={() => handleDelete(cat)}>
            <RiDeleteBinLine size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6 admin-surface">
      <AdminPageHeader
        title="Quản lý Danh mục"
        description="Bảng dạng cây — danh mục cha có thể mở rộng xem danh mục con."
        actions={
          <Button color="primary" className="text-[#1D1D1D] font-semibold" startContent={<RiAddLine />} onPress={openCreate}>
            Thêm danh mục
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <Input
          placeholder="Tìm danh mục..."
          value={search}
          onValueChange={setSearch}
          startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
          className="max-w-sm"
          classNames={adminInputClassNames}
        />
        {!search.trim() ? (
          <Select
            placeholder="Sắp xếp"
            selectedKeys={new Set([sortKey])}
            onSelectionChange={(keys) => setSortKey(String(Array.from(keys)[0] ?? 'name-asc') as SortKey)}
            className="max-w-xs"
            classNames={adminSelectClassNames}
          >
            <SelectItem key="name-asc">Tên A → Z</SelectItem>
            <SelectItem key="name-desc">Tên Z → A</SelectItem>
            <SelectItem key="code-asc">Mã A → Z</SelectItem>
            <SelectItem key="code-desc">Mã Z → A</SelectItem>
          </Select>
        ) : null}
      </div>

      <div className="rounded-xl border border-primary-200/70 bg-white dark:bg-[#2a2226] overflow-x-auto">
        {loading ? (
          <p className="text-sm text-[#8E8A8A] p-6">Đang tải...</p>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-primary-200/60 text-left text-xs uppercase tracking-wider text-[#8E8A8A]">
                <th className="px-4 py-3 w-12">STT</th>
                <th className="px-4 py-3 w-16">Ảnh</th>
                <th className="px-4 py-3 w-24">Mã</th>
                <th className="px-4 py-3">Tên danh mục</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rootCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#8E8A8A]">
                    Chưa có danh mục
                  </td>
                </tr>
              ) : (
                rootCategories.map((cat, index) => {
                  const kids = search.trim() ? [] : childrenOf(cat, categories);
                  const expanded = expandedParentId === cat.id;
                  return (
                    <Fragment key={cat.id}>
                      <tr className="border-b border-primary-100/60 hover:bg-primary-50/20">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            {kids.length > 0 ? (
                              <button
                                type="button"
                                className="p-1 rounded hover:bg-primary-100 text-[#1D1D1D]"
                                onClick={() => setExpandedParentId(expanded ? null : cat.id)}
                                aria-expanded={expanded}
                              >
                                {expanded ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
                              </button>
                            ) : (
                              <span className="w-6" />
                            )}
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="w-8 h-8 object-cover rounded-md shadow-sm" />
                          ) : (
                            <div className="w-8 h-8 bg-[#f5f5f5] dark:bg-[#1f1f1f] rounded-md border border-dashed border-gray-300"></div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono">{cat.code}</td>
                        <td className="px-4 py-3 text-sm font-medium">{cat.name}</td>
                        <td className="px-4 py-3 text-sm text-[#8E8A8A]">/{cat.slug}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <Button isIconOnly size="sm" variant="flat" onPress={() => openEdit(cat)}>
                              <RiPencilLine size={16} />
                            </Button>
                            <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDelete(cat)}>
                              <RiDeleteBinLine size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expanded ? kids.map((child) => renderRow(child, index, true)) : null}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={formModal.isOpen} 
        onOpenChange={(open) => {
          if (open) formModal.onOpen();
          else formModal.onClose();
        }} 
        size="lg"
      >
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">
                {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </ModalHeader>
              <ModalBody className="gap-4">
                <AdminImageUpload
                  label="Ảnh danh mục"
                  previewUrl={form.imageFile ? URL.createObjectURL(form.imageFile) : form.existingImageUrl}
                  onChange={(file) => {
                    if (!file) {
                      setForm({ ...form, imageFile: null, existingImageUrl: '' });
                    } else {
                      setForm({ ...form, imageFile: file });
                    }
                  }}
                />
                <Input
                  label={<RequiredLabel required>Mã</RequiredLabel>}
                  placeholder="VD: NB-01"
                  value={form.code}
                  onValueChange={(v) => setForm({ ...form, code: v })}
                  classNames={adminInputClassNames}
                />
                <Input
                  label={<RequiredLabel required>Tên</RequiredLabel>}
                  placeholder="VD: Nail Box Thiết Kế"
                  value={form.name}
                  onValueChange={(v) => setForm({ ...form, name: v })}
                  classNames={adminInputClassNames}
                />
                <Input
                  label={<RequiredLabel required>Slug</RequiredLabel>}
                  placeholder="VD: nail-box-thiet-ke"
                  value={form.slug}
                  onValueChange={(v) => setForm({ ...form, slug: v })}
                  classNames={adminInputClassNames}
                />
                <Select
                  label="Danh mục cha"
                  placeholder="Không có (danh mục cha)"
                  description="Để trống nếu đây là danh mục cha (cấp gốc). Chọn danh mục cha nếu tạo danh mục con."
                  selectedKeys={form.parentId ? new Set([form.parentId]) : new Set(['none'])}
                  onSelectionChange={(keys) => {
                    const val = String(Array.from(keys)[0] ?? 'none');
                    setForm({ ...form, parentId: val === 'none' ? '' : val });
                  }}
                  classNames={adminSelectClassNames}
                >
                  {[
                    <SelectItem key="none" textValue="Không có (danh mục cha)">
                      Không có (danh mục cha)
                    </SelectItem>,
                    ...parentOptions
                      .filter((p) => p.id !== editingId)
                      .map((p) => (
                        <SelectItem key={p.id}>{p.name}</SelectItem>
                      )),
                  ]}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Hủy</Button>
                <Button color="primary" className="text-[#1D1D1D]" isLoading={saving} onPress={handleSubmit}>Lưu</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => {
          if (open) deleteModal.onOpen();
          else {
            deleteModal.onClose();
            setDeleteTarget(null);
          }
        }}
        message={
          deleteTarget
            ? `Bạn có chắc muốn xóa danh mục "${deleteTarget.name}"? Hành động này không thể hoàn tác.`
            : 'Bạn có chắc muốn xóa danh mục này?'
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
