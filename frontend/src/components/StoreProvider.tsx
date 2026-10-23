"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { catalog as seed, type Product } from "@/data/catalog";

type User = { name: string; email: string; phone?: string; createdAt: string };
type Order = { id: string; email: string; items: { productId: string; quantity: number }[]; total: number; status: string; createdAt: string };
type Store = { products: Product[]; user: User | null; cart: Record<string, number>; orders: Order[]; register: (u: User & { password: string }) => boolean; login: (email: string, password: string) => boolean; logout: () => void; addToCart: (id: string) => void; removeFromCart: (id: string) => void; clearCart: () => void; placeOrder: () => boolean; updatePrice: (id: string, price: number) => void; total: number };
const Ctx = createContext<Store | null>(null);
const read = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } };
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState(seed); const [user, setUser] = useState<User | null>(null); const [cart, setCart] = useState<Record<string, number>>({}); const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { setProducts(read("luxora_products", seed)); setUser(read("luxora_user", null)); setCart(read("luxora_cart", {})); setOrders(read("luxora_orders", [])); }, []);
  useEffect(() => { localStorage.setItem("luxora_products", JSON.stringify(products)); }, [products]); useEffect(() => { localStorage.setItem("luxora_cart", JSON.stringify(cart)); }, [cart]); useEffect(() => { localStorage.setItem("luxora_orders", JSON.stringify(orders)); }, [orders]);
  const register = (u: User & { password: string }) => { localStorage.setItem("luxora_account", JSON.stringify(u)); const safe = { name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt }; setUser(safe); localStorage.setItem("luxora_user", JSON.stringify(safe)); return true; };
  const login = (email: string, password: string) => { const a = read<User & { password: string } | null>("luxora_account", null); if (!a || a.email !== email || a.password !== password) return false; setUser(a); localStorage.setItem("luxora_user", JSON.stringify(a)); return true; };
  const logout = () => { setUser(null); localStorage.removeItem("luxora_user"); };
  const addToCart = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart((c) => { const n = (c[id] || 0) - 1; const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next; });
  const clearCart = () => setCart({}); const updatePrice = (id: string, price: number) => setProducts((ps) => ps.map((p) => p.id === id ? { ...p, price } : p));
  const total = useMemo(() => Object.entries(cart).reduce((sum, [id, qty]) => sum + (products.find((p) => p.id === id)?.price || 0) * qty, 0), [cart, products]);
  const placeOrder = () => { if (!user || !Object.keys(cart).length) return false; setOrders((os) => [{ id: `LX-${Date.now().toString().slice(-6)}`, email: user.email, items: Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity })), total, status: "demo-requested", createdAt: new Date().toISOString() }, ...os]); clearCart(); return true; };
  return <Ctx.Provider value={{ products, user, cart, orders, register, login, logout, addToCart, removeFromCart, clearCart, placeOrder, updatePrice, total }}>{children}</Ctx.Provider>;
}
export const useStore = () => { const value = useContext(Ctx); if (!value) throw new Error("useStore must be used inside StoreProvider"); return value; };
