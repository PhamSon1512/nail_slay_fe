import type { Route } from './+types/admin.articles.categories';
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
import {
  createArticleCategory,
  deleteArticleCategory,
  fetchArticleCategories,
  updateArticleCategory,
  type ArticleCategory,
} from '~/utils/api/admin';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { adminInputClassNames, adminSelectClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Danh mục Bài viết' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Danh mục Bài viết - Admin Nailslay' }];

type FormState = {
  name: string;
  slug: string;
  parentId: string;
};

type SortKey = 'name-asc' | 'name-desc';

const emptyForm = (): FormState => ({
  name: '',
  slug: '',
  parentId: '',
});

function isRootCategory(cat: ArticleCategory) {
  return !cat.parentId;
}

function childrenOf(parent: ArticleCategory, all: ArticleCategory[]) {
  return all.filter((c) => c.parentId === parent.id);
}

export default function AdminArticleCategoriesPage() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
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
      setCategories(await fetchArticleCategories());
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
          c.slug.toLowerCase().includes(q),
      );
    } else {
      roots.sort((a, b) => {
        switch (sortKey) {
          case 'name-desc':
            return b.name.localeCompare(a.name, 'vi');
          default:
            return a.name.localeCompare(b.name, 'vi');
        }
      });
    }
    return roots;
  }, [categories, search, sortKey]);

  const parentOptions = categories.filter(isRootCategory);

  const toPayload = (data: FormState) => {
    return {
      name: data.name,
      slug: data.slug,
      parent_id: data.parentId || undefined,
    };
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    formModal.onOpen();
  };

  const openEdit = (cat: ArticleCategory) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId ?? '',
    });
    formModal.onOpen();
  };

  const requestDelete = (cat: ArticleCategory) => {
    setDeleteTarget({ id: cat.id, name: cat.name });
    deleteModal.onOpen();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteArticleCategory(deleteTarget.id);
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
    if (!form.name || !form.slug) {
      toast.error('Vui lòng điền tên và slug');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateArticleCategory(editingId, toPayload(form));
        toast.success('Đã cập nhật danh mục');
      } else {
        await createArticleCategory(toPayload(form));
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

  const handleDelete = (cat: ArticleCategory) => {
    requestDelete(cat);
  };

  const renderRow = (cat: ArticleCategory, index: number, isChild = false) => (
    <tr key={cat.id} className={isChild ? 'bg-primary-50/30 dark:bg-[#241e22]' : 'hover:bg-primary-50/20'}>
      <td className="px-4 py-3 text-sm">{isChild ? '' : index + 1}</td>
      <td className="px-4 py-3 text-sm font-medium">
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
                <th className="px-4 py-3">Tên danh mục</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rootCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-[#8E8A8A]">
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
