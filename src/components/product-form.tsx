"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  image_url: string;
  links: string;
};

export function ProductForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price || "",
    image_url: initial?.image_url || "",
    links: initial?.links || "",
  });
  const [error, setError] = useState<string>("");

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(form: ProductFormData) {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.price.trim()) return "Price is required.";
    if (isNaN(Number(form.price)) || Number(form.price) < 0) return "Price must be a non-negative number.";
    return "";
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={e => {
        e.preventDefault();
        const err = validate(form);
        if (err) {
          setError(err);
          return;
        }
        setError("");
        onSubmit(form);
      }}
    >
      {error && <div className="text-pink-500 text-sm text-center">{error}</div>}
      <Input
        label="Product Name"
        value={form.name}
        onChange={e => update("name", e.target.value)}
        required
        helperText="The name customers will see."
      />
      <Textarea
        label="Description"
        value={form.description}
        onChange={e => update("description", e.target.value)}
        helperText="Describe your product and its benefits."
      />
      <Input
        label="Price"
        type="number"
        value={form.price}
        onChange={e => update("price", e.target.value)}
        placeholder="$0.00"
        helperText="Enter a price in USD (e.g. 19.99)."
      />
      <Input
        label="Image URL"
        value={form.image_url}
        onChange={e => update("image_url", e.target.value)}
        placeholder="https://..."
        helperText="Paste a link to your product image (optional)."
      />
      <Input
        label="Links (comma separated)"
        value={form.links}
        onChange={e => update("links", e.target.value)}
        placeholder="https://...,https://..."
        helperText="Comma-separated links to buy or learn more."
      />
      <Button type="submit" disabled={loading} className="bg-gradient-to-r from-pink-300 to-purple-300 text-black font-bold mt-2">
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
