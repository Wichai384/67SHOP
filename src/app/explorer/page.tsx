import Link from "next/link";
import { auth } from "@/src/auth";
import { AuthButtons } from "@/src/component/auth-buttons";
import ProductExplorer from "@/src/component/explorer/ProductExplorer";

export default async function ExplorerPage() {
    const session = await auth();
    const isLoggedIn = Boolean(session?.user);

    return (
        <main className="catalog-shell">
            <header className="catalog-header">
                <Link className="catalog-brand" href="/">
                    <span className="brand-mark" aria-hidden="true">✳</span>
                    ของใช้ทำงาน
                </Link>
                <nav className="catalog-nav" aria-label="เมนูหลัก">
                    <Link href="/">หน้าร้าน</Link>
                    <Link href="/explorer" aria-current="page">สำรวจสินค้า</Link>
                </nav>
                <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
            </header>

            <section className="explorer-heading" aria-labelledby="explorer-title">
                <p className="catalog-kicker">PRODUCT EXPLORER</p>
                <h1 className="catalog-title" id="explorer-title">สำรวจสินค้า</h1>
                <p className="explorer-description">
                    ค้นหาและเรียงรายการสินค้าจากแคตตาล็อก พร้อมจัดการรายการในหน้านี้
                </p>
            </section>

            <ProductExplorer isLoggedIn={isLoggedIn} />
        </main>
    );
}