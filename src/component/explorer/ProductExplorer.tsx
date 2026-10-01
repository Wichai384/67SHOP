"use client";

import { useEffect, useRef, useState } from "react";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import { defaultQuery, fetchProducts } from "@/src/lib/explorer-products";
import type {
  Product, ProductDraft, ProductList, SearchQuery,
} from "@/src/lib/explorer-products";

type LoadState = "loading" | "error" | "ready";

type ProductExplorerProps = {
  isLoggedIn: boolean;
};

export default function ProductExplorer({ isLoggedIn }: ProductExplorerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const formDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (!dialog) return;
    if (formOpen && !dialog.open) dialog.showModal();
    if (!formOpen && dialog.open) dialog.close();
  }, [formOpen]);

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;
    if (deleteTarget && !dialog.open) dialog.showModal();
    if (!deleteTarget && dialog.open) dialog.close();
  }, [deleteTarget]);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    if (editing) {
      setProducts((current) =>
        current.map((item) =>
          item.id === editing.id ? { ...item, ...draft } : item
        )
      );
    } else {
      setProducts((current) => [...current, { ...draft, id: Date.now() }]);
    }
    setEditing(null);
    setFormOpen(false);
  }

  function removeProduct() {
    if (!deleteTarget) return;
    const removedProductId = deleteTarget.id;
    setProducts((current) => current.filter((item) => item.id !== deleteTarget.id));
    if (editing?.id === removedProductId) {
      setEditing(null);
    }
    setDeleteTarget(null);
  }

  return (
    <section className="explorer-workspace" aria-label="เครื่องมือสำรวจสินค้า">
      <div className="explorer-toolbar">
        <button
          className="explorer-load-button"
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
        >
          {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
        </button>
        <ProductSearchForm onSearch={loadProducts} />
      </div>

      {isLoggedIn && (
        <div className="explorer-add-row">
          <button
            className="dialog-button dialog-button-primary"
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            เพิ่มสินค้า
          </button>
        </div>
      )}

      <section className="explorer-results" aria-live="polite">
        {status === "loading" && <p>กำลังโหลดข้อมูล</p>}

        {status === "error" && <p role="alert">{errorMessage}</p>}

        {status === "ready" && products.length === 0 && (
          <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}

        {status === "ready" && products.length > 0 && (
          <table className="explorer-table">
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
                <th>รูปภาพ</th>
                {isLoggedIn && <th>จัดการ</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>฿{item.price.toLocaleString("th-TH")}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  <td>
                    {item.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        width={48}
                        height={48}
                      />
                    )}
                  </td>
                  {isLoggedIn && (
                    <td className="explorer-actions">
                      <button
                        className="dialog-button"
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          setFormOpen(true);
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="dialog-button dialog-button-danger"
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                      >
                        ลบ
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <dialog
        className="product-dialog"
        ref={formDialogRef}
        aria-labelledby="explorer-form-title"
        onClose={() => setFormOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setFormOpen(false);
        }}
      >
        {formOpen && (
          <div className="dialog-content">
            <header className="dialog-header">
              <div>
                <h2 className="dialog-title" id="explorer-form-title">
                  {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
                </h2>
                <p className="dialog-subtitle">จัดการข้อมูลสินค้าในรายการที่กำลังสำรวจ</p>
              </div>
              <button
                className="dialog-close"
                type="button"
                aria-label="ปิดหน้าต่าง"
                onClick={() => setFormOpen(false)}
              >
                ×
              </button>
            </header>
            <ProductForm
              key={editing?.id ?? "new"}
              editing={editing}
              onSave={saveProduct}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        )}
      </dialog>

      <dialog
        className="product-dialog"
        ref={deleteDialogRef}
        aria-labelledby="explorer-delete-title"
        onClose={() => setDeleteTarget(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setDeleteTarget(null);
        }}
      >
        {deleteTarget && (
          <div className="dialog-content">
            <header className="dialog-header">
              <div>
                <h2 className="dialog-title" id="explorer-delete-title">ยืนยันการลบ</h2>
                <p className="dialog-subtitle">เมื่อลบแล้วจะไม่สามารถกู้คืนรายการนี้ได้</p>
              </div>
              <button
                className="dialog-close"
                type="button"
                aria-label="ปิดหน้าต่าง"
                onClick={() => setDeleteTarget(null)}
              >
                ×
              </button>
            </header>
            <p className="dialog-subtitle">
              ต้องการลบสินค้า <strong>{deleteTarget.title}</strong> หรือไม่?
            </p>
            <div className="dialog-actions">
              <button className="dialog-button" type="button" onClick={() => setDeleteTarget(null)}>
                ยกเลิก
              </button>
              <button className="dialog-button dialog-button-danger" type="button" onClick={removeProduct}>
                ยืนยันการลบ
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}