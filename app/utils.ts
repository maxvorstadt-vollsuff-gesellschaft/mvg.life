"use server";
import { redirect } from "next/navigation";

export async function navigate(link: string) {
  redirect(link);
}
