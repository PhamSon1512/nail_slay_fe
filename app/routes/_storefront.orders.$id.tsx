import type { Route } from './+types/_storefront.orders.$id';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiBankLine } from 'react-icons/ri';
import { Link, useNavigate, useParams } from 'react-router';
import { useRequireAuth } from '~/hooks';
import { ImagePreviewClearButton } from '~/components/admin/AdminImageUpload';
import {
  fetchUserOrder,
  updateUserOrderStatus,
  uploadComplaintImage,
  type UserOrderDetail,
} from '~/utils/api/orders';
import { fetchPublicSettings } from '~/utils/api/settings';
import { formatDateTime, formatVND } from '~/utils/format';
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE,
  USER_ACTION_LABELS,
  getUserNextStatuses,
  paymentStatusLabel,
  type OrderStatus,
} from '~/utils/orderStatus';

export const handle = { pageTitle: 'Chi tiết đơn hàng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Chi tiết đơn hàng - Nailslay' }];

export default function UserOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useRequireAuth();
  const [order, setOrder] = useState<UserOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [bankInfo, setBankInfo] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState('');
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintReason, setComplaintReason] = useState('');
  const [complaintImages, setComplaintImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadOrder = async () => {
    if (!id) return;
    const data = await fetchUserOrder(id);
    setOrder(data);
  };

  useEffect(() => {
    if (!authUser || !id) return;
    fetchUserOrder(id)
      .then(setOrder)
      .catch((err: { response?: { status?: number } }) => {
        if (err?.response?.status === 404) {
          setNotFound(true);
          return;
        }
        toast.error('Không tải được đơn hàng');
        navigate('/orders');
      })
      .finally(() => setLoading(false));
  }, [authUser, id, navigate]);

  useEffect(() => {
    if (!order || order.status !== 'PENDING_PAYMENT') return;
    fetchPublicSettings()
      .then((data) => {
        const info = { ...(data.bank_info ?? {}) };
        if (info.transfer_content) {
          info.transfer_content = info.transfer_content.replace('{order_id}', order.id);
        } else {
          info.transfer_content = order.id;
        }
        setBankInfo(info);
        setQrUrl(info.qr_code_url ?? '');
      })
      .catch(() => {
        setBankInfo({});
        setQrUrl('');
      });
  }, [order]);

  const timelineIndex = useMemo(
    () => (order ? ORDER_TIMELINE.indexOf(order.status) : -1),
    [order],
  );

  const handleUserAction = async (status: 'RECEIVED' | 'COMPLAINED') => {
    if (!id) return;
    if (status === 'COMPLAINED') {
      setComplaintOpen(true);
      return;
    }
    setUpdating(true);
    try {
      await updateUserOrderStatus(id, { status });
      toast.success('Đã cập nhật trạng thái đơn hàng');
      await loadOrder();
    } catch {
      // interceptor
    } finally {
      setUpdating(false);
    }
  };

  const submitComplaint = async () => {
    if (!id || !complaintReason.trim()) {
      toast.error('Vui lòng nhập lý do khiếu nại');
      return;
    }
    setUpdating(true);
    try {
      await updateUserOrderStatus(id, {
        status: 'COMPLAINED',
        reason: complaintReason.trim(),
        image_urls: complaintImages,
      });
      toast.success('Đã gửi khiếu nại');
      setComplaintOpen(false);
      setComplaintReason('');
      setComplaintImages([]);
      await loadOrder();
    } catch {
      // interceptor
    } finally {
      setUpdating(false);
    }
  };

  const handleComplaintImage = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadComplaintImage(file);
      setComplaintImages((prev) => [...prev, url]);
    } catch {
      // interceptor
    } finally {
      setUploadingImage(false);
    }
  };

  if (!authUser) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="section-title">Vui lòng đăng nhập</h1>
        <Button as={Link} to="/login" color="primary" className="text-[#1D1D1D] font-semibold">
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="container py-20 text-center text-sm text-[#8E8A8A]">Đang tải...</div>;
  }

  if (notFound || !order) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="section-title">Không tìm thấy đơn hàng</h1>
        <p className="text-sm text-[#8E8A8A]">Đơn hàng không tồn tại hoặc bạn không có quyền xem.</p>
        <Button as={Link} to="/orders" color="primary" className="text-[#1D1D1D] font-semibold">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const nextActions = getUserNextStatuses(order.status);

  return (
    <div className="container py-10 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button as={Link} to="/orders" variant="flat" isIconOnly aria-label="Quay lại">
          <RiArrowLeftLine size={18} />
        </Button>
        <div>
          <h1 className="section-title mb-0">Đơn hàng #{order.id.slice(0, 8)}</h1>
          <p className="text-xs text-[#8E8A8A]">{formatDateTime(order.createdAt)}</p>
        </div>
        <Chip size="sm" variant="flat" color="primary" className="ml-auto">
          {ORDER_STATUS_LABELS[order.status]}
        </Chip>
      </div>

      <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
        <CardBody className="space-y-3">
          <p className="text-sm font-semibold">Tiến trình đơn hàng</p>
          <div className="flex flex-wrap gap-2">
            {ORDER_TIMELINE.map((step, index) => {
              const active = timelineIndex >= index && order.status !== 'CANCELLED';
              return (
                <Chip
                  key={step}
                  size="sm"
                  variant={active ? 'solid' : 'flat'}
                  color={active ? 'primary' : 'default'}
                >
                  {ORDER_STATUS_LABELS[step]}
                </Chip>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {order.status === 'PENDING_PAYMENT' ? (
        <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2">
              <RiBankLine size={18} />
              <p className="font-semibold">Thanh toán chuyển khoản</p>
            </div>
            <p className="text-sm text-[#8E8A8A]">
              Chuyển <strong>{formatVND(order.totalAmount)}</strong> theo thông tin bên dưới. Admin sẽ xác nhận thanh toán.
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-[#8E8A8A]">Ngân hàng</span>
              <span className="font-semibold">{bankInfo.bank_name ?? '—'}</span>
              <span className="text-[#8E8A8A]">Số TK</span>
              <span className="font-mono font-bold">{bankInfo.account_number ?? '—'}</span>
              <span className="text-[#8E8A8A]">Chủ TK</span>
              <span className="font-semibold">{bankInfo.account_name ?? '—'}</span>
              <span className="text-[#8E8A8A]">Nội dung CK</span>
              <span className="font-semibold break-all">{bankInfo.transfer_content ?? order.id}</span>
            </div>
            {qrUrl ? (
              <div className="flex justify-center pt-2">
                <img src={qrUrl} alt="QR thanh toán" className="w-56 h-56 sm:w-64 sm:h-64 object-contain" />
              </div>
            ) : null}
          </CardBody>
        </Card>
      ) : null}

      <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
        <CardBody className="space-y-3 text-sm">
          <p><span className="text-[#8E8A8A]">Thanh toán:</span> Chuyển khoản — {paymentStatusLabel(order.status)}</p>
          {order.address?.detail ? (
            <p><span className="text-[#8E8A8A]">Địa chỉ giao:</span> {order.address.detail}</p>
          ) : null}
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]">
        <CardBody className="space-y-4">
          <p className="font-semibold">Sản phẩm</p>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {item.product.imageUrls[0] ? (
                  <img src={item.product.imageUrls[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-primary-200" />
                ) : null}
                <div className="min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-[#8E8A8A]">x{item.quantity}</p>
                </div>
              </div>
              <span className="text-sm font-semibold shrink-0">{formatVND(item.price * item.quantity)}</span>
            </div>
          ))}
          <Divider />
          <div className="flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span>{formatVND(order.totalAmount)}</span>
          </div>
        </CardBody>
      </Card>

      {order.complaint ? (
        <Card shadow="none" className="border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardBody className="space-y-2 text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Khiếu nại</p>
            <p>{order.complaint.reason}</p>
            {order.complaint.adminResponse ? (
              <p className="text-[#8E8A8A]"><strong>Phản hồi:</strong> {order.complaint.adminResponse}</p>
            ) : null}
          </CardBody>
        </Card>
      ) : null}

      {nextActions.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {nextActions.map((action) => (
            <Button
              key={action}
              color={action === 'COMPLAINED' ? 'danger' : 'primary'}
              variant={action === 'COMPLAINED' ? 'flat' : 'solid'}
              isLoading={updating}
              className={action === 'RECEIVED' ? 'text-[#1D1D1D] font-semibold' : undefined}
              onPress={() => void handleUserAction(action as 'RECEIVED' | 'COMPLAINED')}
            >
              {USER_ACTION_LABELS[action as OrderStatus]}
            </Button>
          ))}
        </div>
      ) : null}

      <Modal isOpen={complaintOpen} onOpenChange={setComplaintOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Gửi khiếu nại</ModalHeader>
              <ModalBody className="space-y-4">
                <Textarea
                  label="Lý do khiếu nại"
                  isRequired
                  minRows={3}
                  value={complaintReason}
                  onValueChange={setComplaintReason}
                  variant="bordered"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ảnh minh chứng (tùy chọn)</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={(e) => void handleComplaintImage(e.target.files?.[0] ?? null)}
                  />
                  {complaintImages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {complaintImages.map((url) => (
                        <div key={url} className="relative inline-block">
                          <img src={url} alt="" className="h-16 w-16 rounded-lg border object-cover" />
                          <ImagePreviewClearButton
                            onClear={() =>
                              setComplaintImages((prev) => prev.filter((item) => item !== url))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Hủy</Button>
                <Button color="danger" isLoading={updating} onPress={() => void submitComplaint()}>
                  Gửi khiếu nại
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
