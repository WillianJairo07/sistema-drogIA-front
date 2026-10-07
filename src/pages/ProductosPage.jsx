import { useState } from "react";

import { ProductForm } from "../features/productos/components/ProductForm";
import { ProductList } from "../features/productos/components/ProductList";

const initialProducts = [
  {
    id: 1,
    name: "Paracetamol 500 mg",
    healthRegistration: "RSA-12345",
    price: 5.0,
  },
  {
    id: 2,
    name: "Alcohol 70%",
    healthRegistration: "RSA-23456",
    price: 8.0,
  },
  {
    id: 3,
    name: "Ibuprofeno 400 mg",
    healthRegistration: "RSA-34567",
    price: 7.5,
  },
];

export function ProductosPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(value) ||
      product.healthRegistration.toLowerCase().includes(value)
    );
  });

  const handleSave = (product) => {
    setProducts((currentProducts) => {
      const exists = currentProducts.some((item) => item.id === product.id);

      if (exists) {
        return currentProducts.map((item) =>
          item.id === product.id ? product : item
        );
      }

      return [...currentProducts, product];
    });

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Catálogo de Productos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Registra y administra los productos disponibles en el sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewProduct}
          className="rounded-lg bg-[#17324c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244b6b]"
        >
          Nuevo producto
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o registro sanitario..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <ProductList
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}