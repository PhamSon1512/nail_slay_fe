import type { Route } from './+types/_storefront.login';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Button, Checkbox, Input } from '@heroui/react';
import { useSetAtom } from 'jotai';
import toast from 'react-hot-toast';
import { AuthFormLayout } from '~/components';
import { getPostLoginPath, loginApi } from '~/utils/auth';
import { authBootstrapReadyAtom, authTokenAtom, authUserAtom } from '~/utils/atoms';

export const handle = { pageTitle: 'Đăng nhập' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Đăng nhập - Nailslay' }];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setBootstrapReady = useSetAtom(authBootstrapReadyAtom);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await loginApi({ email, password, remember_me: rememberMe });
      setAuthToken(token);
      setAuthUser(user);
      setBootstrapReady(true);
      toast.success('Đăng nhập thành công');
      const redirect = searchParams.get('redirect');
      navigate(redirect || getPostLoginPath(user.role));
    } catch {
      // toast handled by http interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại NailSlay"
      footer={
        <p className="text-[#8E8A8A]">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#1D1D1D] font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Mật khẩu"
          type="password"
          value={password}
          onValueChange={setPassword}
          isRequired
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200' }}
        />
        <div className="flex items-center justify-between gap-3">
          <Checkbox
            isSelected={rememberMe}
            onValueChange={setRememberMe}
            classNames={{ wrapper: 'checkbox-brand after:bg-[#c36d80]' }}
            color="primary"
          >
            <span className="text-sm">Ghi nhớ đăng nhập</span>
          </Checkbox>
          <Link to="/forgot-password" className="text-sm text-[#1D1D1D] hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <Button
          type="submit"
          color="primary"
          className="w-full font-semibold text-[#1D1D1D]"
          isLoading={loading}
        >
          Đăng nhập
        </Button>
      </form>
    </AuthFormLayout>
  );
}
