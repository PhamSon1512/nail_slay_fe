import type { Route } from './+types/_storefront.register';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Checkbox, Input } from '@heroui/react';
import { useSetAtom } from 'jotai';
import toast from 'react-hot-toast';
import { AuthFormLayout } from '~/components';
import { getPostLoginPath, registerApi } from '~/utils/auth';
import { authBootstrapReadyAtom, authTokenAtom, authUserAtom } from '~/utils/atoms';

export const handle = { pageTitle: 'Đăng ký' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Đăng ký - Nailslay' }];

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setBootstrapReady = useSetAtom(authBootstrapReadyAtom);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 8) {
      toast.error('Mật khẩu tối thiểu 8 ký tự');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await registerApi({
        email,
        password,
        full_name: fullName || undefined,
        phone: phone || undefined,
        remember_me: rememberMe,
      });
      setAuthToken(token);
      setAuthUser(user);
      setBootstrapReady(true);
      toast.success('Đăng ký thành công');
      navigate(getPostLoginPath(user.role));
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản khách hàng — role mặc định là User"
      footer={
        <p className="text-[#8E8A8A]">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#1D1D1D] font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Họ và tên"
          value={fullName}
          onValueChange={setFullName}
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onValueChange={setEmail}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Input
          label="Số điện thoại"
          value={phone}
          onValueChange={setPhone}
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Input
          label="Mật khẩu"
          type="password"
          value={password}
          onValueChange={setPassword}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <Checkbox
          isSelected={rememberMe}
          onValueChange={setRememberMe}
          classNames={{ wrapper: 'checkbox-brand after:bg-[#c36d80]' }}
          color="primary"
        >
          <span className="text-sm">Ghi nhớ đăng nhập</span>
        </Checkbox>
        <Button
          type="submit"
          color="primary"
          className="w-full font-semibold text-[#1D1D1D]"
          isLoading={loading}
        >
          Đăng ký
        </Button>
      </form>
    </AuthFormLayout>
  );
}
