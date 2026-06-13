import type { Route } from './+types/_storefront.policy';
import { Link } from 'react-router';
import { InfoPageLayout } from '~/components/store/InfoPageLayout';
import { BRAND } from '~/data';

export const handle = { pageTitle: 'Chính sách đổi trả' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Chính sách đổi trả - Nailslay' }];

export default function PolicyPage() {
  return (
    <InfoPageLayout
      title="Chính sách đổi trả"
      subtitle={`${BRAND.name} cam kết hỗ trợ khách hàng minh bạch, rõ ràng với mọi đơn hàng nail box và phụ kiện móng.`}
    >
      <section>
        <h2>1. Phạm vi áp dụng</h2>
        <p>
          Chính sách này áp dụng cho toàn bộ sản phẩm nail box thiết kế và phụ kiện móng được mua trực tiếp trên
          website NailSlay. Sản phẩm đã qua sử dụng, tự ý chỉnh sửa hoặc thiếu phụ kiện gốc có thể không được
          hỗ trợ đổi trả.
        </p>
      </section>

      <section>
        <h2>2. Điều kiện đổi / trả hàng</h2>
        <ul>
          <li>Sản phẩm còn nguyên tem, hộp, chưa dán và chưa qua sử dụng.</li>
          <li>
            Yêu cầu được gửi trong vòng <strong>7 ngày</strong> kể từ khi bạn xác nhận đã nhận hàng trên hệ thống.
          </li>
          <li>
            Lỗi do sản xuất (bong keo sớm bất thường, thiếu móng, sai size/form so với đơn) — NailSlay hỗ trợ đổi
            miễn phí hoặc hoàn tiền tùy tình huống.
          </li>
          <li>
            Trường hợp chọn nhầm size/form do khách hàng: hỗ trợ đổi một lần nếu còn hàng, khách chịu phí vận
            chuyển hai chiều.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Trường hợp không hỗ trợ</h2>
        <ul>
          <li>Sản phẩm đã dán, cắt, dũa hoặc thay đổi hình dạng.</li>
          <li>Đơn hàng chưa thanh toán hoặc chưa được admin xác nhận thanh toán.</li>
          <li>Khiếu nại quá thời hạn 7 ngày kể từ ngày giao thành công.</li>
          <li>Hư hỏng do bảo quản không đúng (ẩm ướt, nhiệt độ cao, va đập).</li>
        </ul>
      </section>

      <section>
        <h2>4. Quy trình yêu cầu đổi trả</h2>
        <ol>
          <li>
            Vào mục{' '}
            <Link to="/orders">Đơn hàng của tôi</Link>, chọn đơn cần hỗ trợ và gửi khiếu nại (COMPLAINED) kèm
            mô tả và hình ảnh minh chứng.
          </li>
          <li>Đội ngũ NailSlay phản hồi trong 24–48 giờ làm việc.</li>
          <li>Nếu được duyệt đổi/trả, nhân viên hướng dẫn gửi hàng về kho và xử lý hoàn tiền hoặc gửi sản phẩm thay thế.</li>
        </ol>
      </section>

      <section>
        <h2>5. Hoàn tiền</h2>
        <p>
          Hoàn tiền qua chuyển khoản ngân hàng trong vòng 3–7 ngày làm việc sau khi NailSlay nhận và kiểm tra hàng
          trả về. Số tiền hoàn bằng giá trị sản phẩm lỗi; phí vận chuyển (nếu có) được quy định theo từng trường hợp
          ở mục 2.
        </p>
      </section>

      <section>
        <h2>6. Liên hệ hỗ trợ</h2>
        <p>
          Email: <a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a>
          <br />
          Hotline: <a href={`tel:${BRAND.contact.phone}`}>{BRAND.contact.phone}</a>
          <br />
          Hoặc xem thêm{' '}
          <Link to="/guide">Hướng dẫn mua hàng</Link> để nắm rõ luồng đặt hàng và thanh toán.
        </p>
      </section>
    </InfoPageLayout>
  );
}
