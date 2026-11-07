import { useState } from "react";
import { ProductForm } from "../features/productos/components/ProductForm";
import { ProductList } from "../features/productos/components/ProductList";
import "../styles/productos.css";

const initialProducts = [
  { id: 1, name: "Paracetamol 500 mg", healthRegistration: "RSA-12345", price: 5.0 },
  { id: 2, name: "Alcohol 70%", healthRegistration: "RSA-23456", price: 8.0 },
  { id: 3, name: "Ibuprofeno 400 mg", healthRegistration: "RSA-34567", price: 7.5 },
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
    <div className="productos-container">
      <div className="productos-header-wrapper">
        <div>
          <h1 className="productos-header-title">Catálogo de Productos</h1>
          <p className="productos-header-subtitle">
            Registra y administra los productos disponibles en el sistema.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewProduct}
            className="productos-btn-primary"
          >
            Nuevo producto
          </button>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="productos-card" style={{ padding: "16px" }}>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o registro sanitario..."
          className="productos-input"
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