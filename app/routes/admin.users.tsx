import type { Route } from './+types/admin.users';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiEditLine, RiRefreshLine, RiSearchLine } from 'react-icons/ri';
import { AdminPageHeader } from '~/components';
import { fetchAdminUsers, updateAdminUser } from '~/utils/api/admin';
import { adminInputClassNames, adminTableClassNames, adminTextareaClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Quản lý Người dùng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Người dùng - Admin Nailslay' }];

type UserRow = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  accountStatus: 'active' | 'blocked';
  blockReason: string | null;
};

function mapUser(raw: Record<string, unknown>): UserRow {
  return {
    id: String(raw.id),
    email: String(raw.email ?? ''),
    fullName: (raw.fullName ?? raw.full_name ?? null) as string | null,
    phone: (raw.phone ?? null) as string | null,
    role: String(raw.role ?? 'user'),
    accountStatus: (String(raw.accountStatus ?? raw.account_status ?? 'active') as 'active' | 'blocked'),
    blockReason: (raw.blockReason ?? raw.block_reason ?? null) as string | null,
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const editModal = useDisclosure();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers({ search: search || undefined });
      setUsers(data.items.map((item) => mapUser(item)));
    } catch {
      toast.error('Không tải được người dùng');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = (user: UserRow) => {
    setEditUser(user);
    setBlocked(user.accountStatus === 'blocked');
    setBlockReason(user.blockReason ?? '');
    editModal.onOpen();
  };

  const handleSave = async () => {
    if (!editUser) return;
    if (blocked && !blockReason.trim()) {
      toast.error('Vui lòng nhập lý do chặn');
      return;
    }
    setSaving(true);
    try {
      await updateAdminUser(editUser.id, {
        accountStatus: blocked ? 'blocked' : 'active',
        blockReason: blocked ? blockReason.trim() : undefined,
      });
      toast.success(blocked ? 'Đã chặn người dùng' : 'Đã bỏ chặn người dùng');
      editModal.onClose();
      await load();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 admin-surface">
      <AdminPageHeader
        title="Quản lý Người dùng"
        description="Xem và cập nhật trạng thái tài khoản khách hàng."
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
        <Table aria-label="Danh sách người dùng" classNames={adminTableClassNames}>
          <TableHeader>
            <TableColumn>Email</TableColumn>
            <TableColumn>Họ tên</TableColumn>
            <TableColumn>Vai trò</TableColumn>
            <TableColumn>Trạng thái</TableColumn>
            <TableColumn>Điện thoại</TableColumn>
            <TableColumn>Thao tác</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Không có người dùng">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName ?? '—'}</TableCell>
                <TableCell>
                  <Chip size="sm" color={user.role === 'admin' ? 'primary' : 'default'}>
                    {user.role}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={user.accountStatus === 'blocked' ? 'danger' : 'success'} variant="flat">
                    {user.accountStatus === 'blocked' ? 'Đã chặn' : 'Hoạt động'}
                  </Chip>
                </TableCell>
                <TableCell>{user.phone ?? '—'}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    aria-label="Sửa"
                    isDisabled={user.role === 'admin'}
                    onPress={() => openEdit(user)}
                  >
                    <RiEditLine size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={editModal.isOpen} onOpenChange={editModal.onOpenChange} size="lg">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">
                Cập nhật trạng thái — {editUser?.email}
              </ModalHeader>
              <ModalBody className="gap-4">
                <div className="flex items-center gap-3">
                  <Switch isSelected={blocked} onValueChange={setBlocked} aria-label="Chặn tài khoản" />
                  <span className="text-sm text-[#1D1D1D] dark:text-[#FFF3F5]">Chặn tài khoản</span>
                </div>
                {blocked ? (
                  <Textarea
                    label="Lý do chặn"
                    value={blockReason}
                    onValueChange={setBlockReason}
                    minRows={3}
                    classNames={adminTextareaClassNames}
                  />
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={saving}>Hủy</Button>
                <Button color="primary" className="text-[#1D1D1D]" isLoading={saving} onPress={handleSave}>
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
