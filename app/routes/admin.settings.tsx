import type { Route } from './+types/admin.settings';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import toast from 'react-hot-toast';
import { AdminPageHeader } from '~/components';
import type { HomepageFeature } from '~/data/homepage';
import { DEFAULT_HOMEPAGE_FEATURES } from '~/data/homepage';
import {
  fetchAdminProducts,
  fetchAdminSettings,
  updateHomepageSettings,
  type AdminProduct,
} from '~/utils/api/admin';
import { adminCardClass, adminInputClassNames, adminSelectClassNames } from '~/utils/adminForm';

export const handle = { pageTitle: 'Cài đặt trang chủ' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Cài đặt - Admin Nailslay' }];

const ICON_OPTIONS = [
  { key: 'truck', label: 'Giao hàng' },
  { key: 'shield', label: 'An toàn' },
  { key: 'bag', label: 'Shopping' },
] as const;

export default function AdminSettingsPage() {
  const [features, setFeatures] = useState<HomepageFeature[]>(DEFAULT_HOMEPAGE_FEATURES);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
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
    setSaving(true);
    try {
      await updateHomepageSettings({
        features,
        featuredProductIds: featuredIds.slice(0, 6),
      });
      toast.success('Đã lưu cài đặt trang chủ');
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (id: string, patch: Partial<HomepageFeature>) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, ...patch } : f)));
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

  if (loading) return <p className="text-sm text-[#8E8A8A]">Đang tải...</p>;

  return (
    <div className="space-y-8 max-w-4xl admin-surface">
      <AdminPageHeader
        title="Cài đặt trang chủ"
        description="Cấu hình các ô giới thiệu và sản phẩm nổi bật hiển thị trên trang chủ."
        actions={
          <Button color="primary" className="text-[#1D1D1D] font-semibold" isLoading={saving} onPress={save}>
            Lưu thay đổi
          </Button>
        }
      />

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-[#1D1D1D]">Ô giới thiệu</h2>
        {features.map((feature) => (
          <Card key={feature.id} shadow="none" className={adminCardClass}>
            <CardBody className="gap-3">
              <Select
                label="Icon"
                selectedKeys={new Set([feature.icon])}
                onSelectionChange={(keys) =>
                  updateFeature(feature.id, {
                    icon: String(Array.from(keys)[0]) as HomepageFeature['icon'],
                  })
                }
                classNames={adminSelectClassNames}
              >
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.key}>{opt.label}</SelectItem>
                ))}
              </Select>
              <Input label="Tiêu đề" value={feature.title} onValueChange={(v) => updateFeature(feature.id, { title: v })} classNames={adminInputClassNames} />
              <Input label="Mô tả" value={feature.description} onValueChange={(v) => updateFeature(feature.id, { description: v })} classNames={adminInputClassNames} />
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
    </div>
  );
}
