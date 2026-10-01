"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIES,
  ProductDraftSchema,
} from "@/src/lib/explorer-products";
import type {
  Product,
  ProductDraft,
} from "@/src/lib/explorer-products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm(
  { editing, onSave, onCancel }: ProductFormProps
) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        category: editing.category,
      }
      : { title: "", price: undefined, stock: undefined },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <form className="explorer-product-form" onSubmit={handleSubmit(saveProduct)} noValidate>
      <div className="product-form-fields">
        <div>
          <label htmlFor="explorer-title">ชื่อสินค้า</label>
          <input
            id="explorer-title"
            required
            {...register("title")}
            aria-invalid={!!errors.title}
            aria-describedby="explorer-title-error"
          />
          <span id="explorer-title-error" className="field-error" role="alert">
            {errors.title?.message}
          </span>
        </div>

        <div>
          <label htmlFor="explorer-price">ราคา</label>
          <input
            id="explorer-price"
            type="number"
            min="0"
            step="0.01"
            required
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            aria-describedby="explorer-price-error"
          />
          <span id="explorer-price-error" className="field-error" role="alert">
            {errors.price?.message}
          </span>
        </div>

        <div>
          <label htmlFor="explorer-stock">จำนวนคงเหลือ</label>
          <input
            id="explorer-stock"
            type="number"
            min="0"
            required
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
            aria-describedby="explorer-stock-error"
          />
          <span id="explorer-stock-error" className="field-error" role="alert">
            {errors.stock?.message}
          </span>
        </div>

        <div>
          <label htmlFor="explorer-category">หมวดหมู่</label>
          <select
            id="explorer-category"
            required
            {...register("category")}
            aria-invalid={!!errors.category}
            aria-describedby="explorer-category-error"
          >
            <option value="">กรุณาเลือกหมวดหมู่</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <span id="explorer-category-error" className="field-error" role="alert">
            {errors.category?.message}
          </span>
        </div>
      </div>

      <div className="dialog-actions">
        <button className="dialog-button" type="button" onClick={onCancel}>
          ยกเลิก
        </button>
        <button
          className="dialog-button dialog-button-primary"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
      </div>
    </form>
  );
}