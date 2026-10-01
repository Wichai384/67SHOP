import Link from "next/link";
import { auth } from "@/src/auth";
import { getProducts } from "@/src/lib/products";
import { AuthButtons } from "@/src/component/auth-buttons";
import { ProductManager } from "@/src/component/product-manager";

export default async function HomePage() {
  const session = await auth();
  const products = getProducts();
  // เติม: ฟังก์ชันที่แปลงค่าเป็น true หรือ false
  const isLoggedIn = !!(session?.user);

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <h1 className="catalog-brand">
          <span className="brand-mark" aria-hidden="true">✳</span>
          ของใช้ทำงาน
        </h1>
        <nav className="catalog-nav" aria-label="เมนูหลัก">
          <Link href="/" aria-current="page">หน้าร้าน</Link>
          <Link href="/explorer">สำรวจสินค้า</Link>
        </nav>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <section className="catalog-intro" aria-labelledby="catalog-title">
        <div>
          <p className="catalog-kicker">TOOLS FOR EVERYDAY</p>
          <h2 className="catalog-title" id="catalog-title">เลือกชิ้นที่ใช่<br />ให้ทุกวันทำงาน</h2>
        </div>
      </section>

      <ProductManager products={products} isLoggedIn={isLoggedIn} />
    </main>
  );
}
