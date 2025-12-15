---
description: Chuyển đổi HTML/Tailwind tĩnh thành React Components với HeroUI
---

# Bộ Rule Chuyển Đổi HTML sang React Components (HeroUI + Tailwind v4)

## 📋 Tổng Quan

Bộ rule này hướng dẫn chuyển đổi **bất kỳ file HTML tĩnh nào** (sử dụng Tailwind CSS) thành các React components tương thích với codebase **react-router-vite-cfp-heroui**.

**Quy trình chính:**
1. 🔍 **Phân tích HTML** - Xác định sections, icons, và custom styles
2. 🎨 **Cập nhật app.css** - Merge custom theme vào codebase (nếu cần)
3. 🔧 **Chuyển đổi HTML → JSX** - Áp dụng các rule chuyển đổi
4. 📦 **Tạo React Components** - Sử dụng HeroUI components
5. ✅ **Kiểm tra & Test** - Verify kết quả

---

## 🔍 PHẦN 0: Phân Tích HTML (BẮT BUỘC TRƯỚC KHI CHUYỂN ĐỔI)

### 0.1 Bước 1: Xác Định Cấu Trúc Sections

Liệt kê tất cả các sections trong file HTML:

```
Ví dụ output phân tích:
┌─────────────┬──────────────────────────────────────┐
│ Section     │ Mô tả                                │
├─────────────┼──────────────────────────────────────┤
│ Header      │ Navigation bar với logo, menu, CTA  │
│ Hero        │ Banner chính với headline, buttons  │
│ Features    │ Grid các feature cards              │
│ Testimonial │ Customer quotes                     │
│ Pricing     │ Pricing tables                      │
│ CTA         │ Call-to-action section              │
│ Footer      │ Footer với links, social icons      │
└─────────────┴──────────────────────────────────────┘
```

### 0.2 Bước 2: Trích Xuất Tailwind Config

Tìm và trích xuất block `<script>` chứa tailwind.config hoặc inline styles:

```javascript
// Tìm trong <head> của HTML
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "custom-color-1": "#xxxxxx",  // Ghi chú: tên và giá trị
        "custom-color-2": "#yyyyyy",
        // ...
      },
      fontFamily: {
        "custom-font": ["FontName", "fallback"]
      },
      // ...các custom khác
    },
  },
}
```

### 0.3 Bước 3: Liệt Kê Icons Được Sử Dụng

Tìm tất cả icons trong HTML và map sang react-icons:

```
📋 Icon Mapping Template:
┌─────────────────────┬──────────────────────┬──────────────────────┐
│ Icon Library (HTML) │ Icon Name            │ react-icons Tương Đương │
├─────────────────────┼──────────────────────┼──────────────────────┤
│ Material Symbols    │ [icon_name]          │ Md[IconName]         │
│ Heroicons           │ [icon_name]          │ Hi[IconName]         │
│ Font Awesome        │ fa-[icon-name]       │ Fa[IconName]         │
│ Lucide              │ [icon-name]          │ Lu[IconName]         │
│ Custom SVG          │ (inline)             │ Giữ nguyên hoặc extract│
└─────────────────────┴──────────────────────┴──────────────────────┘
```

### 0.4 Bước 4: So Sánh Với app.css

So sánh custom values từ HTML với `app/app.css` hiện tại:

```
📋 Comparison Template:
┌──────────────────┬─────────────────────┬─────────────────────┬─────────────┐
│ Thuộc tính       │ HTML gốc            │ Codebase (app.css)  │ Action      │
├──────────────────┼─────────────────────┼─────────────────────┼─────────────┤
│ Primary color    │ #[hex]              │ #[hex] hoặc N/A     │ ⚠️/✅        │
│ Secondary color  │ #[hex]              │ #[hex] hoặc N/A     │ ⚠️/✅        │
│ Background       │ #[hex]              │ #[hex] hoặc N/A     │ ⚠️/✅        │
│ Text colors      │ #[hex]              │ #[hex] hoặc N/A     │ ⚠️/✅        │
│ Fonts            │ [FontName]          │ [FontName] hoặc N/A │ ⚠️/✅        │
└──────────────────┴─────────────────────┴─────────────────────┴─────────────┘

Legend: ⚠️ = Cần thêm/cập nhật, ✅ = Đã có/tương thích
```

### 0.5 Bước 5: Cập Nhật app.css (Nếu Cần)

**Option A: Thêm Theme Namespace Mới** (Khuyến nghị khi có nhiều projects)

```css
@theme {
  /* === Existing theme === */
  /* ... giữ nguyên ... */
  
  /* === [PROJECT_NAME] Theme (NEW) === */
  --color-[prefix]-50: #[hex];
  --color-[prefix]-100: #[hex];
  /* ... scale 200-900 ... */
  --color-[prefix]-950: #[hex];
  
  /* [PROJECT_NAME] Background */
  --color-[prefix]-bg-light: #[hex];
  --color-[prefix]-bg-dark: #[hex];
  
  /* [PROJECT_NAME] Text */
  --color-[prefix]-text-main: #[hex];
  --color-[prefix]-text-muted: #[hex];
}
```

**Option B: Override Existing** (Khi project chuyên dụng)

```css
@theme {
  /* Override primary/secondary với màu mới */
  --color-primary-500: #[new-hex];
  /* ... */
}
```

### 0.6 Bước 6: Thêm Google Fonts (Nếu Cần)

```tsx
// Thêm vào app/root.tsx - links function
{
  rel: 'stylesheet',
  href: 'https://fonts.googleapis.com/css2?family=[FontName]:wght@400;500;600;700&display=swap',
}
```

Hoặc trong `app/app.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=[FontName]:wght@400;500;600;700&display=swap');
```

### 0.7 Checklist Phân Tích

```
- [ ] Xác định tất cả sections trong HTML
- [ ] Tìm <script> chứa tailwind.config
- [ ] Liệt kê tất cả custom colors
- [ ] Liệt kê tất cả custom fonts
- [ ] Liệt kê tất cả icons được sử dụng
- [ ] Tìm inline <style> blocks
- [ ] So sánh với app.css hiện tại
- [ ] Quyết định Option A hoặc B cho theme
- [ ] Cập nhật @theme block trong app.css (nếu cần)
- [ ] Thêm fonts vào root.tsx hoặc app.css (nếu cần)
- [ ] Tạo bảng mapping colors/classes
```

---

## 🎨 PHẦN 1: Quy Tắc CSS/Tailwind

> **NGUYÊN TẮC:** Giữ nguyên 100% Tailwind classes từ HTML gốc. Chỉ thay đổi khi Tailwind v4 **KHÔNG TƯƠNG THÍCH**.

### 1.1 Nguyên tắc chung

✅ **GIỮ NGUYÊN** tất cả các classes sau (tương thích hoàn toàn với v4):
- Layout: `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`
- Typography: `text-*`, `font-*`, `tracking-*`, `leading-*`
- Colors: `text-gray-*`, `bg-gray-*`, `border-gray-*`
- Border: `rounded-*`, `border-*`
- Effects: `shadow-*`, `opacity-*`, `blur-*`
- Responsive: `sm:`, `md:`, `lg:`, `xl:`
- Dark mode: `dark:`
- Hover/States: `hover:`, `focus:`, `group-hover:`
- Transitions: `transition-*`, `duration-*`
- Transforms: `translate-*`, `scale-*`, `rotate-*`
- Arbitrary values: `bg-[#hex]`, `w-[200px]`, `text-[14px]`

### 1.2 Breaking Changes - Tailwind v4 (CHỈ THAY ĐỔI NHỮNG NÀY)

| Tailwind v3 (HTML gốc)     | Tailwind v4                | Lý do                       |
| -------------------------- | -------------------------- | --------------------------- |
| `shadow-[color]/[opacity]` | `shadow-[color]-500/[opacity]` | v4 yêu cầu color scale |
| `ring-[color]`             | `ring-[color]-500`         | v4 yêu cầu color scale      |
| `decoration-[color]`       | `decoration-[color]-500`   | v4 yêu cầu color scale      |
| `accent-[color]`           | `accent-[color]-500`       | v4 yêu cầu color scale      |
| `caret-[color]`            | `caret-[color]-500`        | v4 yêu cầu color scale      |

> ⚠️ **Chú ý:** Nếu HTML gốc đã dùng color scale (VD: `text-blue-500`), giữ nguyên 100%.

### 1.3 Container Utility (TÙY CHỌN)

Nếu codebase đã định nghĩa `container` utility:

```diff
// TRƯỚC (HTML gốc - pattern phổ biến)
- class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// SAU (nếu muốn dùng utility có sẵn)
+ className="container"

// HOẶC giữ nguyên nếu responsive pattern khác
+ className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

---

## 🔧 PHẦN 2: Quy Tắc HTML → JSX

### 2.1 Cú Pháp Cơ Bản

| HTML                        | JSX                              |
| --------------------------- | -------------------------------- |
| `class="..."`               | `className="..."`                |
| `for="..."`                 | `htmlFor="..."`                  |
| `onclick="..."`             | `onClick={...}`                  |
| `onchange="..."`            | `onChange={...}`                 |
| `tabindex="..."`            | `tabIndex={...}`                 |
| `readonly`                  | `readOnly`                       |
| `maxlength="..."`           | `maxLength={...}`                |
| `<!-- comment -->`          | `{/* comment */}`                |

### 2.2 Self-Closing Tags

| HTML          | JSX           |
| ------------- | ------------- |
| `<br>`        | `<br />`      |
| `<hr>`        | `<hr />`      |
| `<img ...>`   | `<img ... />` |
| `<input ...>` | `<input ... />`|
| `<meta ...>`  | `<meta ... />`|
| `<link ...>`  | `<link ... />`|

### 2.3 SVG Attributes

| HTML              | JSX               |
| ----------------- | ----------------- |
| `viewbox`         | `viewBox`         |
| `fill-rule`       | `fillRule`        |
| `clip-rule`       | `clipRule`        |
| `stroke-width`    | `strokeWidth`     |
| `stroke-linecap`  | `strokeLinecap`   |
| `stroke-linejoin` | `strokeLinejoin`  |
| `stroke-dasharray`| `strokeDasharray` |
| `clip-path`       | `clipPath`        |
| `xmlns`           | Có thể bỏ hoặc giữ|

### 2.4 Boolean Attributes

```tsx
// HTML
<input disabled="" />
<input checked="" />
<button hidden="" />

// JSX
<input disabled />
<input defaultChecked />  // hoặc checked={true} với controlled
<button hidden />
```

### 2.5 Style Attribute

```tsx
// HTML
<div style="color: red; font-size: 16px;">

// JSX
<div style={{ color: 'red', fontSize: '16px' }}>
// hoặc
<div style={{ color: 'red', fontSize: 16 }}>  // số cho px values
```

---

## 📦 PHẦN 3: Icon Replacement

### 3.1 Cài Đặt react-icons

```bash
npm install react-icons
```

### 3.2 Import Pattern

```tsx
// Material Design Icons
import { MdIconName } from 'react-icons/md';

// Heroicons v2
import { HiIconName } from 'react-icons/hi2';

// Font Awesome
import { FaIconName } from 'react-icons/fa';
import { FaIconName } from 'react-icons/fa6';  // FA6

// Lucide
import { LuIconName } from 'react-icons/lu';

// Remix Icons
import { RiIconName } from 'react-icons/ri';
```

### 3.3 Common Icon Mappings

| Material Symbols     | react-icons (Md)       | Heroicons (Hi2)        |
| -------------------- | ---------------------- | ---------------------- |
| `arrow_forward`      | `MdArrowForward`       | `HiArrowRight`         |
| `arrow_back`         | `MdArrowBack`          | `HiArrowLeft`          |
| `check`              | `MdCheck`              | `HiCheck`              |
| `close`              | `MdClose`              | `HiXMark`              |
| `menu`               | `MdMenu`               | `HiBars3`              |
| `search`             | `MdSearch`             | `HiMagnifyingGlass`    |
| `person`             | `MdPerson`             | `HiUser`               |
| `settings`           | `MdSettings`           | `HiCog6Tooth`          |
| `home`               | `MdHome`               | `HiHome`               |
| `email`              | `MdEmail`              | `HiEnvelope`           |
| `phone`              | `MdPhone`              | `HiPhone`              |
| `location_on`        | `MdLocationOn`         | `HiMapPin`             |
| `star`               | `MdStar`               | `HiStar`               |
| `favorite`           | `MdFavorite`           | `HiHeart`              |
| `shopping_cart`      | `MdShoppingCart`       | `HiShoppingCart`       |

### 3.4 Icon Styling

```tsx
// Thay thế Material Symbols
// TRƯỚC
<span class="material-symbols-outlined text-2xl">icon_name</span>

// SAU - Option 1: className
<MdIconName className="text-2xl" />

// SAU - Option 2: size prop
<MdIconName size={24} />

// SAU - Option 3: với màu
<MdIconName size={24} className="text-primary-500" />
```

---

## 🧩 PHẦN 4: HeroUI Components

### 4.1 Mapping HTML Elements → HeroUI

| HTML Element                | HeroUI Component               | Import                        |
| --------------------------- | ------------------------------ | ----------------------------- |
| `<button>`                  | `<Button>`                     | `@heroui/react`               |
| `<a>` (internal link)       | `<Link>` (react-router)        | `react-router`                |
| `<a>` (styled link)         | `<Link>`                       | `@heroui/react`               |
| `<input type="text">`       | `<Input>`                      | `@heroui/react`               |
| `<input type="checkbox">`   | `<Checkbox>`                   | `@heroui/react`               |
| `<select>`                  | `<Select>`, `<SelectItem>`     | `@heroui/react`               |
| `<textarea>`                | `<Textarea>`                   | `@heroui/react`               |
| `<img>`                     | `<Image>` hoặc `LazyImage`     | `@heroui/react` / custom      |
| Card layouts                | `<Card>`, `<CardBody>`, etc.   | `@heroui/react`               |
| Modal/Dialog                | `<Modal>`, `<ModalContent>`    | `@heroui/react`               |
| Navigation                  | `<Navbar>`, `<NavbarContent>`  | `@heroui/react`               |
| Tabs                        | `<Tabs>`, `<Tab>`              | `@heroui/react`               |
| Accordion                   | `<Accordion>`, `<AccordionItem>`| `@heroui/react`              |
| Avatar                      | `<Avatar>`                     | `@heroui/react`               |
| Badge                       | `<Badge>`, `<Chip>`            | `@heroui/react`               |
| Tooltip                     | `<Tooltip>`                    | `@heroui/react`               |
| Dropdown                    | `<Dropdown>`, `<DropdownMenu>` | `@heroui/react`               |

### 4.2 Button Variants

```tsx
import { Button } from '@heroui/react';

// Primary
<Button color="primary">Text</Button>

// Secondary/Bordered
<Button variant="bordered">Text</Button>

// Ghost/Light
<Button variant="light">Text</Button>

// With custom styles
<Button className="bg-[custom] hover:bg-[custom-dark]">Text</Button>

// With icon
<Button startContent={<MdIcon />}>Text</Button>
<Button endContent={<MdIcon />}>Text</Button>

// Icon only
<Button isIconOnly><MdIcon /></Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Radius
<Button radius="none">Sharp</Button>
<Button radius="sm">Small</Button>
<Button radius="md">Medium</Button>
<Button radius="lg">Large</Button>
<Button radius="full">Full</Button>
```

### 4.3 Card Component

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

<Card className="[custom-classes]" isPressable isHoverable>
  <CardHeader className="[classes]">
    {/* Header content */}
  </CardHeader>
  <CardBody className="[classes]">
    {/* Main content */}
  </CardBody>
  <CardFooter className="[classes]">
    {/* Footer content */}
  </CardFooter>
</Card>
```

### 4.4 Navbar Component

```tsx
import { 
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  NavbarMenuToggle, NavbarMenu, NavbarMenuItem
} from '@heroui/react';

<Navbar maxWidth="xl" isBordered>
  <NavbarBrand>
    {/* Logo */}
  </NavbarBrand>
  
  <NavbarContent className="hidden md:flex" justify="center">
    <NavbarItem>
      <Link href="#">Link</Link>
    </NavbarItem>
  </NavbarContent>
  
  <NavbarContent justify="end">
    <NavbarItem>
      <Button>CTA</Button>
    </NavbarItem>
    <NavbarMenuToggle className="md:hidden" />
  </NavbarContent>
  
  <NavbarMenu>
    {/* Mobile menu items */}
  </NavbarMenu>
</Navbar>
```

### 4.5 Image Component

```tsx
import { Image } from '@heroui/react';
// Hoặc custom LazyImage
import { LazyImage } from '~/components';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-auto"
  isBlurred  // blur placeholder
  isZoomed   // zoom on hover
/>
```

---

## 🏗️ PHẦN 5: Component Structure

### 5.1 File Naming Convention

```
app/
├── components/
│   ├── [project-name]/           # Thư mục cho project cụ thể
│   │   ├── [Project]Header.tsx   # Header/Navbar
│   │   ├── [Project]Hero.tsx     # Hero section
│   │   ├── [Project]Features.tsx # Features/Benefits
│   │   ├── [Project]Stats.tsx    # Stats section
│   │   ├── [Project]CTA.tsx      # Call-to-action
│   │   ├── [Project]Footer.tsx   # Footer
│   │   └── index.ts              # Barrel export
│   └── ...
├── routes/
│   └── [project-name]/
│       └── _index.tsx            # Main page
```

### 5.2 Component Template

```tsx
// [Project][Section].tsx
import { /* HeroUI components */ } from '@heroui/react';
import { /* Icons */ } from 'react-icons/md';

// Types (if needed)
interface ItemType {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

// Data (có thể extract ra file riêng)
const items: ItemType[] = [
  { id: '1', title: '...', description: '...' },
  // ...
];

export function [Project][Section]() {
  return (
    <section className="[section-classes]">
      <div className="[container-classes]">
        {/* Section content */}
      </div>
    </section>
  );
}
```

### 5.3 Barrel Export

```tsx
// app/components/[project-name]/index.ts
export { [Project]Header } from './[Project]Header';
export { [Project]Hero } from './[Project]Hero';
export { [Project]Features } from './[Project]Features';
// ... export tất cả components
```

### 5.4 Route Page

```tsx
// app/routes/[project-name]/_index.tsx
import type { Route } from './+types/_index';
import { 
  [Project]Header, 
  [Project]Hero, 
  [Project]Features,
  [Project]Footer 
} from '~/components/[project-name]';

export function meta({}: Route.MetaArgs) {
  return [
    { title: '[Page Title]' },
    { name: 'description', content: '[Page description]' },
  ];
}

export default function [Project]Page() {
  return (
    <div className="min-h-screen [theme-classes]">
      <[Project]Header />
      <main>
        <[Project]Hero />
        <[Project]Features />
        {/* Other sections */}
      </main>
      <[Project]Footer />
    </div>
  );
}
```

---

## 🎭 PHẦN 6: Animation & Transitions

### 6.1 Giữ Nguyên CSS Transitions

```tsx
// Các Tailwind transition classes giữ nguyên
className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
className="group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300"
```

### 6.2 Framer Motion (Optional)

```tsx
import { motion } from 'framer-motion';

// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  {/* Content */}
</motion.div>

// Stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

---

## 📝 PHẦN 7: Checklist Chuyển Đổi

### Pre-conversion
- [ ] Xem toàn bộ file HTML, hiểu layout và sections
- [ ] Tìm và trích xuất tailwind.config
- [ ] Liệt kê tất cả icons được sử dụng
- [ ] Liệt kê tất cả custom colors, fonts
- [ ] So sánh với app.css, xác định cần thêm gì
- [ ] Quyết định tên prefix cho project

### CSS Update
- [ ] Thêm custom colors vào @theme (nếu cần)
- [ ] Thêm Google Fonts (nếu cần)
- [ ] Thêm custom utilities (nếu cần)
- [ ] Test build để đảm bảo không có lỗi CSS

### During Conversion
- [ ] Tạo thư mục `app/components/[project-name]/`
- [ ] Chuyển đổi từng section thành component riêng
- [ ] Thay `class` → `className`
- [ ] Thay icon library → react-icons
- [ ] Thay HTML elements → HeroUI components (nếu phù hợp)
- [ ] Áp dụng bảng mapping colors/classes
- [ ] Thêm TypeScript types cho props
- [ ] Tạo barrel export (index.ts)
- [ ] Tạo route page

### Post-conversion
- [ ] Chạy dev server, mở trang
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Test dark mode (nếu có)
- [ ] Verify tất cả links hoạt động
- [ ] Verify tất cả icons hiển thị
- [ ] Verify animations/transitions
- [ ] Check accessibility (a11y)
- [ ] Remove unused imports

---

## 🚀 PHẦN 8: Ví Dụ Chuyển Đổi

### Input (HTML)
```html
<section class="py-16 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="flex flex-col items-center text-center">
        <span class="material-symbols-outlined text-4xl text-blue-500">rocket</span>
        <h3 class="text-xl font-bold mt-4">Feature Title</h3>
        <p class="text-gray-600 mt-2">Feature description text.</p>
      </div>
      <!-- more items -->
    </div>
  </div>
</section>
```

### Output (React Component)
```tsx
import { MdRocketLaunch } from 'react-icons/md';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <MdRocketLaunch size={40} />,
    title: 'Feature Title',
    description: 'Feature description text.',
  },
  // ... more features
];

export function ProjectFeatures() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-blue-500">{feature.icon}</div>
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🎯 Quick Reference Card

| Thay đổi                    | Ví dụ                                          |
| --------------------------- | ---------------------------------------------- |
| `class` → `className`       | `class="..."` → `className="..."`              |
| Self-closing tags           | `<br>` → `<br />`                              |
| Comments                    | `<!-- -->` → `{/* */}`                         |
| SVG attrs                   | `viewbox` → `viewBox`                          |
| Event handlers              | `onclick` → `onClick`                          |
| Material Icons              | `<span>icon</span>` → `<MdIcon size={24} />`   |
| Buttons                     | `<button>` → `<Button color="primary">`        |
| Cards                       | `<div>` → `<Card><CardBody>...</CardBody></Card>` |
| Links                       | `<a href>` → `<Link>` (HeroUI hoặc react-router) |
| Inputs                      | `<input>` → `<Input>`                          |
