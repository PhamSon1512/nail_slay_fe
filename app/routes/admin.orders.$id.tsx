import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

/** Chuyển link cũ /admin/orders/:id sang danh sách + mở popup chi tiết */
export default function AdminOrderDetailRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/admin/orders', { replace: true });
      return;
    }
    navigate(`/admin/orders?orderId=${encodeURIComponent(id)}`, { replace: true });
  }, [id, navigate]);

  return null;
}
