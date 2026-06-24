import type { Route } from './+types/admin.articles._index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Chip, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiAddLine, RiDeleteBinLine, RiPencilLine, RiSearchLine } from 'react-icons/ri';
import { ConfirmDeleteModal } from '~/components';
import { deleteArticle, fetchAdminArticles, type AdminArticle } from '~/utils/api/admin';
import { adminInputClassNames, adminTableClassNames } from '~/utils/adminForm';
import { formatDate } from '~/utils/format';

export const handle = { pageTitle: 'Bài viết' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Bài viết - Admin Nailslay' }];

export default function AdminArticlesPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[color:var(--color-brand-muted)] mb-1">Bài viết - SEO › Bài viết</p>
          <h1 className="text-2xl font-bold text-[color:var(--color-brand-contrast)]">Bài viết</h1>
        </div>
        <Button
          as={Link}
          to="/admin/articles/new"
          color="primary"
          className="text-[#1D1D1D] font-semibold"
          startContent={<RiAddLine />}
        >
          Thêm Bài Viết
        </Button>
      </div>

      <div className="space-y-4">
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
          <TableColumn>SEO</TableColumn>
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
                {item.seoScore != null ? (
                  <Chip size="sm" color={item.seoScore >= 80 ? 'success' : item.seoScore >= 50 ? 'warning' : 'danger'} variant="flat">
                    {item.seoScore}/100
                  </Chip>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                <Chip size="sm" color={item.status === 'published' ? 'success' : 'default'} variant="flat">
                  {item.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                </Chip>
              </TableCell>
              <TableCell>{item.publishedAt ? formatDate(item.publishedAt) : '—'}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Sửa"
                    onPress={() => navigate(`/admin/articles/${item.id}`)}
                  >
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

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        title="Xóa bài viết"
        message={deleteTarget ? `Bạn có chắc muốn xóa "${deleteTarget.title}"?` : ''}
        onConfirm={handleDelete}
        loading={deleting}
      />
      </div>
    </div>
  );
}
