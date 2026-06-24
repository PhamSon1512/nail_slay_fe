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
  useDisclosure,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiAddLine, RiDeleteBinLine, RiEyeLine, RiPencilLine, RiSearchLine, RiImageLine } from 'react-icons/ri';
import { AdminPageHeader, ConfirmDeleteModal } from '~/components';
import { RequiredLabel } from '~/components/admin/RequiredLabel';
import { AdminMultipleImageUpload } from '~/components/admin/AdminMultipleImageUpload';
import { RichTextEditor } from '~/components/admin/RichTextEditor';
import { CurrencyInput } from '~/components/admin/CurrencyInput';
import {
  createProduct,
  deleteProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  updateProduct,
  type AdminCategory,
  type AdminProduct,
  type AdminProductVariant,
} from '~/utils/api/admin';
import { adminInputClassNames, adminSelectClassNames, adminTableClassNames } from '~/utils/adminForm';
import { formatVND } from '~/utils/format';
import { RichContent } from '~/components/store/RichContent';

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
  stock: '1',
  imageFiles: [],
  existingImages: [],
  variants: [],
});

const variantInputClassNames = {
  ...adminInputClassNames,
  inputWrapper: `${adminInputClassNames.inputWrapper} w-full min-w-[140px]`,
};

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
  const deleteModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    const price = data.price.replace(/\D/g, '');
    const originalPrice = data.originalPrice.replace(/\D/g, '');
    const variants = data.variants.filter(
      (v) =>
        (v.sku?.trim() ?? '') !== '' ||
        (v.name?.trim() ?? '') !== '' ||
        (v.color?.trim() ?? '') !== '' ||
        (v.size?.trim() ?? '') !== '' ||
        (v.price ?? 0) > 0 ||
        (v.stock ?? 0) > 0,
    );
    fd.append('categoryId', data.categoryId);
    fd.append('sku', data.sku.trim());
    fd.append('name', data.name.trim());
    fd.append('slug', data.slug.trim());
    fd.append('description', data.description.trim());
    fd.append('status', data.status);
    fd.append('price', price);
    fd.append('originalPrice', originalPrice);
    fd.append('stock', data.stock.replace(/\D/g, '') || data.stock);
    fd.append('variants', JSON.stringify(variants));
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
    if (!form.originalPrice.trim()) {
      toast.error('Vui lòng nhập giá gốc');
      return;
    }
    if (!form.status) {
      toast.error('Vui lòng chọn trạng thái');
      return;
    }
    const stockNum = Number(form.stock);
    if (!form.stock.trim() || Number.isNaN(stockNum) || stockNum <= 0) {
      toast.error('Tồn kho tổng phải lớn hơn 0');
      return;
    }
    for (let i = 0; i < form.variants.length; i++) {
      const variantStock = Number(form.variants[i].stock ?? 0);
      if (Number.isNaN(variantStock) || variantStock < 0) {
        toast.error(`Tồn kho biến thể #${i + 1} không hợp lệ`);
        return;
      }
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
      // http interceptor shows API error message (409 slug/sku conflict, etc.)
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (p: AdminProduct) => {
    setDeleteTarget({ id: p.id, name: p.name });
    deleteModal.onOpen();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast.success('Đã xóa');
      setDeleteTarget(null);
      await load();
    } catch {
      // interceptor
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = (p: AdminProduct) => {
    requestDelete(p);
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
          {[
            <SelectItem key="all" textValue="Tất cả danh mục">
              Tất cả danh mục
            </SelectItem>,
            ...categories.map((c) => (
              <SelectItem key={c.id} textValue={c.name}>
                {c.name}
              </SelectItem>
            ))
          ]}
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
                      <Button isIconOnly size="sm" color="danger" variant="light" aria-label="Xóa" onPress={() => handleDelete(p)}>
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

      <Modal isOpen={formModal.isOpen} onOpenChange={formModal.onOpenChange} size="5xl" scrollBehavior="inside">
        <ModalContent className="bg-white dark:bg-[#2a2226]">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">
                {editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </ModalHeader>
              <ModalBody className="gap-4">
                <AdminMultipleImageUpload
                  label="Ảnh sản phẩm (tối đa 5)"
                  maxFiles={5}
                  previewUrls={[
                    ...form.existingImages,
                    ...form.imageFiles.map((f) => URL.createObjectURL(f)),
                  ]}
                  onChange={(newFiles) => {
                    setForm((prev) => {
                      const maxNew = 5 - prev.existingImages.length;
                      const merged = [...prev.imageFiles, ...newFiles].slice(0, maxNew);
                      return { ...prev, imageFiles: merged };
                    });
                  }}
                  onRemoveAt={(index) => {
                    if (index < form.existingImages.length) {
                      setForm({
                        ...form,
                        existingImages: form.existingImages.filter((_, i) => i !== index),
                      });
                    } else {
                      const fileIndex = index - form.existingImages.length;
                      setForm({
                        ...form,
                        imageFiles: form.imageFiles.filter((_, i) => i !== fileIndex),
                      });
                    }
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <CurrencyInput label={<RequiredLabel required>Giá gốc (VND)</RequiredLabel>} value={form.originalPrice} onValueChange={(v) => setForm({ ...form, originalPrice: v })} classNames={adminInputClassNames} />
                <CurrencyInput label={<RequiredLabel required>Giá bán (VND)</RequiredLabel>} value={form.price} onValueChange={(v) => setForm({ ...form, price: v })} classNames={adminInputClassNames} />
                <Select
                  label={<RequiredLabel required>Trạng thái</RequiredLabel>}
                  selectedKeys={form.status ? new Set([form.status]) : new Set(['active'])}
                  onSelectionChange={(keys) => setForm({ ...form, status: String(Array.from(keys)[0] ?? 'active') })}
                  classNames={adminSelectClassNames}
                >
                  <SelectItem key="active">Đang bán</SelectItem>
                  <SelectItem key="hidden">Đã ẩn</SelectItem>
                  <SelectItem key="draft">Nháp</SelectItem>
                </Select>
                <Input
                  label="Tồn kho tổng"
                  value={form.stock}
                  onValueChange={(v) => setForm({ ...form, stock: v })}
                  type="number"
                  min={1}
                  description="Phải lớn hơn 0"
                  classNames={adminInputClassNames}
                />
                <div className="md:col-span-2 space-y-2">
                  <p className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
                    <RequiredLabel required>Mô tả sản phẩm</RequiredLabel>
                  </p>
                  <RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} />
                </div>
                </div>
                
                <div className="border border-primary-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">Biến thể sản phẩm (Màu sắc, Size)</h4>
                    <Button
                      size="sm"
                      color="primary"
                      className="text-[#1D1D1D] font-medium shadow-sm"
                      startContent={<RiAddLine />}
                      onPress={() => setForm({ ...form, variants: [...form.variants, { sku: form.sku ? `${form.sku}-${form.variants.length + 1}` : '', name: '', color: '', size: '', price: Number(form.price) || 0, stock: 0 }] })}
                    >
                      Thêm biến thể
                    </Button>
                  </div>
                  {form.variants.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-[#1a1417] rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-sm text-[#8E8A8A]">Chưa có biến thể nào. Sản phẩm sẽ sử dụng giá và tồn kho chung.</p>
                      <p className="text-xs text-[#8E8A8A] mt-1">Các trường biến thể đều tùy chọn — chỉ điền những gì cần phân loại.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
                      <table className="w-full min-w-[960px] text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-800">
                          <tr>
                            <th className="px-3 py-3 whitespace-nowrap w-14">Ảnh</th>
                            <th className="px-3 py-3 whitespace-nowrap min-w-[150px]">SKU</th>
                            <th className="px-3 py-3 whitespace-nowrap min-w-[180px]">Tên Phân Loại</th>
                            <th className="px-3 py-3 whitespace-nowrap min-w-[140px]">Màu sắc</th>
                            <th className="px-3 py-3 whitespace-nowrap min-w-[120px]">Size</th>
                            <th className="px-3 py-3 whitespace-nowrap min-w-[150px]">Giá bán</th>
                            <th className="px-3 py-3 whitespace-nowrap min-w-[120px]">Tồn kho</th>
                            <th className="px-3 py-3 whitespace-nowrap w-14 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#2a2226]">
                          {form.variants.map((v, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-[#32282d] transition-colors">
                              <td className="px-3 py-2">
                                <div className="w-10 h-10 rounded bg-gray-100 dark:bg-[#1f1f1f] border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" title="Chức năng upload ảnh phân loại đang cập nhật">
                                  <RiImageLine size={18} />
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <Input size="sm" placeholder="SKU biến thể" value={v.sku ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].sku = val; setForm({ ...form, variants: arr }); }} className="w-full min-w-[140px]" classNames={variantInputClassNames} />
                              </td>
                              <td className="px-3 py-2">
                                <Input size="sm" placeholder="VD: Màu đỏ cổ điển" value={v.name ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].name = val; setForm({ ...form, variants: arr }); }} className="w-full min-w-[160px]" classNames={variantInputClassNames} />
                              </td>
                              <td className="px-3 py-2">
                                <Input size="sm" placeholder="VD: Đỏ" value={v.color ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].color = val; setForm({ ...form, variants: arr }); }} className="w-full min-w-[120px]" classNames={variantInputClassNames} />
                              </td>
                              <td className="px-3 py-2">
                                <Input size="sm" placeholder="VD: S, M" value={v.size ?? ''} onValueChange={(val) => { const arr = [...form.variants]; arr[i].size = val; setForm({ ...form, variants: arr }); }} className="w-full min-w-[100px]" classNames={variantInputClassNames} />
                              </td>
                              <td className="px-3 py-2">
                                <CurrencyInput size="sm" placeholder="Giá bán" value={String(v.price ?? '')} onValueChange={(val) => { const arr = [...form.variants]; arr[i].price = Number(val); setForm({ ...form, variants: arr }); }} className="w-full min-w-[130px]" classNames={variantInputClassNames} />
                              </td>
                              <td className="px-3 py-2">
                                <Input size="sm" placeholder="Tồn kho" value={String(v.stock ?? '')} onValueChange={(val) => { const arr = [...form.variants]; arr[i].stock = val === '' ? 0 : Number(val); setForm({ ...form, variants: arr }); }} type="number" min={0} className="w-full min-w-[100px]" classNames={variantInputClassNames} />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <Button isIconOnly size="sm" color="danger" variant="light" aria-label="Xóa" onPress={() => { const arr = [...form.variants]; arr.splice(i, 1); setForm({ ...form, variants: arr }); }}>
                                  <RiDeleteBinLine size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
                      <RichContent html={detailProduct.description} />
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

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => {
          if (open) deleteModal.onOpen(); else deleteModal.onClose();
          if (!open) setDeleteTarget(null);
        }}
        message={
          deleteTarget
            ? `Bạn có chắc muốn xóa sản phẩm "${deleteTarget.name}"? Hành động này không thể hoàn tác.`
            : 'Bạn có chắc muốn xóa sản phẩm này?'
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
