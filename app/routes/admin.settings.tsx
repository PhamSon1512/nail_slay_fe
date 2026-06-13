import type { Route } from './+types/admin.settings';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import toast from 'react-hot-toast';
import { AdminPageHeader } from '~/components';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import type { HomepageFeature, HomepageThankYou, HomepageThankYouStat } from '~/data/homepage';
import { DEFAULT_HOMEPAGE_FEATURES, DEFAULT_HOMEPAGE_THANK_YOU } from '~/data/homepage';
import {
  fetchAdminProducts,
  fetchAdminSettings,
  updateHomepageSettings,
  type AdminProduct,
} from '~/utils/api/admin';
import { adminCardClass, adminInputClassNames, adminTextareaClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Cài đặt Trang chủ' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Cài đặt - Admin Nailslay' }];

const ICON_OPTIONS = [
  { key: 'truck', label: 'Giao hàng' },
  { key: 'shield', label: 'An toàn' },
  { key: 'bag', label: 'Shopping' },
] as const;

type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  facebook: string;
  tiktok: string;
};

const EMPTY_CONTACT: ContactInfo = {
  phone: '',
  email: '',
  address: '',
  facebook: '',
  tiktok: '',
};

function FeatureIconSelect({
  value,
  onChange,
}: {
  value: HomepageFeature['icon'];
  onChange: (icon: HomepageFeature['icon']) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
        <RequiredLabel required>Icon</RequiredLabel>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as HomepageFeature['icon'])}
        className="w-full rounded-xl border border-primary-200/80 bg-white dark:bg-[#2a2226] px-3 py-2.5 text-sm text-[#1D1D1D] dark:text-[#FFF3F5] outline-none focus:border-primary-400"
      >
        {ICON_OPTIONS.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [features, setFeatures] = useState<HomepageFeature[]>(DEFAULT_HOMEPAGE_FEATURES);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [thankYou, setThankYou] = useState<HomepageThankYou>(DEFAULT_HOMEPAGE_THANK_YOU);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(EMPTY_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, productPage] = await Promise.all([
        fetchAdminSettings(),
        fetchAdminProducts({ limit: 100 }),
      ]);
      setFeatures(settings.homepage?.features?.length ? settings.homepage.features : DEFAULT_HOMEPAGE_FEATURES);
      setFeaturedIds(settings.homepage?.featuredProductIds ?? []);
      setThankYou(settings.homepage?.thankYou ?? DEFAULT_HOMEPAGE_THANK_YOU);
      setContactInfo({
        phone: settings.contact_info?.phone ?? '',
        email: settings.contact_info?.email ?? '',
        address: settings.contact_info?.address ?? '',
        facebook: settings.contact_info?.facebook ?? '',
        tiktok: settings.contact_info?.tiktok ?? '',
      });
      setProducts(productPage.items);
    } catch {
      toast.error('Không tải được cài đặt');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (saving) return;

    for (const feature of features) {
      if (!feature.title.trim() || !feature.description.trim()) {
        toast.error('Vui lòng điền đầy đủ tiêu đề và mô tả ở phần Ô giới thiệu');
        return;
      }
    }
    if (!thankYou.title.trim() || !thankYou.content.trim()) {
      toast.error('Vui lòng điền tiêu đề và nội dung phần Cảm ơn');
      return;
    }
    for (const stat of thankYou.stats) {
      if (!stat.value.trim() || !stat.label.trim()) {
        toast.error('Vui lòng điền đầy đủ con số và mô tả trong phần Cảm ơn');
        return;
      }
    }
    if (!contactInfo.phone.trim() || !contactInfo.email.trim() || !contactInfo.address.trim()) {
      toast.error('Vui lòng điền số điện thoại, email và địa chỉ ở phần Thông tin liên hệ');
      return;
    }

    setSaving(true);
    try {
      await updateHomepageSettings({
        features,
        featuredProductIds: featuredIds.slice(0, 6),
        thankYou,
        contact_info: contactInfo,
      });
      window.setTimeout(() => toast.success('Đã lưu cài đặt trang chủ'), 0);
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (id: string, patch: Partial<HomepageFeature>) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const toggleFeatured = (productId: string) => {
    setFeaturedIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 6) {
        toast.error('Tối đa 6 sản phẩm nổi bật');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const updateThankYouStat = (id: string, patch: Partial<HomepageThankYouStat>) => {
    setThankYou((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) => (stat.id === id ? { ...stat, ...patch } : stat)),
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <p className="text-sm text-[#8E8A8A]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl admin-surface">
      <AdminPageHeader
        title="Cài đặt Trang chủ"
        description="Cấu hình các ô giới thiệu, sản phẩm nổi bật, phần cảm ơn và thông tin footer."
        actions={
          <Button
            color="primary"
            className="text-[#1D1D1D] font-semibold min-w-[140px]"
            isDisabled={saving}
            onPress={save}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        }
      />

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-[#1D1D1D]">Ô giới thiệu</h2>
        {features.map((feature) => (
          <Card key={feature.id} shadow="none" className={adminCardClass}>
            <CardBody className="gap-3">
              <FeatureIconSelect
                value={feature.icon}
                onChange={(icon) => updateFeature(feature.id, { icon })}
              />
              <Input
                label={<RequiredLabel required>Tiêu đề</RequiredLabel>}
                value={feature.title}
                onValueChange={(v) => updateFeature(feature.id, { title: v })}
                classNames={adminInputClassNames}
                isDisabled={saving}
              />
              <Input
                label={<RequiredLabel required>Mô tả</RequiredLabel>}
                value={feature.description}
                onValueChange={(v) => updateFeature(feature.id, { description: v })}
                classNames={adminInputClassNames}
                isDisabled={saving}
              />
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-[#1D1D1D]">
          Sản phẩm nổi bật ({featuredIds.length}/6)
        </h2>
        <p className="text-sm text-[#8E8A8A]">Chỉ sản phẩm được chọn ở đây mới hiển thị trên slide trang chủ.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {products.map((product) => {
            const selected = featuredIds.includes(product.id);
            return (
              <Button
                key={product.id}
                variant={selected ? 'solid' : 'bordered'}
                color={selected ? 'primary' : 'default'}
                isDisabled={saving}
                className={`justify-start h-auto py-3 text-left ${selected ? 'text-[#1D1D1D]' : 'text-[#1D1D1D] border-primary-200'}`}
                onPress={() => toggleFeatured(product.id)}
              >
                <span className="text-sm">
                  <strong>{product.sku}</strong> — {product.name}
                </span>
              </Button>
            );
          })}
        </div>
        {!products.length ? (
          <p className="text-sm text-[#8E8A8A]">Chưa có sản phẩm. Tạo sản phẩm trước khi chọn nổi bật.</p>
        ) : null}
      </section>

      <section className="space-y-3 pt-6 border-t border-primary-100 dark:border-[#4a3b42]">
        <h2 className="font-heading text-xl font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
          Phần Cảm ơn
        </h2>
        <p className="text-sm text-[#8E8A8A] dark:text-[#FFDDE5]">
          Khối cảm ơn cuối trang chủ — tiêu đề, nội dung và các con số thống kê.
        </p>
        <Card shadow="none" className={adminCardClass}>
          <CardBody className="gap-4">
            <Input
              label={<RequiredLabel required>Tiêu đề</RequiredLabel>}
              value={thankYou.title}
              onValueChange={(v) => setThankYou((prev) => ({ ...prev, title: v }))}
              classNames={adminInputClassNames}
              isDisabled={saving}
            />
            <Textarea
              label={<RequiredLabel required>Nội dung</RequiredLabel>}
              value={thankYou.content}
              onValueChange={(v) => setThankYou((prev) => ({ ...prev, content: v }))}
              classNames={adminTextareaClassNames}
              minRows={4}
              isDisabled={saving}
            />
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
                <RequiredLabel required>Con số thống kê</RequiredLabel>
              </p>
              {thankYou.stats.map((stat, index) => (
                <div key={stat.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label={<RequiredLabel required>{`Con số ${index + 1}`}</RequiredLabel>}
                    value={stat.value}
                    onValueChange={(v) => updateThankYouStat(stat.id, { value: v })}
                    classNames={adminInputClassNames}
                    isDisabled={saving}
                  />
                  <Input
                    label={<RequiredLabel required>{`Mô tả con số ${index + 1}`}</RequiredLabel>}
                    value={stat.label}
                    onValueChange={(v) => updateThankYouStat(stat.id, { label: v })}
                    classNames={adminInputClassNames}
                    isDisabled={saving}
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="space-y-3 pt-6 border-t border-primary-100 dark:border-[#4a3b42]">
        <h2 className="font-heading text-xl font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">
          Thông tin liên hệ (Footer)
        </h2>
        <p className="text-sm text-[#8E8A8A] dark:text-[#FFDDE5]">Hiển thị ở chân trang (Footer) của cửa hàng.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={<RequiredLabel required>Số điện thoại</RequiredLabel>}
            value={contactInfo.phone}
            onValueChange={(v) => setContactInfo((prev) => ({ ...prev, phone: v }))}
            classNames={adminInputClassNames}
            isDisabled={saving}
          />
          <Input
            label={<RequiredLabel required>Email</RequiredLabel>}
            value={contactInfo.email}
            onValueChange={(v) => setContactInfo((prev) => ({ ...prev, email: v }))}
            classNames={adminInputClassNames}
            isDisabled={saving}
          />
          <Input
            label={<RequiredLabel required>Địa chỉ</RequiredLabel>}
            className="md:col-span-2"
            value={contactInfo.address}
            onValueChange={(v) => setContactInfo((prev) => ({ ...prev, address: v }))}
            classNames={adminInputClassNames}
            isDisabled={saving}
          />
          <Input
            label="Link Facebook"
            value={contactInfo.facebook}
            onValueChange={(v) => setContactInfo((prev) => ({ ...prev, facebook: v }))}
            classNames={adminInputClassNames}
            isDisabled={saving}
          />
          <Input
            label="Link TikTok"
            value={contactInfo.tiktok}
            onValueChange={(v) => setContactInfo((prev) => ({ ...prev, tiktok: v }))}
            classNames={adminInputClassNames}
            isDisabled={saving}
          />
        </div>
      </section>
    </div>
  );
}
