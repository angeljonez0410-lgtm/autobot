import { useEffect, useState } from "react";
import { ProductForm, ProductFormData } from "@/components/product-form";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Product = ProductFormData & { id: string; archived?: boolean };

import { useBusiness } from "@/lib/business-context";
import { Spinner } from "@/components/ui/spinner";

export default function ProductsPage() {
  // Keyboard shortcut: N for new product
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "n" || e.key === "N") && (e.ctrlKey || e.metaKey)) {
        setShowForm(true);
        setEditing(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const { selectedBusinessId } = useBusiness();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Fetch products for selected business
  useEffect(() => {
    if (!user || !selectedBusinessId) return;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("business_id", selectedBusinessId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, [user, selectedBusinessId]);

  async function handleSave(data: ProductFormData) {
    setLoading(true);
    if (!user || !selectedBusinessId) return;
    if (editing) {
      await supabase.from("products").update({ ...data }).eq("id", editing.id);
    } else {
      await supabase.from("products").insert([{ ...data, business_id: selectedBusinessId }]);
    }
    // Refresh
    const { data: refreshed } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", selectedBusinessId)
      .order("created_at", { ascending: false });
    setProducts(refreshed || []);
    setShowForm(false);
    setEditing(null);
    setLoading(false);
  }

  async function handleArchive(id: string) {
    if (!window.confirm("Are you sure you want to archive this product? You can restore it later from the archived list.")) return;
    setLoading(true);
    await supabase.from("products").update({ archived: true }).eq("id", id);
    setProducts(ps => ps.map(p => p.id === id ? { ...p, archived: true } : p));
    setLoading(false);
  }

  async function handleRestore(id: string) {
    if (!window.confirm("Restore this product from archive?")) return;
    setLoading(true);
    await supabase.from("products").update({ archived: false }).eq("id", id);
    setProducts(ps => ps.map(p => p.id === id ? { ...p, archived: false } : p));
    setLoading(false);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!selectedBusinessId) return <div className="text-center py-12 text-pink-400">Select a business to manage products.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Products</h1>
      <div className="mb-6 flex justify-center">
        <button
          className="bg-gradient-to-r from-pink-300 to-purple-300 text-black font-bold px-4 py-2 rounded-xl shadow"
          onClick={() => { setShowForm(true); setEditing(null); }}
        >
          Add Product
        </button>
      </div>
      {showForm && (
        <div className="mb-8 p-4 rounded-2xl bg-white/90 border border-pink-200 shadow">
          <ProductForm
            initial={editing || undefined}
            onSubmit={handleSave}
            loading={loading}
          />
        </div>
      )}
      <div className="grid gap-4">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && products.length === 0 && <div className="text-center text-gray-400">No products yet.</div>}
        {products.filter(p => !p.archived).map(prod => (
          <div key={prod.id} className="rounded-xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-pink-200 bg-white">
            <div>
              <div className="font-bold text-lg text-purple-700">{prod.name}</div>
              <div className="text-xs text-pink-500">${prod.price}</div>
              <div className="text-xs text-gray-500">{prod.description}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 rounded bg-purple-200 hover:bg-purple-300" onClick={() => { setEditing(prod); setShowForm(true); }}>Edit</button>
              <button className="text-xs px-3 py-1 rounded bg-pink-100 hover:bg-pink-200" onClick={() => handleArchive(prod.id)}>Archive</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-pink-400 mb-2">Archived</h2>
        <div className="grid gap-2">
          {products.filter(p => p.archived).length === 0 && <div className="text-xs text-gray-400">No archived products.</div>}
          {products.filter(p => p.archived).map(prod => (
            <div key={prod.id} className="rounded-xl border border-pink-100 bg-gray-50 p-3 flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-500">{prod.name}</span>
                <span className="ml-2 text-xs text-gray-400">${prod.price}</span>
              </div>
              <button className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200" onClick={() => handleRestore(prod.id)}>Restore</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}