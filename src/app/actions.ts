"use server";

import { auth } from "@/src/auth";
import { deleteProduct, updateProduct } from "@/src/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateProductAction(id: string, formData: FormData) {
  await saveProduct(id, formData);
  redirect("/");
}

export async function updateProductDialogAction(id: string, formData: FormData) {
  await saveProduct(id, formData);
}

async function saveProduct(id: string, formData: FormData) {
  // ตรวจ session ซ้ำฝั่ง server ถ้าไม่มีให้โยน error กันการเรียก Server Action ตรง
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!name || !description) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  updateProduct(id, { name, description, price });

  // เติม: ฟังก์ชันที่สั่งให้ Next ดึงข้อมูลหน้าแรกใหม่
  revalidatePath("/");
}

export async function deleteProductAction(id: string) {
  await removeProduct(id);
  redirect("/");
}

export async function deleteProductDialogAction(id: string) {
  await removeProduct(id);
}

async function removeProduct(id: string) {
  await requireUser();
  deleteProduct(id);
  revalidatePath("/");
}
