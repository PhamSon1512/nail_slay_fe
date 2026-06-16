import type { Route } from './+types/admin.articles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiAddLine, RiDeleteBinLine, RiPencilLine, RiSearchLine } from 'react-icons/ri';
import { AdminPageHeader, ConfirmDeleteModal } from '~/components';
import { AdminImageUpload } from '~/components/admin/AdminImageUpload';
import { RichTextEditor } from '~/components/admin/RichTextEditor';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import {
  createArticle,
  deleteArticle,
  fetchAdminArticles,
  updateArticle,
  type AdminArticle,
} from '~/utils/api/admin';
import { adminInputClassNames, adminSelectClassNames, adminTableClassNames } from '~/utils/adminForm';
import { formatDate } from '~/utils/format';

export const handle = { pageTitle: 'Quản lý Bài viết' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Bài viết - Admin Nailslay' }];

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  coverFile: File | null;
  existingCover: string | null;
  removeCover: boolean;
};

const emptyForm = (): FormState => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  coverFile: null,
  existingCover: null,
  removeCover: false,
});

function buildForm(data: FormState) {
  const fd = new FormData();
  fd.append('title', data.title.trim());
  fd.append('slug', data.slug.trim());
  fd.append('excerpt', data.excerpt.trim());
  fd.append('content', data.content);
  fd.append('status', data.status);
  if (data.coverFile) fd.append('cover', data.coverFile);
  if (data.removeCover) fd.append('remove_cover', 'true');
  return fd;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const formModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState<AdminArticle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        (a.excerpt ?? '').toLowerCase().includes(q),
    );
  }, [articles, search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminArticles({ limit: 100, search: search || undefined });
      setArticles(data.items);
    } catch {
      toast.error('Không tải được danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    formModal.onOpen();
  };

  const openEdit = (article: AdminArticle) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt ?? '',
      content: article.content ?? '',
      status: article.status,
      coverFile: null,
      existingCover: article.coverImageUrl,
      removeCover: false,
    });
    formModal.onOpen();
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Vui lòng nhập tiêu đề và slug');
      return;
    }
    setSaving(true);
    try {
      const fd = buildForm(form);
      if (editingId) {
        await updateArticle(editingId, fd);
        toast.success('Đã cập nhật bài viết');
      } else {
        await createArticle(fd);
        toast.success('Đã tạo bài viết');
      }
      formModal.onClose();
      await load();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (article: AdminArticle) => {
    setDeleteTarget(article);
    deleteModal.onOpen();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteArticle(deleteTarget.id);
      toast.success('Đã xóa bài viết');
      deleteModal.onClose();
      await load();
    } catch {
      // interceptor
    } finally {
      setDeleting(false);
    }
  };

  const coverPreview = form.coverFile ? URL.createObjectURL(form.coverFile) : form.removeCover ? null : form.existingCover;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bài viết"
        description="Tạo và quản lý bài viết hiển thị trên cửa hàng."
        actions={
          <Button color="primary" className="text-[#1D1D1D] font-semibold" startContent={<RiAddLine />} onPress={openCreate}>
            Thêm bài viết
          </Button>
        }
      />

      <Input
        value={search}
        onValueChange={setSearch}
        placeholder="Tìm theo tiêu đề hoặc slug..."
        startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
        className="max-w-md"
        classNames={adminInputClassNames}
      />

      <Table aria-label="Danh sách bài viết" classNames={adminTableClassNames}>
        <TableHeader>
          <TableColumn>Tiêu đề</TableColumn>
          <TableColumn>Slug</TableColumn>
          <TableColumn>Trạng thái</TableColumn>
          <TableColumn>Ngày đăng</TableColumn>
          <TableColumn align="end">Thao tác</TableColumn>
        </TableHeader>
        <TableBody emptyContent={loading ? 'Đang tải...' : 'Chưa có bài viết'} items={filtered}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[240px] truncate">{item.title}</TableCell>
              <TableCell className="text-[#8E8A8A]">/{item.slug}</TableCell>
              <TableCell>
                <Chip size="sm" color={item.status === 'published' ? 'success' : 'default'} variant="flat">
                  {item.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                </Chip>
              </TableCell>
              <TableCell>{item.publishedAt ? formatDate(item.publishedAt) : '—'}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button isIconOnly size="sm" variant="light" aria-label="Sửa" onPress={() => openEdit(item)}>
                    <RiPencilLine size={16} />
                  </Button>
                  <Button isIconOnly size="sm" color="danger" variant="light" aria-label="Xóa" onPress={() => confirmDelete(item)}>
                    <RiDeleteBinLine size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={formModal.isOpen} onOpenChange={formModal.onOpenChange} size="3xl" scrollBehavior="inside">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader>{editingId ? 'Sửa bài viết' : 'Thêm bài viết'}</ModalHeader>
              <ModalBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={<RequiredLabel required>Tiêu đề</RequiredLabel>}
                    value={form.title}
                    onValueChange={(v) => setForm({ ...form, title: v })}
                    classNames={adminInputClassNames}
                  />
                  <Input
                    label={<RequiredLabel required>Slug</RequiredLabel>}
                    value={form.slug}
                    onValueChange={(v) => setForm({ ...form, slug: v })}
                    classNames={adminInputClassNames}
                  />
                  <Input
                    label="Tóm tắt"
                    value={form.excerpt}
                    onValueChange={(v) => setForm({ ...form, excerpt: v })}
                    className="md:col-span-2"
                    classNames={adminInputClassNames}
                  />
                  <Select
                    label="Trạng thái"
                    selectedKeys={new Set([form.status])}
                    onSelectionChange={(keys) =>
                      setForm({ ...form, status: (String(Array.from(keys)[0] ?? 'draft') as 'draft' | 'published') })
                    }
                    classNames={adminSelectClassNames}
                  >
                    <SelectItem key="draft">Nháp</SelectItem>
                    <SelectItem key="published">Xuất bản</SelectItem>
                  </Select>
                </div>

                <AdminImageUpload
                  label="Ảnh bìa"
                  previewUrl={coverPreview ?? undefined}
                  previewClassName="h-16 w-28 rounded-xl border border-primary-200 object-cover"
                  onChange={(file) =>
                    setForm({
                      ...form,
                      coverFile: file,
                      removeCover: !file,
                      existingCover: file ? form.existingCover : null,
                    })
                  }
                  onClear={() => setForm({ ...form, coverFile: null, existingCover: null, removeCover: true })}
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">Nội dung</p>
                  <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" className="text-[#1D1D1D]" isLoading={saving} onPress={handleSubmit}>
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        title="Xóa bài viết"
        message={deleteTarget ? `Bạn có chắc muốn xóa "${deleteTarget.title}"?` : ''}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
