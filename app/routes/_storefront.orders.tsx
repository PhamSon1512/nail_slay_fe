import type { Route } from './+types/_storefront.orders';
import { useEffect, useState } from 'react';
import { Button, Chip, Link as HeroLink } from '@heroui/react';
import { Link } from 'react-router';
import { useRequireAuth } from '~/hooks';
import { fetchUserOrders, type UserOrder } from '~/utils/api/orders';
import { ORDER_STATUS_LABELS } from '~/utils/orderStatus';
import { formatDateTime, formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Đơn hàng của tôi' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Đơn hàng - Nailslay' }];

export default function UserOrdersPage() {
  const { authUser } = useRequireAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;
    setError(null);
    fetchUserOrders()
      .then(setOrders)
      .catch(() => {
        setOrders([]);
        setError('Không tải được danh sách đơn hàng. Vui lòng thử lại sau.');
      })
      .finally(() => setLoading(false));
  }, [authUser]);

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

  return (
    <div className="container py-10 space-y-6">
      <h1 className="section-title">Đơn hàng của tôi</h1>

      {loading ? (
        <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
      ) : error ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-danger">{error}</p>
          <Button
            color="primary"
            className="text-[#1D1D1D] font-semibold"
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchUserOrders()
                .then(setOrders)
                .catch(() => setError('Không tải được danh sách đơn hàng. Vui lòng thử lại sau.'))
                .finally(() => setLoading(false));
            }}
          >
            Thử lại
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-[#8E8A8A]">Bạn chưa có đơn hàng nào.</p>
          <Button as={Link} to="/products" color="primary" className="text-[#1D1D1D] font-semibold">
            Mua sắm ngay
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <HeroLink
              key={order.id}
              as={Link}
              to={`/orders/${order.id}`}
              className="block rounded-xl border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] p-4 hover:border-primary-400 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
                    #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-[#8E8A8A]">{formatDateTime(order.createdAt)}</p>
                </div>
                <Chip size="sm" variant="flat" color="primary">
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </Chip>
                <p className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{formatVND(order.totalAmount)}</p>
              </div>
            </HeroLink>
          ))}
        </div>
      )}
    </div>
  );
}
