import type { Route } from './+types/admin.seo.404';
import { useCallback, useEffect, useState } from 'react';
import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiDeleteBinLine, RiExternalLinkLine, RiRefreshLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { AdminPageHeader } from '~/components';
import { deleteNotFoundLog, fetchNotFoundLogs, type NotFoundLog } from '~/utils/api/admin';
import { adminTableClassNames } from '~/utils/adminForm';
import { formatDateTime } from '~/utils/format';

export const handle = { pageTitle: '404 Monitor' };
export const meta = (_: Route.MetaArgs) => [{ title: '404 Monitor - Admin Nailslay' }];

function mapLog(raw: Record<string, unknown>): NotFoundLog {
  return {
    id: String(raw.id),
    path: String(raw.path ?? ''),
    referrer: (raw.referrer ?? raw.referrer) as string | null,
    userAgent: (raw.userAgent ?? raw.user_agent) as string | null,
    hitCount: Number(raw.hitCount ?? raw.hit_count ?? 1),
    firstSeen: String(raw.firstSeen ?? raw.first_seen ?? ''),
    lastSeen: String(raw.lastSeen ?? raw.last_seen ?? ''),
  };
}

export default function AdminSeo404Page() {
  const [logs, setLogs] = useState<NotFoundLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotFoundLogs();
      setLogs(data.map((row) => mapLog(row as unknown as Record<string, unknown>)));
    } catch {
      toast.error('Không tải được log 404');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteNotFoundLog(id);
      toast.success('Đã xóa log');
      await load();
    } catch {
      // interceptor
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="404 Monitor"
        description="Theo dõi URL không tồn tại và tạo redirect 301."
        actions={
          <Button variant="flat" startContent={<RiRefreshLine />} onPress={() => void load()} isLoading={loading}>
            Làm mới
          </Button>
        }
      />
      <div className="p-4 md:p-6">
      <Table aria-label="404 logs" classNames={adminTableClassNames}>
        <TableHeader>
          <TableColumn>URL</TableColumn>
          <TableColumn>Lượt truy cập</TableColumn>
          <TableColumn>Lần đầu</TableColumn>
          <TableColumn>Gần nhất</TableColumn>
          <TableColumn>Referrer</TableColumn>
          <TableColumn align="end">Thao tác</TableColumn>
        </TableHeader>
        <TableBody emptyContent={loading ? 'Đang tải...' : 'Chưa có log 404'} items={logs}>
          {(row) => (
            <TableRow key={row.id}>
              <TableCell>
                <code className="text-xs">{row.path}</code>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {row.hitCount}
                </Chip>
              </TableCell>
              <TableCell className="text-xs whitespace-nowrap">{formatDateTime(row.firstSeen)}</TableCell>
              <TableCell className="text-xs whitespace-nowrap">{formatDateTime(row.lastSeen)}</TableCell>
              <TableCell className="max-w-[160px] truncate text-xs text-[#8E8A8A]">{row.referrer ?? '—'}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    as={Link}
                    to={`/admin/seo/redirects?from=${encodeURIComponent(row.path)}`}
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<RiExternalLinkLine />}
                  >
                    Redirect
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    isLoading={deletingId === row.id}
                    onPress={() => void handleDelete(row.id)}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </>
  );
}
