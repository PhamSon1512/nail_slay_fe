import type { Route } from './+types/admin.users';
import { useCallback, useEffect, useState } from 'react';
import { Button, Chip, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiRefreshLine, RiSearchLine } from 'react-icons/ri';
import { AdminPageHeader } from '~/components';
import { fetchAdminUsers } from '~/utils/api/admin';
import { adminInputClassNames, adminTableClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Quản lý người dùng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Người dùng - Admin Nailslay' }];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers({ search: search || undefined });
      setUsers(data.items);
    } catch {
      toast.error('Không tải được người dùng');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6 admin-surface">
      <AdminPageHeader
        title="Quản lý người dùng"
        actions={
          <Button variant="flat" startContent={<RiRefreshLine />} onPress={load}>
            Làm mới
          </Button>
        }
      />

      <Input
        placeholder="Tìm theo email..."
        value={search}
        onValueChange={setSearch}
        startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
        className="max-w-sm"
        classNames={adminInputClassNames}
      />

      {loading ? (
        <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
      ) : (
        <Table aria-label="Danh sách người dùng">
          <TableHeader>
            <TableColumn>Email</TableColumn>
            <TableColumn>Họ tên</TableColumn>
            <TableColumn>Vai trò</TableColumn>
            <TableColumn>Điện thoại</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Không có người dùng">
            {users.map((user) => (
              <TableRow key={String(user.id)}>
                <TableCell>{String(user.email ?? '')}</TableCell>
                <TableCell>{String(user.fullName ?? '—')}</TableCell>
                <TableCell>
                  <Chip size="sm" color={user.role === 'admin' ? 'primary' : 'default'}>
                    {String(user.role ?? 'user')}
                  </Chip>
                </TableCell>
                <TableCell>{String(user.phone ?? '—')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
