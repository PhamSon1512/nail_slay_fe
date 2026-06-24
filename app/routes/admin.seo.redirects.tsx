import type { Route } from './+types/admin.seo.redirects';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiAddLine, RiDeleteBinLine, RiPencilLine, RiRefreshLine } from 'react-icons/ri';
import { AdminPageHeader } from '~/components';
import {
  createRedirect,
  deleteRedirect,
  fetchRedirects,
  updateRedirect,
  type UrlRedirect,
} from '~/utils/api/admin';
import { adminInputClassNames, adminTableClassNames } from '~/utils/adminForm';
import { formatDateTime } from '~/utils/format';

export const handle = { pageTitle: 'Redirects' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Redirects - Admin Nailslay' }];

type FormState = {
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  enabled: boolean;
};

const emptyForm = (): FormState => ({
  fromPath: '',
  toPath: '',
  statusCode: 301,
  enabled: true,
});

function mapRedirect(raw: Record<string, unknown>): UrlRedirect {
  return {
    id: String(raw.id),
    fromPath: String(raw.fromPath ?? raw.from_path ?? ''),
    toPath: String(raw.toPath ?? raw.to_path ?? ''),
    statusCode: Number(raw.statusCode ?? raw.status_code ?? 301) as 301 | 302,
    enabled: Number(raw.enabled ?? 1) !== 0,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
  };
}

export default function AdminSeoRedirectsPage() {
  const [searchParams] = useSearchParams();
  const [redirects, setRedirects] = useState<UrlRedirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const modal = useDisclosure();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRedirects();
      setRedirects(data.map((row) => mapRedirect(row as unknown as Record<string, unknown>)));
    } catch {
      toast.error('Không tải được redirects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const from = searchParams.get('from');
    if (from) {
      setForm((f) => ({ ...f, fromPath: from }));
      setEditId(null);
      modal.onOpen();
    }
  }, [searchParams, modal]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm());
    modal.onOpen();
  };

  const openEdit = (row: UrlRedirect) => {
    setEditId(row.id);
    setForm({
      fromPath: row.fromPath,
      toPath: row.toPath,
      statusCode: row.statusCode,
      enabled: row.enabled,
    });
    modal.onOpen();
  };

  const handleSave = async () => {
    if (!form.fromPath.trim() || !form.toPath.trim()) {
      toast.error('Nhập đầy đủ from và to path');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await updateRedirect(editId, form);
        toast.success('Đã cập nhật redirect');
      } else {
        await createRedirect(form);
        toast.success('Đã tạo redirect');
      }
      modal.onClose();
      await load();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRedirect(id);
      toast.success('Đã xóa redirect');
      await load();
    } catch {
      // interceptor
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Redirect Manager"
        description="Quản lý chuyển hướng 301/302 cho URL cũ."
        actions={
          <>
            <Button variant="flat" startContent={<RiRefreshLine />} onPress={() => void load()} isLoading={loading}>
              Làm mới
            </Button>
            <Button color="primary" className="text-[#1D1D1D] font-semibold" startContent={<RiAddLine />} onPress={openCreate}>
              Thêm redirect
            </Button>
          </>
        }
      />
      <div className="p-4 md:p-6">
      <Table aria-label="Redirects" classNames={adminTableClassNames}>
        <TableHeader>
          <TableColumn>Từ</TableColumn>
          <TableColumn>Đến</TableColumn>
          <TableColumn>Mã</TableColumn>
          <TableColumn>Bật</TableColumn>
          <TableColumn>Tạo lúc</TableColumn>
          <TableColumn align="end">Thao tác</TableColumn>
        </TableHeader>
        <TableBody emptyContent={loading ? 'Đang tải...' : 'Chưa có redirect'} items={redirects}>
          {(row) => (
            <TableRow key={row.id}>
              <TableCell>
                <code className="text-xs">{row.fromPath}</code>
              </TableCell>
              <TableCell>
                <code className="text-xs">{row.toPath}</code>
              </TableCell>
              <TableCell>{row.statusCode}</TableCell>
              <TableCell>{row.enabled ? 'Có' : 'Không'}</TableCell>
              <TableCell className="text-xs whitespace-nowrap">{formatDateTime(row.createdAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button isIconOnly size="sm" variant="light" onPress={() => openEdit(row)}>
                    <RiPencilLine />
                  </Button>
                  <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => void handleDelete(row.id)}>
                    <RiDeleteBinLine />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange} size="lg">
        <ModalContent>
          <ModalHeader>{editId ? 'Sửa redirect' : 'Tạo redirect'}</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="Từ path"
              placeholder="/old-url"
              value={form.fromPath}
              onValueChange={(v) => setForm((f) => ({ ...f, fromPath: v }))}
              classNames={adminInputClassNames}
            />
            <Input
              label="Đến path hoặc URL"
              placeholder="/articles/slug hoặc https://..."
              value={form.toPath}
              onValueChange={(v) => setForm((f) => ({ ...f, toPath: v }))}
              classNames={adminInputClassNames}
            />
            <Select
              label="Mã HTTP"
              selectedKeys={[String(form.statusCode)]}
              onChange={(e) => setForm((f) => ({ ...f, statusCode: Number(e.target.value) as 301 | 302 }))}
              classNames={adminInputClassNames}
            >
              <SelectItem key="301">301 — Permanent</SelectItem>
              <SelectItem key="302">302 — Temporary</SelectItem>
            </Select>
            <Switch isSelected={form.enabled} onValueChange={(v) => setForm((f) => ({ ...f, enabled: v }))}>
              Kích hoạt
            </Switch>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={modal.onClose}>
              Quay lại
            </Button>
            <Button color="primary" isLoading={saving} onPress={() => void handleSave()}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
    </>
  );
}
