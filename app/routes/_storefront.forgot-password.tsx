import type { Route } from './+types/_storefront.forgot-password';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Input } from '@heroui/react';
import toast from 'react-hot-toast';
import { AuthFormLayout } from '~/components';
import { forgotPasswordApi } from '~/utils/auth';

export const handle = { pageTitle: 'Quên mật khẩu' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Quên mật khẩu - Nailslay' }];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }
    try {
      const res = await forgotPasswordApi(email);
      setSent(true);
      toast.success(res.message);
    } catch {
      // interceptor
    }
  };

  return (
    <AuthFormLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận hướng dẫn đặt lại mật khẩu"
      footer={
        <Link to="/login" className="text-[#1D1D1D] font-semibold hover:underline">
          Quay lại đăng nhập
        </Link>
      }
    >
      {sent ? (
        <div className="text-center space-y-3 text-sm text-[#8E8A8A]">
          <p>
            Nếu email <strong className="text-[#1D1D1D]">{email}</strong> tồn tại trong hệ thống,
            chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>
          <p>Liên hệ: norely@nailslay.com · 0123 456 789</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email đăng ký"
            type="email"
            value={email}
            onValueChange={setEmail}
            isRequired
            variant="bordered"
            classNames={{ inputWrapper: 'border-primary-200' }}
          />
          <Button type="submit" color="primary" className="w-full font-semibold text-[#1D1D1D]">
            Gửi yêu cầu
          </Button>
        </form>
      )}
    </AuthFormLayout>
  );
}
