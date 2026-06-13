import type { Route } from './+types/admin.products';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiAddLine, RiDeleteBinLine, RiEyeLine, RiPencilLine, RiSearchLine } from 'react-icons/ri';
import { AdminPageHeader } from '~/components';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { AdminMultipleImageUpload } from '~/components/admin/AdminMultipleImageUpload';
import { CurrencyInput } from '~/components/admin/CurrencyInput';
import {
  createProduct,
  deleteProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  updateProduct,
  type AdminCategory,
  type AdminProduct,
} from '~/utils/api/admin';
import { adminInputClassNames, adminSelectClassNames, adminTableClassNames, adminTextareaClassNames } from '~/utils/adminForm';
import { formatVND } from '~/utils/format';

export const handle = { pageTitle: 'Quản lý Sản phẩm' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Sản phẩm - Admin Nailslay' }];

type FormState = {
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  price: string;
  originalPrice: string;
  stock: string;
  imageFiles: File[];
  existingImages: string[];
  variants: Partial<AdminProductVariant>[];
};

type SortKey = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc';

const emptyForm = (): FormState => ({
  categoryId: '',
  sku: '',
  name: '',
  slug: '',
  description: '',
  status: 'active',
  price: '',
  originalPrice: '',
  stock: '0',
  imageFiles: [],
  existingImages: [],
  variants: [],
});

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name-asc', label: 'Tên A → Z' },
  { key: 'name-desc', label: 'Tên Z → A' },
  { key: 'price-asc', label: 'Giá tăng dần' },
  { key: 'price-desc', label: 'Giá giảm dần' },
  { key: 'stock-asc', label: 'Tồn kho tăng dần' },
  { key: 'stock-desc', label: 'Tồn kho giảm dần' },
];

function sortProducts(list: AdminProduct[], sort: SortKey) {
  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'name-asc':
        return a.name.localeCompare(b.name, 'vi');
      case 'name-desc':
        return b.name.localeCompare(a.name, 'vi');
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'stock-asc':
        return a.stock - b.stock;
      case 'stock-desc':
        return b.stock - a.stock;
      default:
        return 0;
    }
  });
  return sorted;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [detailProduct, setDetailProduct] = useState<AdminProduct | null>(null);
  const formModal = useDisclosure();
  const detailModal = useDisclosure();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, cats] = await Promise.all([
        fetchAdminProducts({ search: search || undefined, limit: 200 }),
        fetchAdminCategories(),
      ]);
      setProducts(productRes.items);
      setCategories(cats);
    } catch {
      toast.error('Không tải được sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryFilter) list = list.filter((p) => p.categoryId === categoryFilter);
    return sortProducts(list, sortKey);
  }, [products, categoryFilter, sortKey]);

  const toFormData = (data: FormState) => {
    const fd = new FormData();
    fd.append('categoryId', data.categoryId);
    fd.append('sku', data.sku);
    fd.append('name', data.name);
    fd.append('slug', data.slug);
    if (data.description) fd.append('description', data.description);
    fd.append('status', data.status);
    fd.append('price', data.price);
    if (data.originalPrice) fd.append('originalPrice', data.originalPrice);
    fd.append('stock', data.stock);
    fd.append('variants', JSON.stringify(data.variants));
    fd.append('existingImages', JSON.stringify(data.existingImages));
    for (const file of data.imageFiles) fd.append('images', file);
    return fd;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    formModal.onOpen();
  };

  const openEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setForm({
      categoryId: p.categoryId,
      sku: p.sku ?? '',
      name: p.name,
      slug: p.slug,
      description: p.description ?? '',
      status: p.status ?? 'active',
      price: String(p.price),
      originalPrice: String(p.originalPrice ?? p.price),
      stock: String(p.stock),
      imageFiles: [],
      existingImages: p.imageUrls ?? [],
      variants: p.variants ?? [],
    });
    formModal.onOpen();
  };

  const openDetail = (p: AdminProduct) => {
    setDetailProduct(p);
    detailModal.onOpen();
  };

  const handleSubmit = async () => {
    if (!form.categoryId || !form.sku || !form.name || !form.slug || !form.price) {
      toast.error('Vui lòng điền đủ các trường bắt buộc');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, toFormData(form));
        toast.success('Đã cập nhật sản phẩm');
      } else {
        await createProduct(toFormData(form));
        toast.success('Đã tạo sản phẩm');
      }
      formModal.onClose();
      await load();
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      toast.success('Đã xóa');
      await load();
    } catch {
      // interceptor
    }
  };

  return (
    <div className="space-y-6 admin-surface">
      <AdminPageHeader
        title="Quản lý Sản phẩm"
        description="Danh sách sản phẩm dạng bảng — tìm kiếm, lọc và sắp xếp."
        actions={
          <Button color="primary" className="text-[#1D1D1D] font-semibold" startContent={<RiAddLine />} onPress={openCreate}>
            Thêm sản phẩm
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-3 flex-wrap">
        <Input
          placeholder="Tìm theo tên hoặc SKU..."
          value={search}
          onValueChange={setSearch}
          startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
          className="max-w-sm"
          classNames={adminInputClassNames}
        />
        <Select
          placeholder="Lọc danh mục"
          selectedKeys={categoryFilter ? new Set([categoryFilter]) : new Set(['all'])}
          onSelectionChange={(keys) => {
            const val = String(Array.from(keys)[0] ?? 'all');
            setCategoryFilter(val === 'all' ? '' : val);
          }}
          className="max-w-xs"
          classNames={adminSelectClassNames}
        >
          <SelectItem key="all" textValue="Tất cả danh mục">
            Tất cả danh mục
          </SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} textValue={c.name}>
              {c.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          placeholder="Sắp xếp"
          selectedKeys={new Set([sortKey])}
          onSelectionChange={(keys) => setSortKey(String(Array.from(keys)[0] ?? 'name-asc') as SortKey)}
          className="max-w-xs"
          classNames={adminSelectClassNames}
        >
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="rounded-xl border border-primary-200/70 bg-white dark:bg-[#2a2226] overflow-x-auto">
        {loading ? (
          <p className="text-sm text-[#8E8A8A] p-6">Đang tải...</p>
        ) : (
          <Table aria-label="Danh sách sản phẩm" removeWrapper classNames={adminTableClassNames}>
            <TableHeader>
              <TableColumn>STT</TableColumn>
              <TableColumn>Ảnh</TableColumn>
              <TableColumn>SKU</TableColumn>
              <TableColumn>Tên sản phẩm</TableColumn>
              <TableColumn>Danh mục</TableColumn>
              <TableColumn>Giá bán</TableColumn>
              <TableColumn>Tồn kho</TableColumn>
              <TableColumn>Thao tác</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Chưa có sản phẩm">
              {filteredProducts.map((p, index) => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-primary-50/40" onClick={() => openDetail(p)}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {p.imageUrls && p.imageUrls[0] ? (
                      <img src={p.imageUrls[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 bg-[#f5f5f5] dark:bg-[#1f1f1f] rounded-md border border-dashed border-gray-300"></div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="font-medium max-w-[220px]">{p.name}</TableCell>
                  <TableCell>{categoryMap.get(p.categoryId) ?? '—'}</TableCell>
                  <TableCell className="font-semibold">{formatVND(p.price)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button isIconOnly size="sm" variant="light" aria-label="Xem" onPress={() => openDetail(p)}>
                        <RiEyeLine size={16} />
                      </Button>
                      <Button isIconOnly size="sm" variant="flat" aria-label="Sửa" onPress={() => openEdit(p)}>
                        <RiPencilLine size={16} />
                      </Button>
                      <Button isIconOnly size="sm" color="danger" variant="light" aria-label="Xóa" onPress={() => handleDelete(p.id)}>
                        <RiDeleteBinLine size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={formModal.isOpen} onOpenChange={formModal.onOpenChange} size="3xl" scrollBehavior="inside">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">
                {editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </ModalHeader>
              <ModalBody className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <Select
                  label={<RequiredLabel required>Danh mục</RequiredLabel>}
                  selectedKeys={form.categoryId ? new Set([form.categoryId]) : new Set()}
                  onSelectionChange={(keys) =>
                    setForm({ ...form, categoryId: String(Array.from(keys)[0] ?? '') })
                  }
                  classNames={adminSelectClassNames}
                >
                  {categories.map((c) => (
                    <SelectItem key={c.id}>{c.name}</SelectItem>
                  ))}
                </Select>
                <Input label={<RequiredLabel required>SKU</RequiredLabel>} value={form.sku} onValueChange={(v) => setForm({ ...form, sku: v })} classNames={adminInputClassNames} />
                <Input label={<RequiredLabel required>Tên</RequiredLabel>} value={form.name} onValueChange={(v) => setForm({ ...form, name: v })} classNames={adminInputClassNames} />
                <Input label={<RequiredLabel required>Slug</RequiredLabel>} value={form.slug} onValueChange={(v) => setForm({ ...form, slug: v })} classNames={adminInputClassNames} />
                <Select
                  label="Trạng thái"
                  selectedKeys={form.status ? new Set([form.status]) : new Set(['active'])}
                  onSelectionChange={(keys) => setForm({ ...form, status: String(Array.from(keys)[0] ?? 'active') })}
                  classNames={adminSelectClassNames}
                >
                  <SelectItem key="active">Đang bán</SelectItem>
                  <SelectItem key="hidden">Đã ẩn</SelectItem>
                  <SelectItem key="draft">Nháp</SelectItem>
                </Select>
                <CurrencyInput label={<RequiredLabel required>Giá bán (VND)</RequiredLabel>} value={form.price} onValueChange={(v) => setForm({ ...form, price: v })} classNames={adminInputClassNames} />
                <CurrencyInput label="Giá gốc (VND)" value={form.originalPrice} onValueChange={(v) => setForm({ ...form, originalPrice: v })} classNames={adminInputClassNames} />
                <Input label="Tồn kho tổng" value={form.stock} onValueChange={(v) => setForm({ ...form, stock: v })} classNames={adminInputClassNames} />
                <Textarea label={<RequiredLabel required>Mô tả sản phẩm</RequiredLabel>} className="md:col-span-2" value={form.description} onValueChange={(v) => setForm({ ...form, description: v })} classNames={adminTextareaClassNames} />
                
                <div className="md:col-span-2 border border-primary-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Biến thể sản phẩm (Màu sắc, Size)</h4>
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<RiAddLine />}
                      onPress={() => setForm({ ...form, variants: [...form.variants, { sku: '', name: '', color: '', size: '', price: Number(form.price) || 0, stock: 0 }] })}
                    >
                      Thêm biến thể
                    </Button>
                  </div>
                  {form.variants.length === 0 ? (
                    <p className="text-sm text-[#8E8A8A]">Chưa có biến thể nào. Sản phẩm sẽ sử dụng giá và tồn kho chung.</p>
                  ) : (
                    <div className="space-y-3">
                      {form.variants.map((v, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2 p-3 bg-[#f9f9f9] dark:bg-[#1f1f1f] rounded-lg border border-gray-200 dark:border-gray-800">
                          <Input size="sm" placeholder="SKU biến thể" value={v.sku ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].sku = val; setForm({ ...form, variants: arr }); }} className="w-24" />
                          <Input size="sm" placeholder="Tên (VD: Màu đỏ)" value={v.name ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].name = val; setForm({ ...form, variants: arr }); }} className="w-32" />
                          <Input size="sm" placeholder="Màu" value={v.color ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].color = val; setForm({ ...form, variants: arr }); }} className="w-20" />
                          <Input size="sm" placeholder="Size" value={v.size ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].size = val; setForm({ ...form, variants: arr }); }} className="w-16" />
                          <CurrencyInput size="sm" placeholder="Giá" value={String(v.price ?? '')} onValueChange={(val) => { const arr = [...form.variants]; arr[i].price = Number(val); setForm({ ...form, variants: arr }); }} className="w-24" />
                          <Input size="sm" placeholder="Tồn" value={String(v.stock ?? '')} onValueChange={(val) => { const arr = [...form.variants]; arr[i].stock = Number(val); setForm({ ...form, variants: arr }); }} className="w-16" />
                          <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => { const arr = [...form.variants]; arr.splice(i, 1); setForm({ ...form, variants: arr }); }}>
                            <RiDeleteBinLine />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 pt-2">
                  <AdminMultipleImageUpload
                    label="Ảnh sản phẩm (tối đa 5)"
                    maxFiles={5}
                    previewUrls={[...form.existingImages, ...form.imageFiles.map(f => URL.createObjectURL(f))]}
                    onChange={(files) => setForm({ ...form, imageFiles: files, existingImages: files.length > 0 ? [] : form.existingImages })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Hủy</Button>
                <Button color="primary" className="text-[#1D1D1D]" isLoading={saving} onPress={handleSubmit}>Lưu</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={detailModal.isOpen} onOpenChange={detailModal.onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) =>
            detailProduct ? (
              <>
                <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">{detailProduct.name}</ModalHeader>
                <ModalBody className="space-y-4">
                  {detailProduct.imageUrls?.[0] ? (
                    <img src={detailProduct.imageUrls[0]} alt={detailProduct.name} className="w-full max-h-56 object-cover rounded-xl" />
                  ) : null}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-[#8E8A8A]">SKU:</span> {detailProduct.sku}</div>
                    <div><span className="text-[#8E8A8A]">Slug:</span> /{detailProduct.slug}</div>
                    <div><span className="text-[#8E8A8A]">Giá:</span> {formatVND(detailProduct.price)}</div>
                    <div><span className="text-[#8E8A8A]">Tồn kho:</span> {detailProduct.stock}</div>
                    <div className="col-span-2"><span className="text-[#8E8A8A]">Danh mục:</span> {categoryMap.get(detailProduct.categoryId) ?? '—'}</div>
                  </div>
                  {detailProduct.description ? (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#8E8A8A] mb-1">Mô tả</p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{detailProduct.description}</p>
                    </div>
                  ) : null}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>Đóng</Button>
                  <Button color="primary" className="text-[#1D1D1D]" onPress={() => { onClose(); openEdit(detailProduct); }}>Sửa sản phẩm</Button>
                </ModalFooter>
              </>
            ) : null
          }
        </ModalContent>
      </Modal>
    </div>
  );
}
