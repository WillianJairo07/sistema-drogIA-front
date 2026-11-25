import { useEffect, useState } from "react";
import { ProductForm } from "../features/productos/components/ProductForm";
import { ProductList } from "../features/productos/components/ProductList";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from "../features/productos/services/productoService";
import "../styles/productos.css";

export function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    listarProductos()
      .then(setProducts)
      .catch((error) => alert(error.message));
  }, []);

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(value) ||
      product.healthRegistration.toLowerCase().includes(value)
    );
  });

  const handleSave = async (product) => {
    try {
      const guardado = editingProduct
        ? await actualizarProducto(editingProduct.id, product)
        : await crearProducto(product);

      setProducts((currentProducts) => {
        const exists = currentProducts.some((item) => item.id === guardado.id);
        if (exists) {
          return currentProducts.map((item) =>
            item.id === guardado.id ? guardado : item
          );
        }
        return [...currentProducts, guardado];
      });

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    try {
      await eliminarProducto(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      alert(error.message);
    }
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
