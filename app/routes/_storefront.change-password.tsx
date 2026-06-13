import type { Route } from './+types/_storefront.change-password';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Input } from '@heroui/react';
import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { AuthFormLayout } from '~/components';
import { changePasswordApi } from '~/utils/auth';
import { authUserAtom } from '~/utils/atoms';

export const handle = { pageTitle: 'Đổi mật khẩu' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Đổi mật khẩu - Nailslay' }];

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const authUser = useAtomValue(authUserAtom);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authUser) navigate('/login?redirect=/change-password');
  }, [authUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới tối thiểu 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      // interceptor
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return null;

  return (
    <AuthFormLayout
      title="Đổi mật khẩu"
      footer={
        <Link to="/profile" className="text-[#1D1D1D] font-semibold hover:underline">
          Quay lại thông tin tài khoản
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onValueChange={setCurrentPassword}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Input
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onValueChange={setNewPassword}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Button
          type="submit"
          color="primary"
          className="w-full font-semibold text-[#1D1D1D]"
          isLoading={loading}
        >
          Cập nhật mật khẩu
        </Button>
      </form>
    </AuthFormLayout>
  );
}
