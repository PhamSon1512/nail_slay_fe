import type { Route } from './+types/admin.complaints';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiRefreshLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { AdminPageHeader } from '~/components';
import { fetchAdminComplaints, resolveAdminComplaint } from '~/utils/api/admin';
import { adminTextareaClassNames } from '~/utils/adminForm';
import { formatDateTime } from '~/utils/format';

export const handle = { pageTitle: 'Khiếu nại' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Khiếu nại - Admin Nailslay' }];

type ComplaintRow = {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  adminResponse?: string | null;
  imageUrls?: string[];
  createdAt?: string;
};

function mapComplaint(raw: Record<string, unknown>): ComplaintRow {
  let imageUrls: string[] = [];
  if (Array.isArray(raw.imageUrls)) imageUrls = raw.imageUrls as string[];
  else if (typeof raw.image_urls === 'string') {
    try {
      imageUrls = JSON.parse(raw.image_urls);
    } catch {
      imageUrls = [];
    }
  }
  return {
    id: String(raw.id),
    orderId: String(raw.orderId ?? raw.order_id ?? ''),
    reason: String(raw.reason ?? ''),
    status: String(raw.status ?? 'OPEN'),
    adminResponse: (raw.adminResponse ?? raw.admin_response) as string | null | undefined,
    imageUrls,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
  };
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<ComplaintRow | null>(null);
  const [response, setResponse] = useState('');
  const resolveModal = useDisclosure();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminComplaints();
      setComplaints(data.map((item) => mapComplaint(item)));
    } catch {
      toast.error('Không tải được khiếu nại');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openResolve = (item: ComplaintRow) => {
    setSelected(item);
    setResponse(item.adminResponse ?? '');
    resolveModal.onOpen();
  };

  const handleResolve = async () => {
    if (!selected || !response.trim()) {
      toast.error('Vui lòng nhập phản hồi admin');
      return;
    }
    setSaving(true);
    try {
      await resolveAdminComplaint(selected.id, response.trim());
      toast.success('Đã giải quyết khiếu nại');
      resolveModal.onClose();
      setSelected(null);
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
        title="Xử lý khiếu nại"
        description="Danh sách khiếu nại từ khách hàng sau khi nhận hàng."
        actions={
          <Button variant="flat" startContent={<RiRefreshLine />} onPress={load}>
            Làm mới
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
      ) : complaints.length === 0 ? (
        <Card shadow="none" className="border border-dashed border-primary-200">
          <CardBody className="text-center text-sm text-[#8E8A8A] py-10">Chưa có khiếu nại nào.</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((item) => (
            <Card key={item.id} shadow="none" className="border border-primary-200/70 bg-white dark:bg-[#2a2226]">
              <CardBody className="gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color={item.status === 'OPEN' ? 'warning' : 'success'} variant="flat">
                      {item.status === 'OPEN' ? 'Chờ xử lý' : 'Đã giải quyết'}
                    </Chip>
                    <Link to={`/admin/orders?orderId=${item.orderId}`} className="text-sm font-mono text-primary-600 hover:underline">
                      Đơn #{item.orderId.slice(0, 8)}
                    </Link>
                  </div>
                  <span className="text-xs text-[#8E8A8A]">{item.createdAt ? formatDateTime(item.createdAt) : ''}</span>
                </div>
                <p className="text-sm text-[#1D1D1D] dark:text-[#FFF3F5]">{item.reason}</p>
                {item.imageUrls?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {item.imageUrls.map((url) => (
                      <img key={url} src={url} alt="" className="w-16 h-16 object-cover rounded border" />
                    ))}
                  </div>
                ) : null}
                {item.adminResponse ? (
                  <p className="text-sm text-[#8E8A8A]"><strong>Phản hồi:</strong> {item.adminResponse}</p>
                ) : null}
                {item.status === 'OPEN' ? (
                  <Button size="sm" color="primary" className="text-[#1D1D1D] w-fit" onPress={() => openResolve(item)}>
                    Giải quyết
                  </Button>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={resolveModal.isOpen} onOpenChange={resolveModal.onOpenChange} size="lg">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">Giải quyết khiếu nại</ModalHeader>
              <ModalBody className="gap-3">
                {selected ? (
                  <p className="text-sm text-[#8E8A8A]">Lý do khách: {selected.reason}</p>
                ) : null}
                <Textarea
                  label="Phản hồi admin"
                  value={response}
                  onValueChange={setResponse}
                  minRows={4}
                  classNames={adminTextareaClassNames}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={saving}>Hủy</Button>
                <Button color="primary" className="text-[#1D1D1D]" isLoading={saving} onPress={handleResolve}>
                  Xác nhận giải quyết
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
