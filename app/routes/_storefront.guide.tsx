import type { Route } from './+types/_storefront.guide';
import { Link } from 'react-router';
import { InfoPageLayout } from '~/components/store/InfoPageLayout';
import { BRAND } from '~/data';

export const handle = { pageTitle: 'Hướng dẫn mua hàng' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Hướng dẫn mua hàng - Nailslay' }];

const STEPS = [
  {
    title: 'Chọn sản phẩm',
    body: (
      <>
        Duyệt{' '}
        <Link to="/products">danh sách sản phẩm</Link> hoặc{' '}
        <Link to="/categories">danh mục</Link> (Y2K, Tiểu thư, Công sở, Phụ kiện). Mở trang chi tiết, chọn{' '}
        <strong>Size</strong> (XS–L) và <strong>Form móng</strong> phù hợp, sau đó ấn <strong>Thêm vào giỏ</strong>.
      </>
    ),
  },
  {
    title: 'Kiểm tra giỏ hàng',
    body: (
      <>
        Vào <Link to="/cart">Giỏ hàng</Link> để xem lại số lượng, tạm tính và VAT. Bạn có thể chỉnh số lượng hoặc
        xóa sản phẩm trước khi thanh toán.
      </>
    ),
  },
  {
    title: 'Đăng nhập tài khoản',
    body: (
      <>
        Cần <Link to="/login">đăng nhập</Link> (hoặc <Link to="/register">đăng ký</Link> mới) để tiếp tục. Khách
        vãng lai có thể thêm vào giỏ cục bộ nhưng phải đăng nhập trước bước thanh toán.
      </>
    ),
  },
  {
    title: 'Tiến hành thanh toán',
    body: (
      <>
        Ấn <strong>Tiến hành thanh toán</strong> từ giỏ hàng. Ở bước này bạn <strong>chưa cần chuyển khoản</strong>{' '}
        — trang kế tiếp sẽ hiển thị thông tin ngân hàng và mã QR.
      </>
    ),
  },
  {
    title: 'Nhập địa chỉ & chuyển khoản',
    body: (
      <>
        Tại trang <Link to="/checkout">Thanh toán đơn hàng</Link>, điền đầy đủ họ tên, số điện thoại và địa chỉ
        giao hàng. Chuyển khoản đúng số tiền theo thông tin ngân hàng hoặc quét mã QR, sau đó mới ấn{' '}
        <strong>Đặt hàng</strong>.
      </>
    ),
  },
  {
    title: 'Xác nhận đơn hàng',
    body: (
      <>
        Sau khi đặt hàng thành công, hệ thống hiển thị mã đơn và thông tin chuyển khoản (nếu cần đối chiếu). Theo
        dõi trạng thái tại <Link to="/orders">Đơn hàng của tôi</Link>.
      </>
    ),
  },
  {
    title: 'Admin xác nhận thanh toán',
    body: (
      <>
        NailSlay kiểm tra sao kê ngân hàng và xác nhận thanh toán. Đơn chuyển sang trạng thái đã thanh toán trước
        khi đóng gói — bạn không cần thực hiện thêm bước thanh toán nào sau khi đã chuyển khoản.
      </>
    ),
  },
  {
    title: 'Giao hàng & nhận hàng',
    body: (
      <>
        Đơn được giao trong khoảng 2–3 ngày làm việc (tùy khu vực). Khi nhận hàng, xác nhận trên hệ thống. Nếu có
        vấn đề, gửi khiếu nại trong vòng 7 ngày — xem{' '}
        <Link to="/policy">Chính sách đổi trả</Link>.
      </>
    ),
  },
];

export default function GuidePage() {
  return (
    <InfoPageLayout
      title="Hướng dẫn mua hàng"
      subtitle={`Quy trình mua sắm tại ${BRAND.name} — từ chọn nail box đến nhận hàng tận tay.`}
    >
      <section>
        <h2>Tổng quan</h2>
        <p>
          NailSlay chỉ hỗ trợ <strong>thanh toán chuyển khoản ngân hàng</strong>. Vui lòng làm theo các bước dưới
          đây để đơn hàng được xử lý nhanh nhất.
        </p>
      </section>

      <section>
        <h2>Các bước đặt hàng</h2>
        <div className="not-prose space-y-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 p-4 rounded-xl border border-primary-200/60 bg-white/80 dark:bg-[#2a2226]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2A7B7] text-sm font-bold text-[#1D1D1D]">
                {index + 1}
              </span>
              <div className="space-y-1 min-w-0">
                <h3 className="font-heading font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{step.title}</h3>
                <p className="text-sm text-[#8E8A8A] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Lưu ý quan trọng</h2>
        <ul>
          <li>Ghi đúng nội dung chuyển khoản theo hướng dẫn trên trang thanh toán để admin đối soát nhanh.</li>
          <li>Không ấn <strong>Đặt hàng</strong> trước khi đã chuyển khoản thành công.</li>
          <li>Giữ biên lai chuyển khoản đến khi đơn được xác nhận thanh toán.</li>
          <li>Combo Care Kit không có biến thể size/form — thêm trực tiếp vào giỏ.</li>
        </ul>
      </section>

      <section>
        <h2>Cần thêm trợ giúp?</h2>
        <p>
          Xem <Link to="/about">Về NailSlay</Link> để biết thêm về sản phẩm và danh mục, hoặc liên hệ{' '}
          <a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a> /{' '}
          <a href={`tel:${BRAND.contact.phone}`}>{BRAND.contact.phone}</a>.
        </p>
      </section>
    </InfoPageLayout>
  );
}
