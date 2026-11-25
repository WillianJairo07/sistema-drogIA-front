import { useEffect, useState } from "react";
import { SupplierForm } from "../features/proveedores/components/SupplierForm";
import { SupplierList } from "../features/proveedores/components/SupplierList";
import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedor,
  listarProveedores,
} from "../features/proveedores/services/proveedorService";
import "../styles/proveedores.css";

export function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    listarProveedores()
      .then(setSuppliers)
      .catch((error) => alert(error.message));
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const value = search.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(value) ||
      supplier.document.includes(search)
    );
  });

  const handleSave = async (supplier) => {
    try {
      const guardado = editingSupplier
        ? await actualizarProveedor(editingSupplier.id, supplier)
        : await crearProveedor(supplier);

      setSuppliers((currentSuppliers) => {
        const exists = currentSuppliers.some((item) => item.id === guardado.id);
        if (exists) {
          return currentSuppliers.map((item) =>
            item.id === guardado.id ? guardado : item
          );
        }
        return [...currentSuppliers, guardado];
      });

      setShowForm(false);
      setEditingSupplier(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (supplierId) => {
    try {
      await eliminarProveedor(supplierId);
      setSuppliers((currentSuppliers) =>
        currentSuppliers.filter((supplier) => supplier.id !== supplierId)
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNewSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="proveedores-container">
      <div className="proveedores-header-wrapper">
        <div>
          <h2 className="proveedores-header-title">Gestión de Proveedores</h2>
          <p className="proveedores-header-subtitle">
            Registra y administra los proveedores de la empresa.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewSupplier}
            className="proveedores-btn-primary"
          >
            Nuevo Proveedor
          </button>
        )}
      </div>

      {showForm ? (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="proveedores-card" style={{ padding: "16px" }}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o RUC..."
              className="proveedores-input"
            />
          </div>

          <SupplierList
            suppliers={filteredSuppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
