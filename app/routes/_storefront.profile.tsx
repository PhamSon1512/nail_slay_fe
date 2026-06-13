import type { Route } from './+types/_storefront.profile';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Input } from '@heroui/react';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { AuthFormLayout } from '~/components';
import { getProfileApi, updateProfileApi } from '~/utils/auth';
import { authUserAtom } from '~/utils/atoms';

export const handle = { pageTitle: 'Thông tin tài khoản' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Thông tin tài khoản - Nailslay' }];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (authUser === null) {
      navigate('/login?redirect=/profile');
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (!authUser?.id || fetchedRef.current) return;
    fetchedRef.current = true;

    setFullName(authUser.fullName ?? '');
    setPhone(authUser.phone ?? '');
    setEmail(authUser.email);

    getProfileApi()
      .then((profile) => {
        setAuthUser(profile);
        setFullName(profile.fullName ?? '');
        setPhone(profile.phone ?? '');
        setEmail(profile.email);
      })
      .catch(() => {
        // keep local data
      })
      .finally(() => setReady(true));
  }, [authUser?.id, setAuthUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfileApi({ fullName, phone });
      setAuthUser(updated);
      toast.success('Cập nhật thông tin thành công');
    } catch {
      // interceptor
    } finally {
      setLoading(false);
    }
  };

  if (!authUser || !ready) return null;

  return (
    <AuthFormLayout
      title="Thông tin tài khoản"
      footer={
        <Link to="/change-password" className="text-[#1D1D1D] font-semibold hover:underline">
          Đổi mật khẩu
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          value={email}
          isReadOnly
          variant="bordered"
          classNames={{ inputWrapper: 'border-primary-200 bg-primary-50/30' }}
        />
        <Input
          label="Họ và tên"
          value={fullName}
          onValueChange={setFullName}
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
        <Button
          type="submit"
          color="primary"
          className="w-full font-semibold text-[#1D1D1D]"
          isLoading={loading}
        >
          Lưu thay đổi
        </Button>
      </form>
    </AuthFormLayout>
  );
}
