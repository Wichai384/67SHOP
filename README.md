# 67-Shop

รวมหน้าร้านตัวอย่างที่ล็อกอินด้วย Google กับเครื่องมือ Product Explorer ไว้ในโปรเจกต์ Next.js เดียว

## เริ่มใช้งาน

```powershell
npm install
npm run dev
```

เปิด `http://localhost:3000`

## ตั้งค่า Google OAuth

คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่า Google OAuth ของเครื่อง/โปรเจกต์นั้น ไฟล์ `.env.local` ถูกละเว้นโดย Git และห้าม commit ค่า secret

## เส้นทาง

- `/` หน้าร้านตัวอย่าง พร้อมเข้าสู่ระบบและ dialog จัดการสินค้า
- `/explorer` ค้นหา/เรียงสินค้าจาก DummyJSON และจัดการรายการในหน้านี้

รายการบนหน้า Explorer มาจาก DummyJSON ส่วนการเพิ่ม/แก้ไข/ลบเป็น state ฝั่ง client จึงรีเซ็ตเมื่อโหลดข้อมูลใหม่หรือรีเฟรชหน้า

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

