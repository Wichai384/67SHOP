"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
    deleteProductDialogAction,
    updateProductDialogAction,
} from "@/src/app/actions";
import type { Product } from "@/src/lib/products";

type ProductManagerProps = {
    products: Product[];
    isLoggedIn: boolean;
};

type ActiveDialog =
    | { kind: "edit"; product: Product }
    | { kind: "delete"; product: Product }
    | null;

export function ProductManager({ products, isLoggedIn }: ProductManagerProps) {
    const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (activeDialog && !dialog.open) {
            dialog.showModal();
        } else if (!activeDialog && dialog.open) {
            dialog.close();
        }
    }, [activeDialog]);

    const openDialog = (dialog: Exclude<ActiveDialog, null>) => {
        setError("");
        setActiveDialog(dialog);
    };

    const closeDialog = () => {
        if (!isPending) dialogRef.current?.close();
    };

    const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (activeDialog?.kind !== "edit") return;

        const formData = new FormData(event.currentTarget);
        setIsPending(true);
        setError("");
        try {
            await updateProductDialogAction(activeDialog.product.id, formData);
            setActiveDialog(null);
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "บันทึกไม่สำเร็จ");
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (activeDialog?.kind !== "delete") return;

        setIsPending(true);
        setError("");
        try {
            await deleteProductDialogAction(activeDialog.product.id);
            setActiveDialog(null);
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "ลบสินค้าไม่สำเร็จ");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <section className="product-grid" aria-label="รายการสินค้า">
                {products.map((product) => (
                    <article className="product-card" key={product.id} data-testid="product">
                        <p className="product-index">WORKSPACE OBJECT</p>
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">฿{product.price.toLocaleString("th-TH")}</p>
                        {isLoggedIn && (
                            <div className="product-actions">
                                <button
                                    type="button"
                                    onClick={() => openDialog({ kind: "edit", product })}
                                >
                                    แก้ไข
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openDialog({ kind: "delete", product })}
                                >
                                    ลบ
                                </button>
                            </div>
                        )}
                    </article>
                ))}
                {products.length === 0 && <p className="empty-products">ไม่มีสินค้า</p>}
            </section>

            <dialog
                className="product-dialog"
                ref={dialogRef}
                aria-labelledby="product-dialog-title"
                onClose={() => {
                    setActiveDialog(null);
                    setError("");
                }}
                onCancel={(event) => {
                    if (isPending) event.preventDefault();
                }}
                onClick={(event) => {
                    if (event.target === event.currentTarget) closeDialog();
                }}
            >
                {activeDialog && (
                    <div className="dialog-content">
                        <header className="dialog-header">
                            <div>
                                <h2 className="dialog-title" id="product-dialog-title">
                                    {activeDialog.kind === "edit" ? "แก้ไขสินค้า" : "ยืนยันการลบ"}
                                </h2>
                                <p className="dialog-subtitle">
                                    {activeDialog.kind === "edit"
                                        ? "ปรับรายละเอียดสินค้าแล้วบันทึกการเปลี่ยนแปลง"
                                        : "เมื่อลบแล้วจะไม่สามารถกู้คืนรายการนี้ได้"}
                                </p>
                            </div>
                            <button
                                className="dialog-close"
                                type="button"
                                aria-label="ปิดหน้าต่าง"
                                onClick={closeDialog}
                                disabled={isPending}
                            >
                                ×
                            </button>
                        </header>

                        {activeDialog.kind === "edit" ? (
                            <form onSubmit={handleEdit}>
                                <div className="product-form-fields">
                                    <div>
                                        <label htmlFor="edit-name">ชื่อสินค้า</label>
                                        <input
                                            id="edit-name"
                                            name="name"
                                            defaultValue={activeDialog.product.name}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-price">ราคา</label>
                                        <input
                                            id="edit-price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={activeDialog.product.price}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-description">รายละเอียด</label>
                                        <textarea
                                            id="edit-description"
                                            name="description"
                                            defaultValue={activeDialog.product.description}
                                            required
                                        />
                                    </div>
                                </div>
                                {error && <p className="dialog-error" role="alert">{error}</p>}
                                <div className="dialog-actions">
                                    <button className="dialog-button" type="button" onClick={closeDialog} disabled={isPending}>
                                        ยกเลิก
                                    </button>
                                    <button className="dialog-button dialog-button-primary" type="submit" disabled={isPending}>
                                        {isPending ? "กำลังบันทึก..." : "บันทึก"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleDelete}>
                                <p className="dialog-subtitle">
                                    ต้องการลบสินค้า <span className="dialog-product-name">{activeDialog.product.name}</span> หรือไม่?
                                </p>
                                {error && <p className="dialog-error" role="alert">{error}</p>}
                                <div className="dialog-actions">
                                    <button className="dialog-button" type="button" onClick={closeDialog} disabled={isPending}>
                                        ยกเลิก
                                    </button>
                                    <button className="dialog-button dialog-button-danger" type="submit" disabled={isPending}>
                                        {isPending ? "กำลังลบ..." : "ยืนยันการลบ"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </dialog>
        </>
    );
}